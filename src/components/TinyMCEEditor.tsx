import { Editor } from '@tinymce/tinymce-react';
import React from 'react';
import { v4 as uuid } from 'uuid';

import { devConsoleError } from '@/helpers/devConsoleLog';
import { uploadImage } from '@/helpers/imageUploadApi';

interface TinyMCEEditorProps {
  readonly defaultValue?: string;
  readonly value?: string;
  readonly onChange: (content: string) => void;
}

export const TinyMCEEditor = ({
  defaultValue,
  value,
  onChange,
}: TinyMCEEditorProps) => {
  const generateImageId = () => `content-image-${uuid()}`;
  return (
    <Editor
      tinymceScriptSrc='/tinymce/tinymce.min.js'
      initialValue={defaultValue}
      value={value}
      licenseKey='gpl'
      init={{
        height: 500,
        menubar: true,
        language: 'ru',
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
        ],
        toolbar:
          'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media | removeformat | help',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        automatic_uploads: true,
        forced_root_block: 'div',
        force_br_newlines: true,
        force_p_newlines: false,
        valid_elements: '*[*]',
        extended_valid_elements: 'img[id|src|alt|class]',
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
