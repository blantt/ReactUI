import React from 'react';

const TesttHtmlPage: React.FC = () => {
  return (

    <div>
       <div>ttt</div>

         <iframe
      src="/my-legacy-page.html"
      title="Legacy Page"
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
    </div>

   
  );
};

export default TesttHtmlPage;
