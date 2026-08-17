import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TextAlign } from '@tiptap/extension-text-align'
// 內嵌編輯器樣式，無需引用外部 CSS
const editorStyles = `
/* Tiptap 編輯器外框與內容容器 */
.tiptap-container {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    background-color: #fff;
    color: #333;
}

.tiptap-container .ProseMirror {
    outline: none;
    min-height: 200px;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    text-align: left;
}

/* 表格專屬樣式 */
.tiptap-container .ProseMirror table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 12px 0;
    overflow: hidden;
    border: 2px solid #1a202c; /* 外框邊框 */
}

.tiptap-container .ProseMirror td,
.tiptap-container .ProseMirror th {
    min-width: 1em;
    border: 1px solid #a0aec0; /* 格子邊框 */
    padding: 8px 12px;
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
}

.tiptap-container .ProseMirror th {
    font-weight: bold;
    text-align: left;
    background-color: #edf2f7;
}

/* 被選取的儲存格高亮 */
.tiptap-container .ProseMirror .selectedCell:after {
    z-index: 2;
    position: absolute;
    content: "";
    left: 0; right: 0; top: 0; bottom: 0;
    background: rgba(66, 153, 225, 0.2);
    pointer-events: none;
}

/* 表格拉動欄寬的軸線 */
.tiptap-container .ProseMirror .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: -0.5px;
    width: 4px;
    background-color: #3182ce;
    pointer-events: none;
}

/* 按鈕美化 */
.tiptap-btn-group button {
    background-color: #f7fafc;
    border: 1px solid #cbd5e0;
    color: #2d3748;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.tiptap-btn-group button:hover {
    background-color: #edf2f7;
    border-color: #a0aec0;
}
`

export interface ToolbarControls {
    bold?: boolean
    italic?: boolean
    alignLeft?: boolean
    alignCenter?: boolean
    alignRight?: boolean
    insertTable?: boolean
    addColumn?: boolean
    deleteColumn?: boolean
    addRow?: boolean
    deleteRow?: boolean
    deleteTable?: boolean
}

const defaultControls: Required<ToolbarControls> = {
    bold: true,
    italic: true,
    alignLeft: true,
    alignCenter: true,
    alignRight: true,
    insertTable: true,
    addColumn: true,
    deleteColumn: true,
    addRow: true,
    deleteRow: true,
    deleteTable: true,
}

interface RichTextEditorProps {
    value?: string
    onChange?: (html: string) => void
    disabled?: boolean
    controls?: ToolbarControls
}


/**
 * ### RichTextEditor2 編輯器元件
 * 
 * 基於 Tiptap 的文字編輯器，支援 Markdown 語法和表格功能。
 * 
 * @example
 * // 基本用法
 * <RichTextEditor2 value={text} onChange={setText} />
 * 
 * @example
 * // 禁用編輯器
 * <RichTextEditor2 value={text} disabled />
 * 
 * @example
 * // 自訂工具列顯示
 * <RichTextEditor2
 *   value={text}
 *   controls={{
 *     bold: true,
 *     italic: true,
 *     insertTable: true,
 *     addColumn: true,
 *     deleteColumn: true,
 *     addRow: true,
 *     deleteRow: true,
 *     deleteTable: true,
 *   }}
 * />
 * 
 * @param value           編輯器的 HTML 格式文字內容。
 * @param onChange        內容變更時的回調函式，傳入最新 HTML。
 * @param disabled        設為 `true` 可切換為唯讀/禁用狀態。
 * @param controls        控制工具列各個按鈕的顯示/隱藏設定。
 *
 */
export const RichTextEditor2: React.FC<RichTextEditorProps> = ({
    value = '',
    onChange,
    disabled = false,
    controls = {},
}) => {
    const mergedControls = { ...defaultControls, ...controls }

    const editor = useEditor({
        editable: !disabled,
        extensions: [
            StarterKit,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'left',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
    })

    // 當外部 value 改變時同步更新 editor
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    if (!editor) return null

    return (
        <div className="tiptap-container">
            <style>{editorStyles}</style>
            {/* 工具列 */}
            {!disabled && (
                <div className="tiptap-btn-group" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {mergedControls.bold && (
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            style={{ fontWeight: editor.isActive('bold') ? 'bold' : 'normal', background: editor.isActive('bold') ? '#e2e8f0' : undefined }}
                        >
                            粗體
                        </button>
                    )}
                    {mergedControls.italic && (
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            style={{ fontStyle: editor.isActive('italic') ? 'italic' : 'normal', background: editor.isActive('italic') ? '#e2e8f0' : undefined }}
                        >
                            斜體
                        </button>
                    )}

                    {mergedControls.alignLeft && (
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            style={{ background: editor.isActive({ textAlign: 'left' }) ? '#e2e8f0' : undefined }}
                        >
                            置左
                        </button>
                    )}
                    {mergedControls.alignCenter && (
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            style={{ background: editor.isActive({ textAlign: 'center' }) ? '#e2e8f0' : undefined }}
                        >
                            置中
                        </button>
                    )}
                    {mergedControls.alignRight && (
                        <button
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            style={{ background: editor.isActive({ textAlign: 'right' }) ? '#e2e8f0' : undefined }}
                        >
                            置右
                        </button>
                    )}

                    {mergedControls.insertTable && (
                        <button onClick={() => editor.chain().focus().insertTable({ rows: 4, cols: 2, withHeaderRow: false }).run()}>
                            插入表格
                        </button>
                    )}
                    {mergedControls.addColumn && (
                        <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
                            +右欄
                        </button>
                    )}
                    {mergedControls.deleteColumn && (
                        <button onClick={() => editor.chain().focus().deleteColumn().run()}>
                            -目前欄
                        </button>
                    )}
                    {mergedControls.addRow && (
                        <button onClick={() => editor.chain().focus().addRowAfter().run()}>
                            +下列
                        </button>
                    )}
                    {mergedControls.deleteRow && (
                        <button onClick={() => editor.chain().focus().deleteRow().run()}>
                            -目前列
                        </button>
                    )}
                    {mergedControls.deleteTable && (
                        <button onClick={() => editor.chain().focus().deleteTable().run()}>
                            刪除表格
                        </button>
                    )}
                </div>
            )}

            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor2

