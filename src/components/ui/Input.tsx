import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-brand-navy">{label}</label>}
      <input 
        className={w-full px-4 py-2.5 rounded-lg border $error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-brand-emerald focus:ring-brand-emerald} bg-white text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors $className}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
