'use client';
import React, { createContext, FC, ReactNode, useContext } from 'react';
import { DefaultImage } from '@/components/DefaultImage';
import parse from 'html-react-parser';

interface ContentImageContextType {
  processContent: (content: string) => ReactNode | null;
}

const ContentImageContext = createContext<ContentImageContextType | null>(null);

export const ContentImageProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const replaceImagesInContent = (content: string) => {
    if (!content) return null;

    return parse(content, {
      replace: (domNode: any) => {
        if (
          domNode.name === 'img' &&
          domNode.attribs?.id?.startsWith('content-image')
        ) {
          return (
            <DefaultImage
              src={domNode.attribs.src}
              alt='content image'
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
