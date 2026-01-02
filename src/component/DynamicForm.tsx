import React from "react";

interface FormField {
    label: string;
    name: string;
    value?: string;
    type: string; // 支援 "input"、"hyperlink" 和 "empty"
    placeholder?: string;
    colSpan?: number; // 動態控制欄位所佔列數 
    href?: string; // 當 type 為 hyperlink 時，指定超連結的目標 URL
    child?: React.ReactNode; // 當 type 為 empty 時，允許外部傳入子元素
}

interface DynamicFormProps {
    fields: FormField[];
    columns: number; // 動態控制列數
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, columns }) => {
    return (
        <div>
            <div className="bg-white border border-4 rounded-lg shadow relative m-10">
                <div className="p-5 border-b rounded-t">
                    <form action="#" className={`grid grid-cols-${columns} gap-6`}>
                        {fields.map((field, index) => (
                            <div
                                key={index}
                                className={`col-span-${field.colSpan || 1} sm:col-span-${field.colSpan || 1}`}
                            >
                                {field.type !== "empty" && (
                                    <label className="text-sm font-medium text-gray-900 block mb-2">
                                        {field.label}
                                    </label>
                                )}
                                {field.type === "input" && (
                                    <input
                                        type="text"
                                        value={field.value}
                                        name={field.name}
                                        id={field.name}
                                        placeholder={field.placeholder}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                    />
                                )}
                                {field.type === "hyperlink" && field.href && (
                                    <a
                                        href={field.href}
                                        className="text-cyan-600 hover:underline"
                                    >
                                        {field.placeholder || field.label}
                                    </a>
                                )}
                                {field.type === "empty" && field.child && (
                                    <div>{field.child}</div>
                                )}
                            </div>
                        ))}
                    </form>

                </div>


            </div>


        </div>

    );
};

export default DynamicForm;