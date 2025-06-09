import { decodeHTML } from 'entities';
import { Parser } from 'htmlparser2';

export function convertHtmlToText(html: string): string {
  let text: string = '';
  if (!html) return text;
  const decodedHtml = decodeHTML(html);
  const parser = new Parser({
    ontext(content) {
      text += content;
    },
  });
  parser.write(decodedHtml);
  parser.end();
  return (
    text
      // 1) Заменяем переводы строк на пробелы
      .replace(/[\r\n]+/g, ' ')
      // 2) Убираем всё, кроме букв (включая кириллицу и латиницу), цифр, пунктуации и пробелов
      .replace(/[^\p{L}\p{N}\p{P}\s]+/gu, '')
      // 3) Сводим подряд идущие пробелы в один
      .replace(/\s+/g, ' ')
      // 4) Обрезаем пробелы по краям
      .trim()
  );
}
