const HTML_TAG_REGEX = /<\/?[a-z][\s\S]*>/i;
const EMPTY_PARAGRAPH_REGEX = /<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi;

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Chuẩn hóa nội dung rich text, giải quyết các vấn đề sau:
 * 1. Xuống dòng trong văn bản thuần không hiển thị được trong HTML;
 * 2. Thẻ <p> trống do TipTap tạo ra không có chiều cao.
 */
export const normalizeRichTextContent = (content?: string) => {
  if (!content) return "";

  let normalized = content;

  if (!HTML_TAG_REGEX.test(content)) {
    normalized = escapeHtml(content).replace(/\r\n|\r|\n/g, "<br />");
  }

  return normalized.replace(EMPTY_PARAGRAPH_REGEX, "<p><br /></p>");
};
