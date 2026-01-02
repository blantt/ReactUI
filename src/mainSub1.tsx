import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Hello from React!</h2>
      <p>This content is rendered by React in mainSub1.tsx.</p>
    </div>
  );
};

const rootElement = document.getElementById('react-root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}