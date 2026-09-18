import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  isLoading, 
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  
  const baseStyle = "inline-flex items-center justify-center font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-emerald hover:bg-brand-emerald-hover text-white shadow-sm focus:ring-brand-emerald",
    secondary: "bg-white hover:bg-slate-50 border border-brand-slate text-brand-navy shadow-sm focus:ring-brand-slate",
    ghost: "bg-transparent hover:bg-slate-100 text-brand-charcoal focus:ring-slate-200"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
