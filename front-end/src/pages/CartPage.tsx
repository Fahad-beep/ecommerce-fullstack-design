import { Link } from 'react-router-dom';
import {
  LuArrowLeft,
  LuEllipsisVertical,
  LuLockKeyhole,
  LuMessageSquareText,
  LuMinus,
  LuPlus,
  LuShoppingCart,
  LuTruck,
} from 'react-icons/lu';
import type { IconType } from 'react-icons';
import type { Product } from '../api/products.api';
import DiscountBanner from '../components/UI/DiscountBanner';
import { useCart, type CartItem } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { formatPrice, getDisplayProducts } from '../data/storefront';

const CartPage = () => {
  const { items, subtotal, setQuantity, removeFromCart, clearCart, addToCart } = useCart();
  const saved = useProducts({ limit: 8 });
  const savedProducts = getDisplayProducts(saved.products, 4);
  const previewItems = getDisplayProducts(saved.products, 3).map((product, index) => ({
    product,
    quantity: [9, 3, 1][index] ?? 1,
  }));
  const cartItems = items.length ? items : previewItems;
  const displaySubtotal = items.length
    ? subtotal
    : cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discount = cartItems.length ? 60 : 0;
  const tax = cartItems.length ? 14 : 0;
  const shipping = cartItems.length ? 10 : 0;
  const desktopTotal = Math.max(displaySubtotal - discount + tax, 0);
  const mobileTotal = displaySubtotal + shipping + tax;
  const isPreview = !items.length;

  return (
    <>
      <section className="hidden bg-[#F7FAFC] px-4 py-7 lg:block">
        <div className="mx-auto max-w-[1180px]">
          <h1 className="mb-6 text-2xl font-semibold text-[#1C1C1C]">My cart ({cartItems.length})</h1>

          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="rounded-md border border-[#DEE2E7] bg-white p-5">
              <div className="divide-y divide-[#DEE2E7]">
                {cartItems.map((item, index) => (
                  <DesktopCartItem
                    key={`${item.product._id}-${index}`}
                    item={item}
                    isPreview={isPreview}
                    setQuantity={setQuantity}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <Link to="/products" className="inline-flex h-10 items-center gap-3 rounded-md bg-gradient-to-b from-[#127FFF] to-[#0067FF] px-4 font-medium !text-white hover:!text-white">
                  <LuArrowLeft size={20} />
                  Back to shop
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  disabled={isPreview}
                  className="h-10 cursor-pointer rounded-md border border-[#DEE2E7] bg-white px-4 font-medium text-[#0D6EFD] disabled:cursor-default disabled:opacity-60"
                >
                  Remove all
                </button>
              </div>
            </div>

            <aside className="space-y-3">
              <div className="rounded-md border border-[#DEE2E7] bg-white p-4">
                <p className="text-base text-[#505050]">Have a coupon?</p>
                <form className="mt-3 flex h-10 overflow-hidden rounded-md border border-[#DEE2E7]">
                  <input placeholder="Add coupon" className="min-w-0 flex-1 px-3 outline-none placeholder:text-[#8B96A5]" />
                  <button type="submit" className="w-[82px] cursor-pointer border-l border-[#DEE2E7] font-medium text-[#0D6EFD]">
                    Apply
                  </button>
                </form>
              </div>

              <div className="rounded-md border border-[#DEE2E7] bg-white p-5 shadow-sm">
                <SummaryRow label="Subtotal:" value={formatPrice(displaySubtotal)} />
                <SummaryRow label="Discount:" value={`-${formatPrice(discount)}`} valueClass="text-[#FA3434]" />
                <SummaryRow label="Tax:" value={`+${formatPrice(tax)}`} valueClass="text-[#00B517]" />
                <div className="my-4 border-t border-[#DEE2E7]" />
                <SummaryRow label="Total:" value={formatPrice(desktopTotal)} labelClass="font-semibold text-[#1C1C1C]" valueClass="text-xl font-semibold text-[#1C1C1C]" />
                <button type="button" className="mt-5 h-[54px] w-full cursor-pointer rounded-md bg-[#00B517] text-lg font-medium text-white">
                  Checkout
                </button>
                <div className="mt-5 flex justify-center gap-2 text-[10px] font-semibold text-[#8B96A5]">
                  {['AMEX', 'MC', 'PayPal', 'VISA', 'Pay'].map((card) => (
                    <span key={card} className="rounded border border-[#DEE2E7] bg-white px-2 py-1">{card}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <FeatureRow />
          <SavedForLater products={savedProducts} addToCart={addToCart} />
          <div className="mt-5">
            <DiscountBanner />
          </div>
        </div>
      </section>

      <section className="lg:hidden">
        <MobileCart
          items={cartItems}
          isPreview={isPreview}
          subtotal={displaySubtotal}
          shipping={shipping}
          tax={tax}
          total={mobileTotal}
          setQuantity={setQuantity}
          removeFromCart={removeFromCart}
          savedProducts={savedProducts}
          addToCart={addToCart}
        />
      </section>
    </>
  );
};

interface CartItemProps {
  item: CartItem;
  isPreview: boolean;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const DesktopCartItem = ({ item, isPreview, setQuantity, removeFromCart }: CartItemProps) => (
  <article className="grid grid-cols-[80px_1fr_140px] gap-3 py-5 first:pt-0">
    <Link to={`/products/${item.product._id}`} className="flex h-20 w-20 items-center justify-center rounded-md border border-[#DEE2E7]">
      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-contain p-2" />
    </Link>
    <div>
      <Link to={`/products/${item.product._id}`} className="font-medium text-[#1C1C1C]">
        {item.product.name}
      </Link>
      <p className="mt-2 text-base leading-6 text-[#8B96A5]">
        Size: medium, Color: blue, Material: Plastic<br />
        Seller: {item.product.brand || 'Artel Market'}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={isPreview}
          onClick={() => removeFromCart(item.product._id)}
          className="h-8 cursor-pointer rounded-md border border-[#DEE2E7] bg-white px-3 text-sm font-medium text-[#FA3434] disabled:cursor-default disabled:opacity-60"
        >
          Remove
        </button>
        <button type="button" className="h-8 cursor-pointer rounded-md border border-[#DEE2E7] bg-white px-3 text-sm font-medium text-[#0D6EFD]">
          Save for later
        </button>
      </div>
    </div>
    <div className="flex flex-col items-end justify-between">
      <p className="font-medium text-[#1C1C1C]">{formatPrice(item.product.price * item.quantity)}</p>
      <select
        value={item.quantity}
        disabled={isPreview}
        onChange={(event) => setQuantity(item.product._id, Number(event.target.value))}
        className="h-10 w-[124px] rounded-md border border-[#DEE2E7] bg-white px-3 outline-none disabled:opacity-80"
      >
        {[1, 2, 3, 4, 5, 9].map((quantity) => (
          <option key={quantity} value={quantity}>Qty: {quantity}</option>
        ))}
      </select>
    </div>
  </article>
);

const SummaryRow = ({
  label,
  value,
  labelClass,
  valueClass,
}: {
  label: string;
  value: string;
  labelClass?: string;
  valueClass?: string;
}) => (
  <div className="mb-2 flex items-center justify-between text-base">
    <span className={labelClass ?? 'text-[#505050]'}>{label}</span>
    <span className={valueClass ?? 'text-[#505050]'}>{value}</span>
  </div>
);

const cartFeatures: { icon: IconType; title: string }[] = [
  { icon: LuLockKeyhole, title: 'Secure payment' },
  { icon: LuMessageSquareText, title: 'Customer support' },
  { icon: LuTruck, title: 'Free delivery' },
];

const FeatureRow = () => (
  <section className="mt-7 grid max-w-[780px] grid-cols-3 gap-12">
    {cartFeatures.map(({ icon: Icon, title }) => (
      <div key={title} className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DEE2E7] text-[#8B96A5]">
          <Icon size={22} />
        </div>
        <div>
          <p className="text-base text-[#1C1C1C]">{title}</p>
          <p className="text-base text-[#A9ACB0]">Have you ever finally just</p>
        </div>
      </div>
    ))}
  </section>
);

const SavedForLater = ({ products, addToCart }: { products: Product[]; addToCart: (product: Product) => void }) => (
  <section className="mt-7 rounded-md border border-[#DEE2E7] bg-white p-5">
    <h2 className="text-xl font-semibold text-[#1C1C1C]">Saved for later</h2>
    <div className="mt-6 grid grid-cols-4 gap-5">
      {products.map((product, index) => (
        <article key={`${product._id}-${index}`}>
          <Link to={`/products/${product._id}`} className="flex h-[240px] items-center justify-center rounded bg-[#EEEEEE]">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-4" />
          </Link>
          <p className="mt-3 text-xl font-semibold text-[#1C1C1C]">{formatPrice(product.price)}</p>
          <Link to={`/products/${product._id}`} className="mt-2 block min-h-[48px] text-base leading-6 text-[#505050] line-clamp-2">
            {product.name}
          </Link>
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#DEE2E7] bg-white px-4 font-medium text-[#0D6EFD]"
          >
            <LuShoppingCart size={20} />
            Move to cart
          </button>
        </article>
      ))}
    </div>
  </section>
);

interface MobileCartProps {
  items: CartItem[];
  isPreview: boolean;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  savedProducts: Product[];
  addToCart: (product: Product) => void;
}

const MobileCart = ({
  items,
  isPreview,
  subtotal,
  shipping,
  tax,
  total,
  setQuantity,
  removeFromCart,
  savedProducts,
  addToCart,
}: MobileCartProps) => (
  <div className="bg-[#F7FAFC] pb-8">
    <div className="bg-white">
      {items.map((item, index) => (
        <MobileCartItem
          key={`${item.product._id}-${index}`}
          item={item}
          isPreview={isPreview}
          setQuantity={setQuantity}
          removeFromCart={removeFromCart}
        />
      ))}
      <div className="border-t border-[#DEE2E7] px-4 py-4">
        <SummaryRow label={`Items (${items.length}):`} value={formatPrice(subtotal)} labelClass="text-[#8B96A5]" valueClass="font-medium text-[#1C1C1C]" />
        <SummaryRow label="Shipping:" value={formatPrice(shipping)} labelClass="text-[#8B96A5]" valueClass="font-medium text-[#1C1C1C]" />
        <SummaryRow label="Tax:" value={formatPrice(tax)} labelClass="text-[#8B96A5]" valueClass="font-medium text-[#1C1C1C]" />
        <SummaryRow label="Total:" value={formatPrice(total)} labelClass="text-xl font-semibold text-[#1C1C1C]" valueClass="text-xl font-semibold text-[#1C1C1C]" />
        <button type="button" className="mt-4 h-10 w-full cursor-pointer rounded-md bg-[#00B517] text-base font-medium text-white">
          Checkout ({items.length} items)
        </button>
      </div>
    </div>

    <section className="mt-3 border-t border-[#DEE2E7] px-2 py-5">
      <h2 className="mb-4 text-xl font-semibold text-[#1C1C1C]">Saved for later</h2>
      <div className="space-y-2">
        {savedProducts.slice(0, 3).map((product, index) => (
          <article key={`${product._id}-${index}`} className="grid grid-cols-[100px_1fr] gap-3 rounded-md border border-[#DEE2E7] bg-white p-3">
            <Link to={`/products/${product._id}`} className="flex h-[100px] items-center justify-center">
              <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
            </Link>
            <div>
              <Link to={`/products/${product._id}`} className="text-base leading-5 text-[#606060] line-clamp-2">
                {product.name}
              </Link>
              <p className="mt-1 font-semibold text-[#1C1C1C]">{formatPrice(product.price)}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => addToCart(product)} className="h-8 cursor-pointer rounded-md border border-[#DEE2E7] bg-white px-3 text-sm font-medium text-[#0D6EFD]">
                  Move to cart
                </button>
                <button type="button" className="h-8 cursor-pointer rounded-md border border-[#DEE2E7] bg-white px-3 text-sm text-[#FA3434]">
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  </div>
);

const MobileCartItem = ({ item, isPreview, setQuantity, removeFromCart }: CartItemProps) => (
  <article className="border-b border-[#DEE2E7] px-4 py-4">
    <div className="grid grid-cols-[72px_1fr_24px] gap-3">
      <Link to={`/products/${item.product._id}`} className="flex h-[72px] w-[72px] items-center justify-center rounded-md border border-[#DEE2E7]">
        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-contain p-2" />
      </Link>
      <div>
        <Link to={`/products/${item.product._id}`} className="text-base leading-5 text-[#1C1C1C] line-clamp-2">
          {item.product.name}
        </Link>
        <p className="mt-1 text-sm leading-5 text-[#8B96A5]">
          Size: medium, Color: blue<br />
          Seller: {item.product.brand || 'Artel Market'}
        </p>
      </div>
      <button type="button" disabled={isPreview} onClick={() => removeFromCart(item.product._id)} className="cursor-pointer text-[#8B96A5] disabled:cursor-default disabled:opacity-70">
        <LuEllipsisVertical size={22} />
      </button>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <div className="flex h-10 overflow-hidden rounded-md border border-[#DEE2E7]">
        <button
          type="button"
          disabled={isPreview}
          onClick={() => setQuantity(item.product._id, item.quantity - 1)}
          className="flex w-10 cursor-pointer items-center justify-center text-[#8B96A5] disabled:cursor-default disabled:opacity-70"
        >
          <LuMinus size={18} />
        </button>
        <span className="flex w-[70px] items-center justify-center border-x border-[#DEE2E7] text-base text-[#1C1C1C]">{item.quantity}</span>
        <button
          type="button"
          disabled={isPreview}
          onClick={() => setQuantity(item.product._id, item.quantity + 1)}
          className="flex w-10 cursor-pointer items-center justify-center text-[#8B96A5] disabled:cursor-default disabled:opacity-70"
        >
          <LuPlus size={20} />
        </button>
      </div>
      <p className="text-base font-semibold text-[#1C1C1C]">{formatPrice(item.product.price * item.quantity)}</p>
    </div>
  </article>
);

export default CartPage;
