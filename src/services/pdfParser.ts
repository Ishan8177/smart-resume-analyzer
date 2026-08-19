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
      
      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items as any[]) {
        if (!item.str && !item.hasEOL) continue;

        const str = item.str || '';
        const currentY = item.transform ? item.transform[5] : null;
        const hasEOL = Boolean(item.hasEOL);

        // Detect new lines based on Y-coordinate shift or explicit EOL flag
        if (lastY !== null && currentY !== null && Math.abs(lastY - currentY) > 4) {
          pageText += '\n';
        } else if (hasEOL && !pageText.endsWith('\n')) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith('\n') && !pageText.endsWith(' ') && str.trim().length > 0) {
          pageText += ' ';
        }

        pageText += str;
        if (currentY !== null) {
          lastY = currentY;
        }
      }

      fullText += pageText + '\n\n';
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
