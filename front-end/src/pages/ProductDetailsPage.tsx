import { Link, useParams } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';
import {
  LuArrowLeft,
  LuArrowRight,
  LuCheck,
  LuChevronRight,
  LuGlobe,
  LuHeart,
  LuMessageSquareText,
  LuShieldCheck,
  LuShoppingBasket,
} from 'react-icons/lu';
import type { Product } from '../api/products.api';
import DiscountBanner from '../components/UI/DiscountBanner';
import { RatingStars } from '../components/UI/RatingStars';
import { useCart } from '../context/CartContext';
import { useProductById, useProducts } from '../hooks/useProducts';
import { fallbackProducts, formatPrice, getDisplayProducts } from '../data/storefront';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { product, isLoading, error } = useProductById(id);
  const { addToCart } = useCart();
  const displayProduct = product ?? fallbackProducts[0];
  const related = useProducts({ category: product?.category, limit: 8 });
  const relatedProducts = getDisplayProducts(
    related.products.filter((item) => item._id !== displayProduct._id),
    6,
  );

  if (isLoading && !product) {
    return (
      <section className="bg-[#F7FAFC] px-4 py-5">
        <div className="mx-auto hidden max-w-[1180px] animate-pulse space-y-5 lg:block">
          <div className="h-[580px] rounded-md border border-[#DEE2E7] bg-white" />
          <div className="h-[620px] rounded-md border border-[#DEE2E7] bg-white" />
        </div>
        <div className="h-[640px] animate-pulse bg-white lg:hidden" />
      </section>
    );
  }

  return (
    <>
      <section className="hidden bg-[#F7FAFC] px-4 py-5 lg:block">
        <div className="mx-auto max-w-[1180px] space-y-5">
          <Breadcrumb />
          {error ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          <ProductTop product={displayProduct} related={relatedProducts} onInquiry={() => addToCart(displayProduct)} />
          <DescriptionArea product={displayProduct} related={relatedProducts.slice(0, 5)} />
          <RelatedProducts products={relatedProducts} />
          <DiscountBanner />
        </div>
      </section>

      <section className="lg:hidden">
        <MobileDetail product={displayProduct} related={relatedProducts} onInquiry={() => addToCart(displayProduct)} />
      </section>
    </>
  );
};

const Breadcrumb = () => (
  <nav className="mb-5 flex items-center gap-2 text-base text-[#8B96A5]">
    <Link to="/">Home</Link>
    <LuChevronRight size={18} />
    <span>Clothings</span>
    <LuChevronRight size={18} />
    <span>Men's wear</span>
    <LuChevronRight size={18} />
    <span>Summer clothing</span>
  </nav>
);

const ProductTop = ({
  product,
  related,
  onInquiry,
}: {
  product: Product;
  related: Product[];
  onInquiry: () => void;
}) => (
  <section className="grid min-h-[580px] grid-cols-[380px_1fr_280px] gap-6 rounded-md border border-[#DEE2E7] bg-white p-5">
    <div>
      <div className="flex h-[380px] items-center justify-center rounded-md border border-[#DEE2E7] bg-white">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain p-6" />
      </div>
      <div className="mt-5 grid grid-cols-6 gap-2">
        {[product, ...related].slice(0, 6).map((item, index) => (
          <button
            key={`${item._id}-${index}`}
            type="button"
            className="flex h-14 items-center justify-center rounded-md border border-[#DEE2E7] bg-white p-1"
          >
            <img src={item.image} alt="" className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
    </div>

    <div>
      <p className="flex items-center gap-2 text-base text-[#00B517]">
        <LuCheck size={20} />
        In stock
      </p>
      <h1 className="mt-2 max-w-[430px] text-xl font-semibold leading-7 text-[#1C1C1C]">{product.name}</h1>
      <div className="mt-3 flex items-center gap-3 text-base text-[#8B96A5]">
        <RatingStars rating={product.rating} countClassName="text-[#FF9017]" size={15} />
        <span className="h-1 w-1 rounded-full bg-[#DEE2E7]" />
        <LuMessageSquareText size={18} />
        <span>32 reviews</span>
        <span className="h-1 w-1 rounded-full bg-[#DEE2E7]" />
        <LuShoppingBasket size={18} />
        <span>{product.stock || 154} sold</span>
      </div>

      <div className="mt-4 grid grid-cols-3 bg-[#FFF0DF]">
        {[
          [formatPrice(product.price), '50-100 pcs', true],
          [formatPrice(Math.max(product.price - 8, 1)), '100-700 pcs', false],
          [formatPrice(Math.max(product.price - 20, 1)), '700+ pcs', false],
        ].map(([price, label, active]) => (
          <div key={label as string} className="border-r border-[#BDC1C8]/60 px-4 py-4 last:border-r-0">
            <p className={active ? 'text-lg font-semibold text-[#FA3434]' : 'text-lg font-semibold text-[#1C1C1C]'}>
              {price}
            </p>
            <p className="text-sm text-[#606060]">{label}</p>
          </div>
        ))}
      </div>

      <dl className="mt-5 divide-y divide-[#E0E0E0] text-base">
        {[
          ['Price:', 'Negotiable'],
          ['Type:', product.category || 'Classic shoes'],
          ['Material:', product.features?.[0] || 'Plastic material'],
          ['Design:', product.brand || 'Modern nice'],
          ['Customization:', 'Customized logo and design custom packages'],
          ['Protection:', 'Refund Policy'],
          ['Warranty:', '2 years full warranty'],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[140px_1fr] gap-1 py-2.5">
            <dt className="text-[#8B96A5]">{label}</dt>
            <dd className="text-[#505050]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>

    <aside>
      <div className="rounded-md border border-[#DEE2E7] bg-white p-4 shadow-sm">
        <div className="flex gap-3 border-b border-[#E0E0E0] pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-[#C6F3F1] text-3xl font-semibold text-[#4CA7A3]">R</div>
          <div>
            <p className="text-base text-[#1C1C1C]">Supplier</p>
            <p className="text-base text-[#1C1C1C]">Guanjoi Trading LLC</p>
          </div>
        </div>
        <div className="space-y-4 py-5 text-base text-[#8B96A5]">
          <p className="flex items-center gap-4">
            <ReactCountryFlag countryCode="DE" svg style={{ width: '22px', height: '16px' }} />
            Germany, Berlin
          </p>
          <p className="flex items-center gap-4">
            <LuShieldCheck size={20} />
            Verified Seller
          </p>
          <p className="flex items-center gap-4">
            <LuGlobe size={20} />
            Worldwide shipping
          </p>
        </div>
        <button type="button" onClick={onInquiry} className="h-10 w-full rounded-md bg-gradient-to-b from-[#127FFF] to-[#0067FF] font-medium text-white">
          Send inquiry
        </button>
        <button type="button" className="mt-2 h-10 w-full rounded-md border border-[#DEE2E7] bg-white font-medium text-[#0D6EFD]">
          Seller's profile
        </button>
      </div>
      <button type="button" className="mx-auto mt-6 flex items-center gap-2 text-base font-medium text-[#0D6EFD]">
        <LuHeart size={22} />
        Save for later
      </button>
    </aside>
  </section>
);

const DescriptionArea = ({ product, related }: { product: Product; related: Product[] }) => (
  <section className="grid grid-cols-[1fr_280px] gap-5">
    <div className="rounded-md border border-[#DEE2E7] bg-white">
      <div className="flex h-12 border-b border-[#DEE2E7]">
        {['Description', 'Reviews', 'Shipping', 'About seller'].map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={index === 0 ? 'border-b-2 border-[#0D6EFD] px-6 font-medium text-[#0D6EFD]' : 'px-6 font-medium text-[#8B96A5]'}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-5">
        <p className="max-w-[800px] text-base leading-6 text-[#505050]">
          {product.description || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
        </p>
        <table className="mt-6 w-[567px] border border-[#DEE2E7] text-base text-[#505050]">
          <tbody>
            {[
              ['Model', '#8786867'],
              ['Style', 'Classic style'],
              ['Certificate', 'ISO-898921212'],
              ['Size', '34mm x 450mm x 19mm'],
              ['Memory', '36GB RAM'],
            ].map(([label, value]) => (
              <tr key={label} className="border-b border-[#DEE2E7] last:border-b-0">
                <td className="w-[205px] bg-[#EFF2F4] px-3 py-2">{label}</td>
                <td className="px-3 py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="mt-6 space-y-3 text-base text-[#505050]">
          {['Some great feature name here', 'Lorem ipsum dolor sit amet, consectetur', 'Duis aute irure dolor in reprehenderit', 'Some great feature name here'].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <LuCheck size={18} className="text-[#8B96A5]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <aside className="rounded-md border border-[#DEE2E7] bg-white p-4">
      <h2 className="font-semibold text-[#1C1C1C]">You may like</h2>
      <div className="mt-4 space-y-4">
        {related.map((item, index) => (
          <Link key={`${item._id}-${index}`} to={`/products/${item._id}`} className="grid grid-cols-[80px_1fr] gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-[#DEE2E7]">
              <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
            </div>
            <div>
              <p className="text-base leading-5 text-[#1C1C1C] line-clamp-2">{item.name}</p>
              <p className="mt-1 text-base text-[#8B96A5]">$7.00 - $99.50</p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  </section>
);

const RelatedProducts = ({ products }: { products: Product[] }) => (
  <section className="rounded-md border border-[#DEE2E7] bg-white p-5">
    <h2 className="text-xl font-semibold text-[#1C1C1C]">Related products</h2>
    <div className="mt-5 grid grid-cols-6 gap-5">
      {products.map((product, index) => (
        <Link key={`${product._id}-${index}`} to={`/products/${product._id}`}>
          <div className="flex h-[172px] items-center justify-center rounded-md bg-[#EEEEEE]">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain p-3" />
          </div>
          <p className="mt-3 text-base leading-5 text-[#505050] line-clamp-2">{product.name}</p>
          <p className="mt-2 text-base text-[#8B96A5]">$32.00-$40.00</p>
        </Link>
      ))}
    </div>
  </section>
);

const MobileDetail = ({
  product,
  related,
  onInquiry,
}: {
  product: Product;
  related: Product[];
  onInquiry: () => void;
}) => (
  <div className="bg-[#F7FAFC] pb-10">
    <div className="relative flex h-[305px] items-center justify-center bg-white">
      <img src={product.image} alt={product.name} className="h-full w-full object-contain p-6" />
      <div className="absolute bottom-2 right-2 flex h-8 w-16 items-center justify-center rounded-full bg-black/25 text-white">
        <LuArrowLeft size={18} />
        <LuArrowRight size={18} />
      </div>
    </div>

    <section className="border-b border-[#DEE2E7] bg-white px-4 py-4">
      <div className="flex items-center gap-2 text-sm text-[#8B96A5]">
        <RatingStars rating={product.rating} countClassName="hidden" size={15} />
        <span className="h-1 w-1 rounded-full bg-[#DEE2E7]" />
        <LuMessageSquareText size={16} />
        <span>32 reviews</span>
        <span className="h-1 w-1 rounded-full bg-[#DEE2E7]" />
        <LuShoppingBasket size={16} />
        <span>{product.stock || 154} sold</span>
      </div>
      <h1 className="mt-3 text-base font-medium text-[#1C1C1C]">{product.name}</h1>
      <p className="mt-2 text-base font-semibold text-[#FA3434]">
        {formatPrice(product.price)} <span className="font-normal text-[#8B96A5]">(50-100 pcs)</span>
      </p>
      <div className="mt-3 grid grid-cols-[1fr_48px] gap-2">
        <button type="button" onClick={onInquiry} className="h-10 rounded-md bg-gradient-to-b from-[#127FFF] to-[#0067FF] font-medium text-white">
          Send inquiry
        </button>
        <button type="button" className="flex h-10 items-center justify-center rounded-md border border-[#DEE2E7] bg-white text-[#0D6EFD]">
          <LuHeart size={22} />
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-[105px_1fr] gap-y-2 text-base">
        {[
          ['Condition', product.condition || 'Brand new'],
          ['Material', product.features?.[0] || 'Plastic'],
          ['Category', product.category || 'Electronics, gadgets'],
          ['Item num', '23421'],
        ].map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-[#8B96A5]">{label}</dt>
            <dd className="text-[#606060]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-base leading-6 text-[#505050] line-clamp-3">
        {product.description || 'Info about edu item is an ideal companion for anyone engaged in learning. The drone provides precise and ...'}
      </p>
      <button type="button" className="mt-1 text-base font-medium text-[#0D6EFD]">Read more</button>
    </section>

    <section className="border-b border-[#DEE2E7] bg-[#F7FAFC] p-2">
      <div className="rounded-md border border-[#DEE2E7] bg-white p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-[#C6F3F1] text-3xl font-semibold text-[#4CA7A3]">R</div>
          <div className="flex-1">
            <p className="text-base text-[#606060]">Supplier</p>
            <p className="text-base text-[#1C1C1C]">Guanjoi Trading LLC</p>
          </div>
          <LuChevronRight size={22} className="text-[#8B96A5]" />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#DEE2E7] pt-3 text-base text-[#606060]">
          <span className="flex items-center gap-2">
            <ReactCountryFlag countryCode="DE" svg style={{ width: '22px', height: '16px' }} />
            Germany
          </span>
          <span className="flex items-center gap-1"><LuShieldCheck size={18} /> Verified</span>
          <span className="flex items-center gap-1"><LuGlobe size={18} /> Shipping</span>
        </div>
      </div>
    </section>

    <section className="px-2 py-4">
      <h2 className="mb-4 text-xl font-semibold text-[#1C1C1C]">Similar products</h2>
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
        {related.slice(0, 4).map((item, index) => (
          <Link key={`${item._id}-${index}`} to={`/products/${item._id}`} className="w-[150px] shrink-0 rounded-md border border-[#DEE2E7] bg-white p-3">
            <img src={item.image} alt={item.name} className="mx-auto h-[130px] w-[130px] object-contain" />
            <p className="mt-2 text-base font-semibold text-[#1C1C1C]">$10.30</p>
            <p className="text-sm leading-5 text-[#8B96A5] line-clamp-2">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

export default ProductDetailsPage;
