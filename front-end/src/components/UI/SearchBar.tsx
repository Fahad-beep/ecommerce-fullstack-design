import React from 'react'
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string; 
}

export const SearchBar = React.forwardRef<HTMLInputElement, InputProps>(
    ({label, error, className, ...props}, ref) => {
  return (
    <div className='flex h-[2.5rem] items-center overflow-hidden rounded-lg border border-[#DEE2E7] bg-white'>
        <input
          ref={ref}
          type="text"
          placeholder={label}
          className={cn("h-full flex-1 bg-transparent px-[1rem] text-sm outline-none placeholder:text-gray-400", className)}
          {...props}
        />
        { error && <span className='font-xs text-red-500 pr-3'>{error}</span>}
    </div>
    )}
);
export default SearchBar
