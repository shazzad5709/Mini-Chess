import React from 'react';

// Define the type for the Button component props
interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string; // Make className optional
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-full ${className || ''}`} // Include the className if provided
    >
      {text}
    </button>
  );
};

export default Button;
