import Mytab from '../component/myTab';
import DataGridApi from '../component/myDataGrid';
import MyDropDown from '../component/myDropDown';
import TextInput  from "../component/simpleUI";

const App: React.FC = () => {
    const tabs = [
        { id: 1, label: 'Tab 1', content: <Tab1 /> },
        { id: 2, label: 'Tab 2', content: <Tab2 /> },
        { id: 3, label: 'Tab 3', content: <Tab3 /> },
    ];

    return (
        <div>
            <Mytab keepAlive={true} tabs={tabs} />
        </div>
    );


}
    
const Tab1 = () => {
    return (
        <div>
           <input type="text" placeholder="測試輸入框" className="border p-2 rounded mb-4" />

           <TextInput placeholder="測試 TextInput 元件" />

          
        </div>
    );
};

const Tab2 = () => {
    return (
        <div>
             i am tab2
               
        </div>
    );
};


const Tab3 = () => {
    return (
        <div>
             i am tab3
        </div>
    );
};


export default App;



