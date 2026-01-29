import React, { useState, useEffect } from 'react';
import { Button2 } from "../component/button";
import {AeroButton,AeroDropdown,VistaStyles}  from "../component/VistaUItest"; 
//import DropdownOption  from "../component/VistaUItest"; 

const page: React.FC = () => {
    // 建立一個選項陣列
const themeOptions = [
  { label: 'Windows Aero (預設)' },
  { label: 'Windows Vista 標準' },
  { label: 'Windows 基本風格' },
  { type: 'divider' as const },
  { label: '高對比度黑色' },
  { label: '傳統 Windows 樣式' },
];
    return (
        <div>
            <div>
                  Test Vista Page
                 {/* <VistaStyles /> */}
                 <AeroButton variant="black"  className=' text-blue-500' >Click Me2</AeroButton>
            </div>
          
            <div>
                <AeroDropdown  label="Select Theme" options={themeOptions}   />
            </div>

        </div>
    );
}

export default page;