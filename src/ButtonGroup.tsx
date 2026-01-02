export const Button = ({ label, onClick }: { label: string; onClick: () => void }) => {
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
  const handleClick = (message: string) => {
    alert(message);
  };

  return (
    <div className="space-y-4">
      <div>
        <Button label="Button 1" onClick={() => handleClick('Button 1 clicked!')} />
      </div>
      <div>
        <Button label="Button 2" onClick={() => handleClick('Button 2 clicked!')} />
      </div>
      <div>
        <Button label="Button 3" onClick={() => handleClick('Button 3 clicked!')} />
      </div>
    </div>
  );
};