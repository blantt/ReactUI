import Header from "../component/header";
import { useState } from "react";
import Button  from "../component/button";
import componentsImg from '../images/icon_fish1.png';

 export const CORE_CONCEPTS = [
   {
     image: componentsImg,
     title: 'blantt Components',
     description:
       'The core UI building block - compose the user interface by combining multiple components.',
   },
   {
     image: componentsImg,
     title: 'JSX',
     description:
       'Return (potentially dynamic) HTML(ish) code to define the actual markup that will be rendered.',
   },
   {
     image: componentsImg,
     title: 'Props',
     description:
       'Make components configurable (and therefore reusable) by passing input data to them.',
   },
   {
     image: componentsImg,
     title: 'State',
     description:
       'React-managed data which, when changed, causes the component to re-render & the UI to update.',
   },
 ];

export default function Mylogin() {
    const [state, setState] = useState({
        testname: 'aaa'
    });

    const [selectedData, setSelectedData] = useState<string | null>(null);
    
    const handleButtonClick = (index: number) => {
    const data = CORE_CONCEPTS[index];
    setSelectedData(`${data.title}: ${data.description}`);
  };

 

    const handleChangeTestname = (newTestname: string) => {
        setState({ ...state, testname: newTestname });
    };

    return (
        
        <div className=" bg-blue-100">
            <div className=" bg-amber-300">
               <Header title={state.testname}>
                 <p>This is a child element</p>
               </Header>
            </div>

            <div>login in 5</div>
            {/* <button className="  " onClick={() => handleChangeTestname('bbb')}>按下改變test</button>
            <button onClick={() => handleChangeTestname('ccc')}>改變為ccc</button> */}
   
            <div className="space-x-4">
                  <Button label="Button 1" onClick={() => handleChangeTestname('bbb')} />
                  <Button label="Button 1" onClick={() => handleChangeTestname('bbb2')} />
            </div>

            <div>讀取數據練習</div>
            <div className="space-x-4">
                <Button label="數據組1" onClick={() => handleButtonClick(1)} />
                <Button label="數據組2" onClick={() => handleButtonClick(2)} />
            </div>
            

             <div id="txtmemo" className=" mt-4 p-2 border border-gray-300">
                {selectedData || "請選擇一個數據組"}
             </div>

             <Card title={CORE_CONCEPTS[0].title} description={CORE_CONCEPTS[0].description } imageUrl={CORE_CONCEPTS[0].image} />


            <div>一口氣讀取數據組,呈現</div>
            <div className="space-x-2-4 flex ">
                {CORE_CONCEPTS.map((concept, index) => (
                    <Card
                        key={index}
                        title={concept.title}
                        description={concept.description}
                        imageUrl={concept.image}
                    />
                ))}
            </div>

        </div>

        

    );
}

type CardProps = {
  title?: string; // 接收標題
  description?: string; // 接收描述
  imageUrl?: string; // 接收圖片URL    
};

function Card({ title = "Default Title", description, imageUrl }: CardProps) {
    return (
        <div className=" p-4 border border-gray-300 rounded-lg shadow-md">
            <h2 className=" text-xl font-bold mb-2">{title}</h2>
            {imageUrl ? (
                <img src={imageUrl} alt="Placeholder Image" className=" mb-2" />
            ) : (
                <div className=" mb-2 text-gray-500">No Image Available</div>
            )}
            {description && <p className="text-gray-700">{description}</p>}
        </div>
    );
  }

