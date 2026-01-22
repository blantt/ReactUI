import DynamicForm from "../component/DynamicForm";
import { CORE_CONCEPTS } from "../data/data.js";
import Button  from "../component/button";
export default function App2() {

//  先取得數據 CORE_CONCEPTS 第1筆，再帶入placeholder
 const firstConceptTitle = CORE_CONCEPTS?.[0]?.title || "Default Placeholder";


    const formFields = [
        { label: "Product Name", name: "product-name", type: "input", placeholder: firstConceptTitle, colSpan: 3 },
        { label: "Category", name: "category", type: "input",   colSpan: 3 },
        { label: "Brand", name: "brand", type: "input", value: "Apple", colSpan: 3 },
        { label: "說明", name: "price", type: "input", placeholder: "1000", colSpan: 3 },
        { label: "Product Details", name: "details", type: "input", placeholder: "Details here", colSpan: 6 },
        { label: "我是細項2", name: "details2", type: "input", placeholder: firstConceptTitle, colSpan: 6 },
        { label: "More Info", name: "more-info", type: "hyperlink", href: "https://example.com", placeholder: "Click here for more info", colSpan: 6 },
        { label: "", name: "custom-button", type: "empty", colSpan:3, child: <button className="bg-blue-500 text-white px-4 py-2 rounded">Click Me</button> },

         { label: "", name: "custom-button", type: "empty", colSpan:3
            , child:  <Button label="Buttonabc"   /> },
    
    ];
     return (
        <div>
            <h1>Form Test Page</h1>
            <div className="p-6 space-y-6">
                <DynamicForm fields={formFields} columns={6} />
            </div>
        </div>
    );
}


export  function App() {
    const formFields = [
        { label: "Product Name", name: "product-name", type: "text", placeholder: "Apple Imac 27”", colSpan: 3 },
        { label: "Category", name: "category", type: "text", placeholder: "Electronics", colSpan: 3 },
        { label: "Brand", name: "brand", type: "text", placeholder: "Apple", colSpan: 3 },
        { label: "說明", name: "price", type: "text", placeholder: "1000", colSpan: 3 },
        { label: "Product Details", name: "details", type: "text", placeholder: "Details here", colSpan: 6 },
        { label: "我是細項", name: "details2", type: "text", placeholder: "是我哦", colSpan: 6 },
        { label: "More Info", name: "more-info", type: "hyperlink", href: "https://example.com", placeholder: "Click here for more info", colSpan: 6 },
        { label: "", name: "custom-button", type: "empty", colSpan: 6, child: <button className="bg-blue-500 text-white px-4 py-2 rounded">Click Me</button> },
    ];

    return (
        <div>
            <h1>Form Test Page</h1>
            <div className="p-6 space-y-6">
                <DynamicForm fields={formFields} columns={6} />
            </div>
        </div>
    );
}