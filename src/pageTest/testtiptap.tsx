import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TextAlign } from '@tiptap/extension-text-align'

import RichTextEditor2 from '../component/RichTextEditor2'
export const TiptapEditor = () => {
    // 初始化 Editor
    const [questionContent, setQuestionContent] = useState(
        `
            <p>點擊上方按鈕測試表格功能：</p>
            <table>
                <tbody>
                    <tr>
                        <td>(A) viable</td>
                        <td>(B) vendor</td>
                    </tr>
                    <tr>
                        <td>(C) character</td>
                        <td>(D) custard</td>
                    </tr>
                </tbody>
            </table>
        `
    )


    const editor = useEditor({
        extensions: [
            StarterKit,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'left',
            }),

        ],
        content: `
            <p>點擊上方按鈕測試表格功能：</p>
            <table>
                <tbody>
                    <tr>
                        <td>(A) viable</td>
                        <td>(B) vendor</td>
                    </tr>
                    <tr>
                        <td>(C) character</td>
                        <td>(D) custard</td>
                    </tr>
                </tbody>
            </table>
        `,
        onUpdate: ({ editor }) => {
            // 取得 HTML 格式內容
            const html = editor.getHTML()
            console.log('當前內容 HTML:', html)
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="tiptap-container">

            <RichTextEditor2
                value={questionContent}
                onChange={(html) => setQuestionContent(html)}
            />
        </div>
    )
}

export default TiptapEditor





