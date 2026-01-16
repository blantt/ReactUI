import React, { useState, useEffect } from 'react';
import MyDropDown from '../component/myDropDown';
import MyDropGrid, { transformToFormField as apitransform } from '../component/myDropGrid';
import AppTitle from '../component/header.tsx';
import Loading from '../component/myload';
import { LoadingInline } from '../component/myload';
import Modal from '../component/myModal';
import DataGridApi from '../component/myDataGrid.tsx';
import { Button2 } from "../component/button.tsx";
import { TextInput } from "../component/simpleUI.tsx";
import { DiscordIcon, AnotherIcon, AnotherIcon2 } from "../component/mySvg.tsx";
import type { FileItem as DropdownOption } from '../component/myDropGrid'; // 匯入 FileItem 型別



const MyTempUI: React.FC = () => {

   

    return (

        <div>
               <AppTitle title="simple ui" bkcolor="bg-green-600  " btest='dd'
                           onCheckItemsChange={(items) => console.log(items)}

                />

              <div className=' w-60'>

              </div>

              <TextInput placeholder="這是simple ui的TextInput" py={1} othercss=' w-60'  
                 onChange={() => {}}/>


        </div>


    );
};

export default MyTempUI;


