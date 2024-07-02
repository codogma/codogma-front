import React from 'react';
import {Editor as TinyMCEEditor} from '@tinymce/tinymce-react';

if (typeof window !== "undefined") {
    require('tinymce/tinymce');
    require('tinymce/models/dom/model');
    require('tinymce/themes/silver');
    require('tinymce/icons/default');
    require('tinymce/skins/ui/oxide/skin');
    require('tinymce/plugins/advlist');
    require('tinymce/plugins/anchor');
    require('tinymce/plugins/autolink');
    require('tinymce/plugins/autoresize');
    require('tinymce/plugins/autosave');
    require('tinymce/plugins/charmap');
    require('tinymce/plugins/code');
    require('tinymce/plugins/codesample');
    require('tinymce/plugins/directionality');
    require('tinymce/plugins/emoticons');
    require('tinymce/plugins/fullscreen');
    require('tinymce/plugins/help');
    require('tinymce/plugins/help/js/i18n/keynav/en');
    require('tinymce/plugins/image');
    require('tinymce/plugins/importcss');
    require('tinymce/plugins/insertdatetime');
    require('tinymce/plugins/link');
    require('tinymce/plugins/lists');
    require('tinymce/plugins/media');
    require('tinymce/plugins/nonbreaking');
    require('tinymce/plugins/pagebreak');
    require('tinymce/plugins/preview');
    require('tinymce/plugins/quickbars');
    require('tinymce/plugins/save');
    require('tinymce/plugins/searchreplace');
    require('tinymce/plugins/table');
    require('tinymce/plugins/visualblocks');
    require('tinymce/plugins/visualchars');
    require('tinymce/plugins/wordcount');
    require('tinymce/plugins/emoticons/js/emojis');
    require('tinymce/skins/content/default/content');
    require('tinymce/skins/ui/oxide/content');
}

const BundledEditor: React.FC<any> = (props) => {
    return (
        <TinyMCEEditor
            licenseKey="gpl"
            {...props}
        />
    );
};

export default BundledEditor;