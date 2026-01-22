import Mytab from '../component/myTab';




const App: React.FC = () => {
    const tabs = [
        { id: 1, label: 'Tab 1', content: <Tab1 /> },
        { id: 2, label: 'Tab 2', content: <Tab2 /> },
        { id: 3, label: 'Tab 3', content: <Tab3 /> },
    ];

    return (
        <div>
            <Mytab tabs={tabs} />
        </div>
    );


}
    
const Tab1 = () => {
    return (
        <div>
             i am tab1
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



