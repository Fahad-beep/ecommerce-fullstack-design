import React from 'react'
import { cn } from '../../utils/cn';

interface IconLabelProps {
    icon: React.ElementType;
    label?: string;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    size?: number;
}

export const IconLabel = ({
    icon: Icon,
    label,
    className,
    iconClassName,
    textClassName,
    size
}: IconLabelProps) => 
  (
    <div className={cn("flex flex-col items-center", className)}>
        <div className={cn("", iconClassName)}> <Icon size={size}/> </div>
        <p className={cn("font-sans text-gray-500 text-[12px] font-normal", textClassName)}>{label}</p>
    </div>
  )


export default IconLabel
