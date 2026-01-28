import axios from "axios";
import FormData from "form-data";

const NUTRIENT_API_KEY = process.env.NUTRIENT_API_KEY;
const NUTRIENT_BUILD_URL = "https://api.nutrient.io/build";
const NUTRIENT_OCR_URL = "https://api.nutrient.io/processor/ocr";

const MIN_REAL_TEXT_LENGTH = 100;

export interface ConvertPdfToMarkdownResult {
  markdown: string;
  isOcrUsed: boolean;
}

function getRealTextContent(markdown: string): string {
  // @ts-ignore: 2339
  const imageRegex = /!\[.*?\]\(.*?\)/gs;
  return markdown.replace(imageRegex, "").trim();
}

async function performOcr(pdfBuffer: Buffer): Promise<Buffer> {
  const formData = new FormData();
  formData.append('data', JSON.stringify({ language: "english", output: "pdf" }));
  formData.append('file', pdfBuffer, { filename: "ocr.pdf", contentType: "application/pdf" });

  const response = await axios.post(NUTRIENT_OCR_URL, formData, {
    headers: formData.getHeaders({ Authorization: `Bearer ${NUTRIENT_API_KEY}` }),
    responseType: "arraybuffer",
    timeout: 60000,
  });
  return Buffer.from(response.data);
}

export async function convertPdfToMarkdown(
  pdfBuffer: Buffer,
  useFallbackOcr: boolean = true
): Promise<ConvertPdfToMarkdownResult> {
  if (!NUTRIENT_API_KEY) {
    throw new Error("NUTRIENT_API_KEY is not configured");
  }

  const formData = new FormData();
  formData.append(
    "instructions",
    JSON.stringify({
      parts: [{ file: "file" }],
      output: { type: "markdown" },
    })
  );

  formData.append("file", pdfBuffer, {
    filename: "document.pdf",
    contentType: "application/pdf",
  });

  try {
    const response = await axios.post(NUTRIENT_BUILD_URL, formData, {
      headers: formData.getHeaders({
        Authorization: `Bearer ${NUTRIENT_API_KEY}`,
      }),
      timeout: 30000,
      responseType: "text",
    });

    const markdown = response.data;
    const realTextContent = getRealTextContent(markdown);

    if (useFallbackOcr && realTextContent.length < MIN_REAL_TEXT_LENGTH) {
      try {
        const ocrPdfBuffer = await performOcr(pdfBuffer);
        const retryResult = await convertPdfToMarkdown(ocrPdfBuffer, false);
        return {
          markdown: retryResult.markdown,
          isOcrUsed: true
        };
      } catch (ocrError) {
        console.warn("OCR fallback failed:", ocrError);
        throw new Error("PDF conversion resulted in insufficient text, and OCR fallback failed.");
      }
    }

    const cleanMarkdown = markdown.replace(/!\[.*?\]\(data:image.*?\)/g, "[Image Removed]");

    return {
      markdown: cleanMarkdown,
      isOcrUsed: false,
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      throw new Error(`PDF conversion failed: ${typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)}`);
    }
    throw error;
  }
}

export async function checkPdfServiceHealth(): Promise<boolean> {
  if (!NUTRIENT_API_KEY) {
    return false;
  }
  return true;
}