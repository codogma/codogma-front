import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import { devConsoleError } from '@/helpers/devConsoleLogs';
import { uploadImage } from '@/helpers/imageUploadApi';

interface TinyMCEEditorProps {
  readonly defaultValue?: string;
  readonly value?: string;
  readonly onChange: (content: string) => void;
  readonly reset?: boolean;
}

export const TinyMCEEditor = ({
  defaultValue,
  value,
  onChange,
  reset,
}: TinyMCEEditorProps) => {
  const editorRef = useRef<Editor>(null);
  const generateImageId = () => `content-image-${uuid()}`;
  const language = String(localStorage.getItem('i18nextLng'));

  const handleResetEditor = () => {
    if (editorRef.current) {
      editorRef.current.editor?.setContent('');
      editorRef.current.editor?.undoManager?.clear();
      editorRef.current.editor?.undoManager?.add();
      editorRef.current.editor?.setDirty(false);
    }
  };

  useEffect(() => {
    if (reset) {
      handleResetEditor();
    }
  }, [reset]);

  return (
    <Editor
      tinymceScriptSrc='/tinymce/tinymce.min.js'
      initialValue={defaultValue}
      value={value}
      licenseKey='gpl'
      ref={editorRef}
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
            uploadImage(formData)
              .then((url) => {
                resolve(url);
              })
              .catch((error) => {
                devConsoleError('Failed to upload image:', error);
                reject('Failed to upload image');
              });
          });
        },
        setup: (editor) => {
          editor.on('BeforeSetContent', (event) => {
            const content = event.content;
            event.content = content.replace(/<img/g, (match) => {
              if (match.includes('img')) {
                return `<img id="${generateImageId()}"`;
              }
              return match;
            });
          });
        },
        media_live_embeds: true,
      }}
      onEditorChange={onChange}
    />
  );
};
