import * as pdfjsLib from 'pdfjs-dist';

// Set up worker source for browser environment
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function parsePdfFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    const numPages = pdfDocument.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageStrings = textContent.items
        .map((item: any) => (item.str ? item.str : ''))
        .join(' ');

      fullText += pageStrings + '\n\n';
    }

    if (!fullText.trim()) {
      throw new Error('PDF file appears to be empty or image-based (OCR required).');
    }

    return fullText.trim();
  } catch (error: any) {
    console.error('PDF Parsing Error:', error);
    throw new Error(`Failed to parse PDF file: ${error.message || error}`);
  }
}
