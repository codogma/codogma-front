'use client';
import parse, { DOMNode, Element } from 'html-react-parser';
import React, {
  createContext,
  CSSProperties,
  FC,
  ReactNode,
  useContext,
} from 'react';

import { DefaultImage } from '@/components/DefaultImage';
import { devConsoleInfo } from '@/helpers/devConsoleLogs';

interface ContentImageContextType {
  processContent: (content: string) => ReactNode | null;
}

const parseStyleString = (styleString: string): CSSProperties => {
  return styleString
    .split(';')
    .filter((style) => style.trim())
    .reduce((acc: CSSProperties, style) => {
      const [property, value] = style.split(':');
      if (property && value) {
        acc[property.trim() as keyof CSSProperties] = value.trim();
      }
      return acc;
    }, {});
};

const ContentImageContext = createContext<ContentImageContextType | null>(null);

export const ContentImageProvider: FC<{ readonly children: ReactNode }> = ({
  children,
}) => {
  const replaceImagesInContent = (content: string) => {
    if (!content) return null;

    return parse(content, {
      replace: (domNode: DOMNode) => {
        if (
          domNode instanceof Element &&
          domNode.name === 'img' &&
          domNode.attribs?.id?.startsWith('content-image')
        ) {
          devConsoleInfo(domNode);
          const styleObject = domNode.attribs?.style
            ? parseStyleString(domNode.attribs.style)
            : undefined;
          return (
            <DefaultImage
              src={domNode.attribs.src}
              alt={domNode.attribs.alt}
              width={domNode.attribs?.width}
              height={domNode.attribs?.height}
              style={styleObject}
              className='content-image'
              quality={70}
              position='relative'
            />
          );
        }
      },
    });
  };

  const processContent = (content: string) => replaceImagesInContent(content);

  return (
    <ContentImageContext.Provider value={{ processContent }}>
      {children}
    </ContentImageContext.Provider>
  );
};

export const useContentImageContext = () => {
  const context = useContext(ContentImageContext);
  if (!context) {
    throw new Error(
      'useContentImageContext must be used within a ContentImageProvider',
    );
  }
  return context;
};
