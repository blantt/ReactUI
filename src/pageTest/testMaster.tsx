import React, { useState, useEffect } from 'react';
import MyMaster from "../component_s/myMaster";
import { isLocal, getApiUrl } from '../utils/env';


const App: React.FC = () => {

    return (
        <div className=' h-screen w-full bg-amber-300 '>
            {/* <MyMaster />  */}
            <div className=' w-full h-full bg-blue-300 '>
                  <MyMaster />
            </div>

            <div>
                ddd
            </div>
        </div>

    )





}

export default App;

