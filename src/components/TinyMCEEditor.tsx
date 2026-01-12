import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useRef } from 'react';
import slugify from 'slugify';
import { v4 as uuid } from 'uuid';

import { devConsoleWarn } from '@/helpers/devConsoleLogs';
import {
  CreateArticleImage,
  uploadArticleImage,
} from '@/helpers/imageUploadApi';
import { Language } from '@/types';

interface TinyMCEEditorProps {
  readonly id?: string;
  readonly articleId: number;
  readonly language: Language;
  readonly value?: string;
  readonly onChange: (content: string) => void;
  readonly reset?: boolean;
}

export const TinyMCEEditor = ({
  id,
  articleId,
  language,
  value,
  onChange,
  reset,
}: TinyMCEEditorProps) => {
  const editorRef = useRef<Editor>(null);
  const generateImageId = () => `content-image-${uuid()}`;

  const handleResetEditor = () => {
    if (editorRef.current?.editor) {
      editorRef.current.editor.setContent('');
      editorRef.current.editor.undoManager?.clear();
      editorRef.current.editor.undoManager?.add();
      editorRef.current.editor.setDirty(false);
    }
  };

  useEffect(() => {
    if (reset) {
      handleResetEditor();
    }
  }, [reset]);

  return (
    <Editor
      id={id}
      tinymceScriptSrc='/tinymce/tinymce.min.js'
      value={value}
      licenseKey='gpl'
      ref={editorRef}
      disabled={!articleId}
      init={{
        language_load: true,
        height: 500,
        menubar: true,
        language_url: '/langs/ru.js',
        external_plugins: {
          gitcode: '/tinymce-plugins/gitcode/index.js',
        },
        language: language,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'preview',
          'help',
          'wordcount',
          'gitcode',
        ],
        toolbar:
          'undo redo | gitcode | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media | removeformat | help',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        automatic_uploads: true,
        forced_root_block: 'div',
        force_br_newlines: true,
        valid_elements: '*[*]',
        extended_valid_elements: 'img[id|src|alt|class|width|height|style]',
        images_upload_handler: (blobInfo) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', blobInfo.blob());
            const formDataObject = Object.fromEntries(
              formData.entries(),
            ) as unknown as CreateArticleImage;
            uploadArticleImage(articleId, formDataObject)
              .then((url) => {
                resolve(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`);
              })
              .catch((error) => {
                devConsoleWarn('Failed to upload image:', error);
                reject(new Error('Failed to upload image'));
              });
          });
        },
        setup: (editor) => {
          editor.on('BeforeSetContent', (event) => {
            const content = event.content;
            event.content = content.replaceAll('<img', (match) => {
              if (match.includes('img')) {
                return `<img id="${generateImageId()}"`;
              }
              return match;
            });
          });

          const processHeadings = () => {
            const body = editor.getBody();
            const slugCounts = new Map<string, number>();
            Array.from(body?.querySelectorAll('h1,h2,h3,h4,h5,h6')).forEach(
              (heading) => {
                const text = heading.textContent ?? '';
                const baseSlug = slugify(text, { lower: true, strict: true });
                const count = slugCounts.get(baseSlug) ?? 0;

                slugCounts.set(baseSlug, count + 1);
                const finalSlug = count > 0 ? `${baseSlug}-${count}` : baseSlug;

                if (heading.id !== finalSlug) {
                  editor.dom.setAttrib(heading, 'id', finalSlug);
                }
              },
            );
          };

          // Дебаунс 300ms + RAF для производительности
          let timeout: number;
          editor.on('input change', () => {
            cancelAnimationFrame(timeout);
            timeout = requestAnimationFrame(() => {
              processHeadings();
            });
          });

          // Обработка при инициализации
          editor.on('init', () => {
            processHeadings();
          });
        },
        media_live_embeds: true,
      }}
      onEditorChange={onChange}
    />
  );
};
