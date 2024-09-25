import { Parser } from 'htmlparser2';
import { decodeHTML } from 'entities';

export function convertHtmlToText(html: string): string {
  let text: string = '';
  const decodedHtml = decodeHTML(html);
  const parser = new Parser({
    ontext(content) {
      text += content;
    },
  });
  parser.write(decodedHtml);
  parser.end();
  return text
    .replace(/[\n\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
