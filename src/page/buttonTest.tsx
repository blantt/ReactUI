import ReactDOM from "react-dom/client";
import Header from "../component/header.tsx";

import { useState } from "react";

type ButtonProps = {
    label: string; // label 是字串
    onClick: () => void; // onClick 是一個函式，無參數且無回傳值
};


export const Button = ({ label, onClick }: ButtonProps) => {
    return (
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onClick}
        >
            {label}
        </button>
    );
};

function MyHeader() {
    return (
        <div className=" bg-amber-300">
            99888855
        </div>
    );
}

export default function Mylogin() {
    const [state, setState] = useState({
        testname: 'aaa'
    });

    const handleChangeTestname = (newTestname: string) => {
        setState({ ...state, testname: newTestname });
    };

    return (
        <div className=" bg-blue-100">
            <div>login in 4</div>
            {/* <button className="  " onClick={() => handleChangeTestname('bbb')}>按下改變test</button>
            <button onClick={() => handleChangeTestname('ccc')}>改變為ccc</button> */}

            <div className="space-x-4">
                  <Button label="Button 1" onClick={() => handleChangeTestname('bbb')} />
                  <Button   label="Button 2" onClick={() => handleChangeTestname('ccc')} />
            </div>

            <div className=" bg-amber-300">
                <div>test</div>
               <Header title={state.testname}>
                 <p>This is a child element</p>
               </Header>
            </div>

           
        </div>

    );
}


window.onload = () => {
    ReactDOM.createRoot(document.getElementById("root3")!).render(<MyHeader />);

    ReactDOM.createRoot(document.getElementById("login")!).render(<Mylogin />);

};
