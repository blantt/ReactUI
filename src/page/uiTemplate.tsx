import React from 'react';
import CardGrid from '../component/CardGrid';
import AppTitle from '../component/header';

export const CORE_CONCEPTS = [
    {
        title: 'Sample Card',
        description: 'card',
        imageUrl: "https://tailwindflex.com/storage/thumbnails/feature-card/thumb_u.min.webp?v=4",
        linkurl: "https://tailwindflex.com/@prajwal/feature-card"
    },
    {
        title: 'Sample Card2',
        description: 'card2',
        imageUrl: "https://tailwindflex.com/storage/thumbnails/feature-card/thumb_u.min.webp?v=4",
        linkurl: "https://tailwindflex.com/@prajwal/feature-card"
    },
];

export const CORE_CONCEPTS_other = [
    {
        title: 'header2',
        description: 'vvvsvg',
        imageUrl: "https://tailwindflex.com/storage/thumbnails/header-with-svg-background/canvas.min.webp?v=1",
        linkurl: "https://tailwindflex.com/@rp-ketan/header-with-svg-background"
    },
     
];

 

export default function App() {

    interface GridDataItem {
        title: string;
        description: string;
        imageUrl: string ;
        linkurl: string;
    }

    // 修正轉換函式
    const transformToFormField = (data: GridDataItem[] ) => {
        return data.map(item => {
            return {
                title: { value: item.title, content: '', type: '' },
                description: { value: item.description, content: '', type: '' },
                imageUrl: { value: item.imageUrl, content: '', type: '' },
                linkurl: { value: item.linkurl, content: '', type: '' },
            };
        });
    };

    const transformedData = transformToFormField(CORE_CONCEPTS);
    const transformedDataOther = transformToFormField(CORE_CONCEPTS_other);         

    return (
    <div>
     
      

      <div>
          <AppTitle title="card grid example" bkcolor=" bg-amber-600 ">
        </AppTitle>
        <CardGrid gridCols={4} data={transformedData}    />
      </div>
 
      <div>
        <AppTitle title="Other Example"   >
        </AppTitle>
        <CardGrid gridCols={4} data={transformedDataOther}    />
      </div>
 

    </div>

  );

}

// export function App_self() {


//     //在這裡先做一個Card Component, 以后可以重複使用
//     const Card = ({ title, linkurl, imageUrl }: { title: string; linkurl: string; imageUrl: string }) => {
//         return (
//             <div className="border border-gray-300 p-1 rounded shadow-md">
//                 <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded-t" />
//                 <div>
//                     {title}
//                 </div>
//                 {/* <h4 className="text-lg font-bold mt-2">{title}</h4> */}
//                 <p className="text-gray-700 mt-1">
//                     <a href={linkurl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
//                         連結
//                     </a>
//                 </p>
//             </div>
//         );
//     };


//     return (
//         <div>

//             <div className="grid gap-1   grid-cols-5 shadow-md ">
//                 <div>
//                     <Card
//                         title="Sample Card"
//                         linkurl="https://tailwindflex.com/@prajwal/feature-card"
//                         imageUrl="https://tailwindflex.com/storage/thumbnails/feature-card/thumb_u.min.webp?v=4"
//                     />
//                 </div>
//                 <div>
//                     <Card
//                         title="Sample Card"
//                         linkurl="This is a sample card component created for UI template."
//                         imageUrl="https://tailwindflex.com/storage/thumbnails/feature-card/thumb_u.min.webp?v=4"
//                     />
//                 </div>
//                 <div>
//                     <Card
//                         title="Sample Card"
//                         linkurl="This is a sample card component created for UI template."
//                         imageUrl="https://tailwindflex.com/storage/thumbnails/feature-card/thumb_u.min.webp?v=4"
//                     />
//                 </div>
//             </div>



//         </div>
//     );
// }
