
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyle = "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800";
  
  const primaryStyle = "bg-amber-500 text-neutral-900 hover:bg-amber-600 focus:ring-amber-400 disabled:bg-amber-700 disabled:opacity-70 disabled:cursor-not-allowed";
  const secondaryStyle = "bg-neutral-600 text-neutral-200 hover:bg-neutral-500 focus:ring-neutral-500 disabled:bg-neutral-700 disabled:opacity-70 disabled:cursor-not-allowed";

  const variantStyle = variant === 'primary' ? primaryStyle : secondaryStyle;

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
