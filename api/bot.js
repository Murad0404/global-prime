export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(200).send('OK');
  }

  try {
    const { message } = req.body;
    
    if (!message || !message.text) {
      return res.status(200).send('OK');
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const token = '8876444321:AAH7etXOVPSqoq4jXleTy9LiZA-Ebi3klOk';

    // Helper to send messages
    const sendMessage = async (chat_id, text) => {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text })
      });
    };

    if (text === '/start') {
      await sendMessage(chatId, "Xush kelibsiz! Saytdan buyurtmalarni qabul qilish uchun /ravshan buyrug'ini yuboring.");
    } 
    else if (text === '/ravshan') {
      // Update Firestore using REST API to avoid big dependencies
      await fetch("https://firestore.googleapis.com/v1/projects/global-prime-5abc4/databases/(default)/documents/settings/general?updateMask.fieldPaths=telegramChatId", {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            telegramChatId: { stringValue: chatId.toString() }
          }
        })
      });
      
      await sendMessage(chatId, "✅ Siz admin etib tayinlandingiz! Saytdagi barcha yangi buyurtmalar endi shu yerga keladi.");
    }

    // Always return 200 OK to Telegram so it doesn't retry
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling telegram webhook:', error);
    return res.status(200).send('Error');
  }
}
