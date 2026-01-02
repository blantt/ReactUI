import React from "react";

interface FormField {
    value: string;
    content: string;
    imageUrl?: string;
    type?: string; // 支援 "input"、"hyperlink" 和 "empty"
    child?: React.ReactNode; // 當 type 為 empty 時，允許外部傳入子元素
}

interface CardField {

    title: FormField;
    description: FormField;
    imageUrl: FormField;
    linkurl: FormField;
}

interface DynamicFormProps {
    data: Array<CardField>; // 每列的數據
    gridCols?: number; // 動態控制grid列數
}

// 虛線框樣式
const Classes_border = ' border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg '

const CardGrid: React.FC<DynamicFormProps> = ({ data, gridCols }) => {
    const mygridCols = gridCols || 3;
    return (
        <div className={`grid grid-cols-${mygridCols} gap-4 p-4  `}>
            {data.map((item, index) => (
                
               <div className={Classes_border}>
                  <h2 className="text-lg font-bold mt-2">{item.title.value}</h2>
                  <img src={item.imageUrl.value} alt={item.title.value} className="w-full h-30 object-cover rounded-t" />
                  <a href={item.linkurl.value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                         連結
                  </a>
               </div>
 
            ))}
        </div>
    );


}

export default CardGrid;

