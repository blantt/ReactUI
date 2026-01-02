import React from 'react';
import './App.css';

 
function Appjs() {
  const greeting = "greeting";
  const displayAction = false;
  return(
    <div className="container">
      <h1 id={greeting}>Hello, World</h1>
      {displayAction && <p>I am writing JSX</p>}
      <ul>
        <li>Item 1</li>
      </ul>
    </div>
  )
}

export default Appjs;