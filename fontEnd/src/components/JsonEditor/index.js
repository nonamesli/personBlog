import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import './index.scss';

const highlight = (code) => {
    try {
        return Prism.highlight(code, Prism.languages.json, 'json');
    } catch (e) {
        return code;
    }
};

const JsonEditor = ({ value, onChange }) => {
    const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

    return (
        <div className='json-editor-wrapper'>
            <Editor
                value={text}
                onValueChange={onChange}
                highlight={highlight}
                padding={16}
                className='json-editor'
                textareaClassName='json-editor-textarea'
            />
        </div>
    );
};

export default JsonEditor;
