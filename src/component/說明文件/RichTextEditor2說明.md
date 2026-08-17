# RichTextEditor2 元件使用說明與參數手冊

`RichTextEditor2` 是基於 Tiptap 打造的 React 富文本編輯器元件，支援粗體、斜體、文字對齊，以及視覺化表格操作與欄寬調整功能。

---

## 1. 元件主要參數 (RichTextEditorProps)

| 參數名稱 | 型別 (Type) | 預設值 | 說明 |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `''` | 編輯器的 HTML 格式內容字串。 |
| `onChange` | `(html: string) => void` | `undefined` | 內容變更時的回調函式，傳入最新 HTML。 |
| `disabled` | `boolean` | `false` | 是否將編輯器設為唯讀模式 (自動隱藏工具列)。 |
| `controls` | `ToolbarControls` | 全部 `true` | 自訂工具列按鈕顯示與隱藏設定。 |
| `showHelpButton` | `boolean` | `true` | 是否在工具列右上角顯示「📖 說明 / 參數」按鈕。 |
| `defaultShowHelp` | `boolean` | `false` | 是否預設展開介面上的說明與參數檢視面板。 |

---

## 2. 工具列按鈕控制項 (ToolbarControls)

傳入 `controls` 屬性可獨立控制特定按鈕的開啟與關閉：

| 屬性名稱 | 對應按鈕 | 預設值 | 說明 |
| :--- | :--- | :--- | :--- |
| `bold` | 粗體 | `true` | 選取文字套用/取消粗體標籤 (`<b>`) |
| `italic` | 斜體 | `true` | 選取文字套用/取消斜體標籤 (`<i>`) |
| `alignLeft` | 置左 | `true` | 段落與標題靠左對齊 |
| `alignCenter` | 置中 | `true` | 段落與標題置中對齊 |
| `alignRight` | 置右 | `true` | 段落與標題靠右對齊 |
| `insertTable` | 插入表格 | `true` | 插入預設 4x2 的表格 |
| `addColumn` | +右欄 | `true` | 在游標所在位置右側新增欄 |
| `deleteColumn` | -目前欄 | `true` | 刪除游標所在的欄位 |
| `addRow` | +下列 | `true` | 在游標所在位置下方新增列 |
| `deleteRow` | -目前列 | `true` | 刪除游標所在的列位 |
| `deleteTable` | 刪除表格 | `true` | 刪除整個表格 |

---

## 3. 基本使用範例

### 基本使用 (全功能工具列 + 說明按鈕)
```tsx
import React, { useState } from 'react';
import { RichTextEditor2 } from '../component/RichTextEditor2';

export const MyComponent = () => {
    const [htmlContent, setHtmlContent] = useState('<p>初始文字內容</p>');

    return (
        <RichTextEditor2
            value={htmlContent}
            onChange={(html) => setHtmlContent(html)}
        />
    );
};
```

### 自訂工具列按鈕與預設展開說明
```tsx
<RichTextEditor2
    value={htmlContent}
    onChange={setHtmlContent}
    controls={{
        bold: true,
        italic: true,
        insertTable: true,
        deleteTable: false, // 隱藏刪除表格按鈕
    }}
    defaultShowHelp={true} // 預設開啟參數說明面板
/>
```

---

## 4. 介面操作說明

1. **說明按鈕**：點擊工具列右上角的 `📖 說明 / 參數` 按鈕，可隨時在編輯器上方開關參數檢視表與提示訊息。
2. **表格欄寬**：游標移動至表格分隔線時會出現藍色控制線，按住並拖曳即可調整欄寬。
3. **快捷鍵支援**：
   - 粗體：`Ctrl + B`
   - 斜體：`Ctrl + I`
