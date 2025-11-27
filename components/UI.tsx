import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  isLoading = false,
  disabled,
  ...props 
}) => {
  const baseStyle = "relative inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] overflow-hidden";
  
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700",
    outline: "bg-transparent border-2 border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && !disabled && !isLoading && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
      )}
      
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin relative z-20" />}
      <span className="relative z-20 flex items-center">{children}</span>
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ id, label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-zinc-400 mb-2 ml-1">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 text-zinc-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent focus:bg-zinc-800 transition-all duration-200 placeholder-zinc-600 ${className}`}
        {...props}
      />
    </div>
  );
};

export const PageWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`animate-slideUpFade w-full ${className}`}>{children}</div>
);

export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = "zinc" }) => (
  <span className={`px-2.5 py-0.5 bg-${color}-800/30 border border-${color}-700 text-${color}-300 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
    {children}
  </span>
);