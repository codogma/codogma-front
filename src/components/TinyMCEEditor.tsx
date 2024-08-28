import React from "react";
import {Editor} from '@tinymce/tinymce-react';
import {uploadImage} from "@/helpers/imageUploadApi";

interface TinyMCEEditorProps {
    defaultValue?: string
    value?: string;
    onChange: (content: string) => void;
}

export const TinyMCEEditor = ({defaultValue, value, onChange}: TinyMCEEditorProps) => {
    return (
        <Editor
            tinymceScriptSrc='/tinymce/tinymce.min.js'
            initialValue={defaultValue}
            value={value}
            licenseKey="gpl"
            init={{
                height: 500,
                menubar: true,
                language: 'ru',
                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'],
                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media | removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                automatic_uploads: true,
                images_upload_handler: (blobInfo) => {
                    return new Promise((resolve, reject) => {
                        const formData = new FormData();
                        formData.append('image', blobInfo.blob());

                        uploadImage(formData)
                            .then((url) => {
                                resolve(url);
                            })
                            .catch((error) => {
                                console.error("Failed to upload image:", error);
                                reject("Failed to upload image");
                            });
                    });
                },
                media_live_embeds: true
            }}
            onEditorChange={onChange}
        />
    );
};