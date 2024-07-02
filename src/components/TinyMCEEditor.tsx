import dynamic from 'next/dynamic';
import React from "react";

const BundledEditor = dynamic(() => import('@/components/BundledEditor'), {
    ssr: false,
});

interface TinyMCEEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange }) => {
    return (
        <BundledEditor
            value={value}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | removeformat | help'
            }}
            onEditorChange={onChange}
        />
    );
};