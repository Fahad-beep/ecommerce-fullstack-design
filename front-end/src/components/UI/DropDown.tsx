import React, { useState, useRef, useEffect } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import { Button } from './Button'; // Path to your custom button
import { cn } from '../../utils/cn';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  className?: string;
  variant?: 'primary' | 'dark';
  size?: 'small' | 'normal' | 'large';
  btnClass?: string;
}

export const DropdownButton: React.FC<DropdownProps> = ({ 
  label, 
  items, 
  className, 
  variant = 'primary', 
  size = 'normal',
  btnClass
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("flex relative text-left", className)} ref={dropdownRef}>
      <Button 
        variant={variant} 
        size={size} 
        onClick={() => setIsOpen(!isOpen)}
        className={cn("flex items-center gap-[0.5rem]", btnClass)}
      >
        <span>{label}</span>
        <LuChevronDown 
          className={cn(
            "transition-transform duration-200", 
            isOpen && "rotate-180"
          )} 
          size={18} 
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0067FF] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};  