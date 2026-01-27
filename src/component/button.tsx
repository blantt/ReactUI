
type ButtonProps = {
    label: string; // label 是字串
    onClick?: () => void; // onClick 是一個函式，無參數且無回傳值 
};


export const Button = ({ label, onClick }: ButtonProps) => {
    return (
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onClick}  >
            {label}
        </button>
    );
};

type ButtonProps2 = {
    label: string; // label 是字串
    icon?: React.ReactNode; // icon 是可選的 React 節點
     onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 允許帶 event
};


export const Button2 = ({ label, icon, onClick }: ButtonProps2) => {
 
    return (
         
        <button onClick={onClick}
            className="inline-flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >

            {icon && <span className="mr-2">{icon}</span>}

            <span>{label}</span>
           
        </button>


    );
};


export default Button;
