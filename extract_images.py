import fitz
import os
import glob

pdf_files = glob.glob("/Users/admin/.gemini/antigravity-ide/brain/1481d66a-c834-453b-a4f9-e8695d746c6e/.user_uploaded/*.pdf")
output_dir = "/Users/admin/.gemini/antigravity-ide/brain/1481d66a-c834-453b-a4f9-e8695d746c6e/scratch/extracted_images"
os.makedirs(output_dir, exist_ok=True)

for pdf_path in pdf_files:
    pdf_name = os.path.basename(pdf_path)
    doc = fitz.open(pdf_path)
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            image_filename = f"{pdf_name}_page{page_num+1}_img{img_index+1}.{image_ext}"
            with open(os.path.join(output_dir, image_filename), "wb") as f:
                f.write(image_bytes)
            print(f"Extracted {image_filename}")
