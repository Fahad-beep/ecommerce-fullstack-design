import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface CategoryBannerProps {
  title?: string;
  buttonText?: string;
  imageSrc?: string;
  className?: string;
  onButtonClick?: () => void;
}

export const CategoryBanner: React.FC<CategoryBannerProps> = ({
  title = "Home and outdoor",
  buttonText = "Source now",
  imageSrc = "./HAndOBanner.jpg",
  className,
  onButtonClick
}) => {
  return (
    <div 
      className={cn(
        "relative flex flex-col items-start justify-start p-6 rounded-lg overflow-hidden bg-cover bg-center min-w-[15rem] min-h-[16rem]", 
        className
      )}
      style={{ backgroundImage: `url('${imageSrc}')` }}
    >
      <h3 className="text-xl font-semibold text-gray-900 max-w-[10rem] leading-snug mb-5 z-10">
        {title}
      </h3>
      <Button 
        variant="dark" 
        size="small" 
        onClick={onButtonClick}
        className="z-10 !text-gray-900 !border-none !rounded-md shadow-sm !px-5 hover:!bg-gray-50"
      >
        {buttonText}
      </Button>
    </div>
  );
};