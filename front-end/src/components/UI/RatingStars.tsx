import { FaStar } from 'react-icons/fa6';
import { cn } from '../../utils/cn';

interface RatingStarsProps {
  rating?: number;
  className?: string;
  countClassName?: string;
  size?: number;
}

const clampRating = (rating: number) => Math.max(0, Math.min(5, rating));

export const RatingStars = ({
  rating = 4.5,
  className,
  countClassName,
  size = 12,
}: RatingStarsProps) => {
  const safeRating = clampRating(rating);
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < fullStars;
        const half = index === fullStars && hasHalfStar;

        return (
          <FaStar
            key={index}
            size={size}
            className={cn(
              filled ? 'text-[#FF9017]' : half ? 'text-[#FF9017]' : 'text-[#BDC4CD]',
            )}
          />
        );
      })}
      <span className={cn('ml-1 text-xs font-semibold text-slate-500', countClassName)}>
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
};
