// main.js
import { greet, PI } from './utils.js';
import { BrowserRouter } from "react-router-dom" 
import Home22 from "./page/Home"
import path from 'path';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
 

function createRouter2() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home22 />,
        },
    ]);
    return router;
}