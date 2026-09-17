import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={g-white rounded-xl shadow-sm border border-slate-200 overflow-hidden $className}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <div className={p-5 border-b border-slate-100 $className}>{children}</div>;
}

export function CardBody({ children, className = '' }: CardProps) {
  return <div className={p-5 $className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardProps) {
  return <div className={p-5 bg-slate-50 border-t border-slate-100 $className}>{children}</div>;
}
