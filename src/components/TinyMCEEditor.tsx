import dynamic from 'next/dynamic';
import React from "react";

const BundledEditor = dynamic(() => import('@/components/BundledEditor'), {
    ssr: false,
});

interface TinyMCEEditorProps {
    defaultValue?: string
    value?: string;
    onChange: (content: string) => void;
}

export const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({defaultValue, value, onChange}) => {
    return (
        <BundledEditor
            defaultValue={defaultValue}
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