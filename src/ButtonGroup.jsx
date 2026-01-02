import React from "react";

export const Button = ({ label, onClick }) => {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export const ButtonGroup = () => {
  const handleClick = (message) => {
    alert(message);
  };
// 33
  return (
    <div className="space-y-4">
      <Button label="Button 1" onClick={() => handleClick("Button 1 clicked!")} />
      <Button label="Button 2" onClick={() => handleClick("Button 2 clicked!")} />
      <Button label="Button 3" onClick={() => handleClick("Button 3 clicked!")} />
    </div>
  );
};