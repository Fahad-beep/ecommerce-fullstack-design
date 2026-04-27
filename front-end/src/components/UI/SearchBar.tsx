import React from 'react'
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string; 
}

export const SearchBar = React.forwardRef<HTMLInputElement, InputProps>(
    ({label, error, className, ...props}, ref) => {
  return (
    <div className='border-[1px] rounded-lg rounded-r-none flex items-center h-[2.5rem]'>
        {/* #0D6EFD */}
        <label className='text-sm font-semibold text-gray-700 opacity-50 mx-[1rem]'>{label}</label>
        <input ref={ref} type="text" className={cn("", className)} {...props}>
        </input>
        { error && <span className='font-xs text-red-500'>{error}</span>}
    </div>
    )}
);
export default SearchBar
