'use client';
import parse, { DOMNode, Element } from 'html-react-parser';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { DefaultImage } from '@/components/DefaultImage';

interface ContentImageContextType {
  processContent: (content: string) => ReactNode | null;
}

const parseStyleString = (styleString: string): Record<string, string> => {
  return styleString
    .split(';')
    .filter((style) => style.trim())
    .reduce((acc: Record<string, string>, style) => {
      const [property, value] = style.split(':');
      if (property && value) {
        acc[property.trim()] = value.trim();
      }
      return acc;
    }, {});
};

const replaceImagesInContent = (content: string): ReactNode | null => {
  if (!content) return null;

  return parse(content, {
    replace: (domNode: DOMNode) => {
      if (
        domNode instanceof Element &&
        domNode.name === 'img' &&
        domNode.attribs?.id?.startsWith('content-image')
      ) {
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

const ContentImageContext = createContext<ContentImageContextType | null>(null);

export const ContentImageProvider: FC<{ readonly children: ReactNode }> = ({
  children,
}) => {
  const processContent = useCallback(
    (content: string) => replaceImagesInContent(content),
    [],
  );

  const value = useMemo(() => ({ processContent }), [processContent]);

  return (
    <ContentImageContext.Provider value={value}>
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
