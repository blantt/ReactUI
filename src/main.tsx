import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/home';
import Home2 from './page/home2';
import ApiTest from './page/apiTest';
import FormTest from './page/formTest';
import FormTest2 from './page/formTest2';
import GridTest from './page/gridTest';
import Uitemplabe from './page/uiTemplate';
import MytempUI from './page/myTempUI';
import DocGrid from './page/docGrid';
import OTCtest from './pageAmc1234/OTCtest';
import OTCtest2 from './pageAmc1234/OTCtest2';
import TabTest from './page/testTab';
import TestHtmlPage from './page/testHtmlPage';
import TestHtmlPage2 from './page/testHtmlPage2';
import TextOtc from './page/textOtc';
import TestModal from './page/testmodal';
import SimpleUItest from './page/simpleUItest';

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return
  }
 

  // `worker.start()` 會回傳一個 Promise，
  // 當 Service Worker 啟動並運作後，它會被解析。
  
}

// 呼叫 enableMocking 並等待它完成(這裡目前有問題，先註解起來)
// enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home2" element={<Home2 />} />
          <Route path="/apiTest" element={<ApiTest />} />
          <Route path="/formTest" element={<FormTest />} />
          <Route path="/formTest2" element={<FormTest2 />} />
          <Route path="/gridTest" element={<GridTest />} />
          <Route path="/uiTemplate" element={<Uitemplabe />} />
          <Route path="/myTempUI" element={<MytempUI />} />
          <Route path="/docGrid" element={<DocGrid />} />
          <Route path="/otcTest" element={<OTCtest />} />
          <Route path="/otcTest2" element={<OTCtest2 />} />
          <Route path="/tabTest" element={<TabTest />} />
          <Route path="/testHtmlPage" element={<TestHtmlPage />} />
          <Route path="/testHtmlPage2" element={<TestHtmlPage2 />} />
          <Route path="/textOtc" element={<TextOtc />} />
          <Route path="/testModal" element={<TestModal />} />
          <Route path="/simpleUI" element={<SimpleUItest />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  )

// });
