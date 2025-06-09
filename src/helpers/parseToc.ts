import { Parser } from 'htmlparser2';

import { convertHtmlToText } from '@/helpers/convertHtmlToText';

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export const parseToc = (html: string | undefined): Promise<TocItem[]> => {
  return new Promise((resolve) => {
    if (!html) return resolve([]);

    const items: TocItem[] = [];
    let currentTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | null = null;
    let currentId = '';
    let currentText = '';
    let currentLevel = 0;

    const parser = new Parser(
      {
        onopentag(name, attribs) {
          if (/^h[1-6]$/i.test(name)) {
            currentTag = name.toLowerCase() as typeof currentTag;
            if (currentTag != null) {
              currentLevel = parseInt(currentTag[1], 10);
            }
            currentId = attribs.id || '';
            currentText = '';
          }
        },

        ontext(text) {
          if (currentTag && currentId) {
            currentText += text;
          }
        },

        onclosetag(name) {
          if (currentTag === name.toLowerCase()) {
            if (currentId && currentText) {
              items.push({
                id: currentId,
                text: convertHtmlToText(currentText),
                level: currentLevel,
              });
            }
            currentTag = null;
            currentId = '';
            currentText = '';
          }
        },

        onend() {
          resolve(items);
        },
      },
      { decodeEntities: true },
    );

    parser.write(html);
    parser.end();
  });
};
