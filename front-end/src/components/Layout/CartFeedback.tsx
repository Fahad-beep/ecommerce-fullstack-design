import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuShoppingCart } from 'react-icons/lu';
import { useCart } from '../../context/CartContext';

const CartFeedback = () => {
  const { lastAdded, dismissLastAdded } = useCart();

  useEffect(() => {
    if (!lastAdded) return;

    const timer = window.setTimeout(dismissLastAdded, 1500);
    return () => window.clearTimeout(timer);
  }, [dismissLastAdded, lastAdded]);

  if (!lastAdded) return null;

  return (
    <Link
      to="/cart"
      className="cart-feedback-motion fixed right-4 top-20 z-[70] flex w-[280px] items-center gap-3 rounded-full border border-[#B7D6FF] bg-white p-3 shadow-[0_16px_42px_rgba(13,110,253,0.2)] sm:right-8 lg:top-24"
      aria-live="polite"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#127FFF] to-[#0067FF] text-white">
        <LuShoppingCart size={23} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[#1C1C1C]">Added to cart</span>
        <span className="block truncate text-sm text-[#8B96A5]">{lastAdded.product.name}</span>
      </span>
      <span className="cart-bubble-pop flex h-8 min-w-8 items-center justify-center rounded-full bg-[#E5F1FF] px-2 text-sm font-semibold text-[#0D6EFD]">
        {lastAdded.totalQuantity}
      </span>
    </Link>
  );
};

export default CartFeedback;
