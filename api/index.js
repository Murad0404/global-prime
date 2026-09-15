import { kv } from '@vercel/kv';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(request, response) {
  // Add CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // Vercel serverless functions parse request.url differently depending on if it's hit directly or via rewrite.
    // request.url could be "/api/products" or "/products" depending on rewrite. 
    // To be safe, we can parse request.url.
    const urlStr = request.url.split('?')[0]; // simple path
    const segments = urlStr.split('/').filter(Boolean);
    
    // Determine the resource and ID
    // If it comes through rewrite, it might be just "products" or "products/1"
    // Or it might be "api/products/1"
    const resourceIndex = segments.includes('api') ? segments.indexOf('api') + 1 : 0;
    const resource = segments[resourceIndex]; // 'products', 'heroSlides', or 'upload'
    const id = segments[resourceIndex + 1]; // e.g. '1'

    // UPLOAD LOGIC
    if (resource === 'upload' && request.method === 'POST') {
      const { filename, base64 } = request.body || {};
      if (!filename || !base64) {
        return response.status(400).json({ error: 'Filename and base64 data required' });
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(base64.split(',')[1] || base64, 'base64');
      const blob = await put(filename, buffer, { access: 'public' });
      
      return response.status(200).json({ url: blob.url });
    }

    // CRUD LOGIC (products or heroSlides)
    if (resource === 'products' || resource === 'heroSlides') {
      const kvKey = `global_ptime_${resource}`;

      // Seed data if KV is empty
      let dataList = await kv.get(kvKey);
      
      if (!dataList) {
        try {
          const dbPath = path.join(__dirname, '../db.json');
          if (fs.existsSync(dbPath)) {
            const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
            dataList = dbData[resource] || [];
            await kv.set(kvKey, dataList);
          } else {
            dataList = [];
          }
        } catch (e) {
          dataList = [];
        }
      }

      // GET all or by ID
      if (request.method === 'GET') {
        if (id) {
          const item = dataList.find(i => String(i.id) === String(id));
          if (!item) return response.status(404).json({ error: 'Not found' });
          return response.status(200).json(item);
        }
        return response.status(200).json(dataList);
      }

      // POST new item
      if (request.method === 'POST') {
        const newItem = request.body || {};
        if (!newItem.id) {
          newItem.id = String(Date.now());
        }
        dataList.push(newItem);
        await kv.set(kvKey, dataList);
        return response.status(201).json(newItem);
      }

      // PUT (Update) item
      if (request.method === 'PUT') {
        if (!id) return response.status(400).json({ error: 'ID is required for PUT' });
        const updatedItem = request.body || {};
        const index = dataList.findIndex(i => String(i.id) === String(id));
        if (index !== -1) {
          dataList[index] = { ...dataList[index], ...updatedItem, id: dataList[index].id }; 
          await kv.set(kvKey, dataList);
          return response.status(200).json(dataList[index]);
        }
        return response.status(404).json({ error: 'Not found' });
      }

      // DELETE item
      if (request.method === 'DELETE') {
        if (!id) return response.status(400).json({ error: 'ID is required for DELETE' });
        const filteredList = dataList.filter(i => String(i.id) !== String(id));
        await kv.set(kvKey, filteredList);
        return response.status(200).json({});
      }
    }

    return response.status(404).json({ error: 'Resource not found' });

  } catch (error) {
    console.error('API Error:', error);
    return response.status(500).json({ error: error.message });
  }
}
