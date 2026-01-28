 

type AppProps = {
    title: string; // title 是字串
    bkcolor?: string; // color 是可選的字串
    children?: React.ReactNode; // children 是 React 節點
    btest?: string;
    onCheckItemsChange?: (items: string[]) => void;
    
};

export default function App({title,bkcolor = 'bg-blue-500', children,onCheckItemsChange,btest}: AppProps) {
    return (
        <div className=' w-full'>
           
            <h1 className={`${bkcolor} text-sm text-white rounded-t-md px-2 py-1 inline-block  `} >{title}</h1>
              
              <div className={`w-full ${bkcolor} h-px `} ></div>  
            {children} 
        </div>
    )
}
 