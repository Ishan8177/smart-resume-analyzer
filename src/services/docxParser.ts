import mammoth from 'mammoth';

export async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    const text = result.value || '';
    if (!text.trim()) {
      throw new Error('DOCX file appears to be empty or contains unsupported elements.');
    }

    return text.trim();
  } catch (error: any) {
    console.error('DOCX Parsing Error:', error);
    throw new Error(`Failed to parse DOCX file: ${error.message || error}`);
  }
}
