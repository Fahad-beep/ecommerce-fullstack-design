import { Link } from 'react-router-dom';
import { LuHeart, LuShoppingCart } from 'react-icons/lu';
import { cn } from '../../utils/cn';
import type { Product } from '../../api/products.api';
import { RatingStars } from './RatingStars';
import { formatPrice, oldPrice } from '../../data/storefront';

interface ProductCardProps {
  product: Product;
  className?: string;
  compact?: boolean;
  onAdd?: (product: Product) => void;
}

export const ProductCard = ({
  product,
  className,
  compact = false,
  onAdd,
}: ProductCardProps) => {
  const previousPrice = oldPrice(product);

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-md border border-[#DEE2E7] bg-white',
        compact ? 'p-3' : '',
        className,
      )}
    >
      <Link to={`/products/${product._id}`} className="block">
        <div
          className={cn(
            'flex items-center justify-center bg-white',
            compact ? 'h-36' : 'h-[260px] border-b border-[#EFF2F4]',
          )}
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className={cn('relative', compact ? 'pt-3' : 'p-5')}>
        <button
          type="button"
          className="absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-[#DEE2E7] bg-white text-[#0D6EFD]"
          aria-label="Save product"
        >
          <LuHeart size={21} />
        </button>

        <div className="pr-12">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-xl font-semibold text-[#1C1C1C]">{formatPrice(product.price)}</p>
            {previousPrice ? (
              <p className="text-base text-[#8B96A5] line-through">{formatPrice(previousPrice)}</p>
            ) : null}
          </div>
          <RatingStars rating={product.rating} className="mt-2" countClassName="text-[#FF9017]" size={14} />
          <Link to={`/products/${product._id}`} className="mt-3 block text-base leading-6 text-[#606060] line-clamp-2">
            {product.name}
          </Link>
        </div>

        {onAdd ? (
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#DEE2E7] bg-white px-4 text-base font-medium text-[#0D6EFD]"
          >
            <LuShoppingCart size={19} />
            Move to cart
          </button>
        ) : null}
      </div>
    </article>
  );
};
