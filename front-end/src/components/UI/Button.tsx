import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'dark';
    size?: 'small' | 'normal' | 'large';
    children: React.ReactNode;
}

const baseStyles = "flex justify-center items-center font-['Inter'] not-italic text-center transition-all duration-200 ease-in-out hover:scale-105 active:scale-[0.98] cursor-pointer outline-none";

const variantStyles = {
    primary: "bg-gradient-to-b from-[#127FFF] to-[#0067FF] text-white border-none",
    dark: "bg-white border border-[#DEE2E7] text-[#0D6EFD]",
};

const sizeStyles = {
    small: "gap-[0.625rem] px-[0.625rem] h-[1.875rem] rounded-[0.375rem] font-medium text-[0.8125rem] leading-[1rem]",
    normal: "gap-[0.625rem] px-[1rem] h-[2.5rem] rounded-[0.375rem] font-medium text-[1rem] leading-[1.1875rem]",
    large: "gap-[0.625rem] px-[1.25rem] h-[3.375rem] rounded-[0.5rem] font-medium text-[1.125rem] leading-[1.375rem]",
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'normal',
    children,
    className,
    ...props
}) => {
    const combinedClasses = cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
    );

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
};