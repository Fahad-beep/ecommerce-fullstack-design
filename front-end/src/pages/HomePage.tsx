import { Link } from 'react-router-dom';
import { LuArrowRight, LuBox, LuSearch, LuSend, LuShieldCheck } from 'react-icons/lu';
import type { Product } from '../api/products.api';
import SupplierQuoteForm from '../components/Features/SupplierQuoteForm';
import SuppliersByRegion from '../components/Features/SuppliersByRegion';
import Newsletter from '../components/Layout/Newsletter';
import { useProducts } from '../hooks/useProducts';
import { categoryMenu, formatPrice, getDisplayProducts } from '../data/storefront';

const dealLabels = ['Smart watches', 'Laptops', 'GoPro cameras', 'Headphones', 'Canon cameras'];
const outdoorLabels = ['Soft chairs', 'Sofa & chair', 'Kitchen dishes', 'Smart watches', 'Kitchen mixer', 'Blenders', 'Home appliance', 'Coffee maker'];
const electronicsLabels = ['Smart watches', 'Cameras', 'Headphones', 'Smart watches', 'Gaming set', 'Laptops & PC', 'Smartphones', 'Electric kettle'];

const HomePage = () => {
  const { products } = useProducts({ limit: 24 });
  const saleProducts = useProducts({ hasDiscount: true, limit: 5 });
  const allProducts = getDisplayProducts(products, 24);
  const deals = getDisplayProducts(saleProducts.products.length ? saleProducts.products : products, 5);
  const outdoorProducts = getDisplayProducts(
    products.filter((product) => /interior|home|outdoor|clothing/i.test(product.category)),
    8,
  );
  const electronicsProducts = getDisplayProducts(
    products.filter((product) => /electronic|mobile|tech|computer/i.test(product.category)),
    8,
  );

  return (
    <section className="bg-[#F7FAFC]">
      <div className="hidden lg:block">
        <div className="mx-auto max-w-[1180px] space-y-5 py-5">
          <HeroSection />
          <DealsSection products={deals} />
          <CategorySection
            title="Home and outdoor"
            image="/HAndOBanner.jpg"
            products={outdoorProducts}
            labels={outdoorLabels}
          />
          <CategorySection
            title="Consumer electronics and gadgets"
            image="/techBanner.jpg"
            products={electronicsProducts}
            labels={electronicsLabels}
          />
          <SupplierQuoteForm />
          <RecommendedSection products={allProducts.slice(0, 10)} />
          <ServicesSection />
          <SuppliersByRegion />
        </div>
        <Newsletter />
      </div>

      <div className="lg:hidden">
        <MobileHome products={allProducts} deals={deals} outdoor={outdoorProducts} electronics={electronicsProducts} />
      </div>
    </section>
  );
};

const HeroSection = () => (
  <section className="grid min-h-[400px] grid-cols-[250px_1fr_200px] gap-4 rounded-md border border-[#DEE2E7] bg-white p-5">
    <aside className="space-y-1 text-base text-[#505050]">
      {categoryMenu.map((item, index) => (
        <Link
          key={item}
          to="/products"
          className={index === 0 ? 'block rounded-md bg-[#E5F1FF] px-3 py-2.5 font-medium text-[#1C1C1C]' : 'block px-3 py-2.5'}
        >
          {item}
        </Link>
      ))}
    </aside>

    <div
      className="flex min-h-[360px] items-start bg-cover bg-center px-11 py-14"
      style={{ backgroundImage: 'url(/MainSectionBanner.jpg)' }}
    >
      <div>
        <p className="text-[28px] leading-9 text-[#1C1C1C]">Latest trending</p>
        <h1 className="text-[32px] font-bold leading-10 text-[#1C1C1C]">Electronic items</h1>
        <Link to="/products" className="mt-5 inline-flex h-10 items-center rounded-md bg-white px-4 text-base font-medium text-[#1C1C1C]">
          Learn more
        </Link>
      </div>
    </div>

    <aside className="space-y-3">
      <div className="rounded-md bg-[#E3F0FF] p-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-white" />
          <p className="text-base leading-5 text-[#1C1C1C]">Hi, user<br />let's get stated</p>
        </div>
        <button type="button" className="mt-3 flex h-8 w-full cursor-default items-center justify-center rounded-md bg-gradient-to-b from-[#127FFF] to-[#0067FF] text-sm font-medium !text-white">
          Join now
        </button>
        <button type="button" className="mt-2 flex h-8 w-full cursor-default items-center justify-center rounded-md bg-white text-sm font-medium text-[#0D6EFD]">
          Log in
        </button>
      </div>
      <div className="rounded-md bg-[#F38332] p-4 text-base leading-5 text-white">Get US $10 off<br />with a new supplier</div>
      <div className="rounded-md bg-[#55BDC3] p-4 text-base leading-5 text-white">Send quotes with supplier preferences</div>
    </aside>
  </section>
);

const DealsSection = ({ products }: { products: Product[] }) => (
  <section className="grid overflow-hidden rounded-md border border-[#DEE2E7] bg-white lg:grid-cols-[280px_1fr]">
    <div className="border-r border-[#DEE2E7] p-5">
      <h2 className="text-xl font-semibold text-[#1C1C1C]">Deals and offers</h2>
      <p className="text-base text-[#8B96A5]">Hygiene equipments</p>
      <div className="mt-5 flex gap-1.5">
        {[
          ['04', 'Days'],
          ['13', 'Hour'],
          ['34', 'Min'],
          ['56', 'Sec'],
        ].map(([value, label]) => (
          <div key={label} className="flex h-[50px] w-[45px] flex-col items-center justify-center rounded bg-[#606060] text-white">
            <span className="text-base font-bold leading-4">{value}</span>
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-5 divide-x divide-[#DEE2E7]">
      {products.map((product, index) => (
        <Link key={`${product._id}-${index}`} to={`/products/${product._id}`} className="flex min-h-[235px] flex-col items-center justify-center p-3">
          <img src={product.image} alt={product.name} className="h-[135px] w-full object-contain" />
          <p className="mt-3 text-base text-[#1C1C1C]">{dealLabels[index] ?? product.name}</p>
          <span className="mt-2 rounded-full bg-[#FFE3E3] px-4 py-1 text-sm font-medium text-[#EB001B]">
            -{product.discount || 25}%
          </span>
        </Link>
      ))}
    </div>
  </section>
);

const CategorySection = ({
  title,
  image,
  products,
  labels,
}: {
  title: string;
  image: string;
  products: Product[];
  labels: string[];
}) => (
  <section className="grid overflow-hidden rounded-md border border-[#DEE2E7] bg-white lg:grid-cols-[280px_1fr]">
    <div className="min-h-[257px] bg-cover bg-center p-5" style={{ backgroundImage: `url(${image})` }}>
      <h2 className="max-w-[170px] text-xl font-semibold leading-7 text-[#1C1C1C]">{title}</h2>
      <Link to="/products" className="mt-5 inline-flex h-10 items-center rounded-md bg-white px-4 text-base font-medium text-[#1C1C1C]">
        Source now
      </Link>
    </div>
    <div className="grid grid-cols-4">
      {products.map((product, index) => (
        <Link
          key={`${product._id}-${index}`}
          to={`/products/${product._id}`}
          className="relative min-h-[128px] border-b border-r border-[#DEE2E7] p-4 last:border-r-0"
        >
          <p className="max-w-[120px] text-base leading-5 text-[#1C1C1C]">{labels[index] ?? product.name}</p>
          <p className="mt-2 text-sm leading-4 text-[#8B96A5]">From<br />USD {Math.round(product.price || 19)}</p>
          <img src={product.image} alt={product.name} className="absolute bottom-2 right-3 h-[82px] w-[82px] object-contain" />
        </Link>
      ))}
    </div>
  </section>
);

const RecommendedSection = ({ products }: { products: Product[] }) => (
  <section>
    <h2 className="mb-6 text-2xl font-semibold text-[#1C1C1C]">Recommended items</h2>
    <div className="grid grid-cols-5 gap-5">
      {products.map((product, index) => (
        <Link key={`${product._id}-${index}`} to={`/products/${product._id}`} className="rounded-md border border-[#DEE2E7] bg-white p-4">
          <div className="flex h-[200px] items-center justify-center">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
          </div>
          <p className="mt-3 text-base font-medium text-[#1C1C1C]">{formatPrice(product.price)}</p>
          <p className="mt-1 min-h-[48px] text-base leading-6 text-[#8B96A5] line-clamp-2">{product.name}</p>
        </Link>
      ))}
    </div>
  </section>
);

const services = [
  { title: 'Source from Industry Hubs', image: '/service-industry.png', icon: LuSearch },
  { title: 'Customize Your Products', image: '/service-custom.png', icon: LuBox },
  { title: 'Fast, reliable shipping by ocean or air', image: '/service-shipping.png', icon: LuSend },
  { title: 'Product monitoring and inspection', image: '/service-monitoring.png', icon: LuShieldCheck },
];

const ServicesSection = () => (
  <section>
    <h2 className="mb-6 text-2xl font-semibold text-[#1C1C1C]">Our extra services</h2>
    <div className="grid grid-cols-4 gap-5">
      {services.map((service) => {
        const Icon = service.icon;
        return (
          <article key={service.title} className="overflow-hidden rounded-md border border-[#DEE2E7] bg-white">
            <div className="relative h-[120px]">
              <img src={service.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute -bottom-8 right-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-[#D1E7FF]">
                <Icon size={24} />
              </div>
            </div>
            <h3 className="min-h-[80px] max-w-[210px] p-5 text-base font-medium leading-6 text-[#1C1C1C]">{service.title}</h3>
          </article>
        );
      })}
    </div>
  </section>
);

const MobileHome = ({
  products,
  deals,
  outdoor,
  electronics,
}: {
  products: Product[];
  deals: Product[];
  outdoor: Product[];
  electronics: Product[];
}) => (
  <div className="pb-8">
    <section
      className="h-[180px] bg-cover bg-center px-6 py-7"
      style={{ backgroundImage: 'url(/MainSectionBanner.jpg)' }}
    >
      <p className="text-xl leading-6 text-[#1C1C1C]">Latest trending</p>
      <h1 className="text-xl font-bold leading-6 text-[#1C1C1C]">Electronic items</h1>
      <Link to="/products" className="mt-5 inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-medium text-[#0D6EFD]">
        Learn more
      </Link>
    </section>

    <MobileDeals products={deals} />
    <MobileCategory title="Home and outdoor" products={outdoor} />
    <MobileCategory title="Consumer electronics" products={electronics} />

    <section
      className="mt-4 h-[160px] bg-cover bg-center px-6 py-7"
      style={{ backgroundImage: 'linear-gradient(90deg, rgba(13,110,253,0.95), rgba(85,189,195,0.65)), url(/MainSupplierBg.jpg)' }}
    >
      <h2 className="max-w-[280px] text-xl font-semibold leading-7 text-white">An easy way to send requests to all suppliers</h2>
      <Link to="/products" className="mt-5 inline-flex h-10 items-center rounded-md bg-[#0D6EFD] px-4 text-base font-medium text-white">
        Send inquiry
      </Link>
    </section>

    <section className="px-3 py-5">
      <h2 className="mb-3 text-xl font-semibold text-[#1C1C1C]">Recommended items</h2>
      <div className="grid grid-cols-2 gap-2">
        {products.slice(0, 8).map((product, index) => (
          <Link key={`${product._id}-${index}`} to={`/products/${product._id}`} className="rounded-md border border-[#DEE2E7] bg-white p-3">
            <div className="flex h-[155px] items-center justify-center">
              <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
            </div>
            <p className="mt-3 text-base font-semibold text-[#1C1C1C]">{formatPrice(product.price)}</p>
            <p className="mt-1 text-base leading-5 text-[#8B96A5] line-clamp-2">{product.name}</p>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

const MobileDeals = ({ products }: { products: Product[] }) => (
  <section className="mt-2 bg-white">
    <div className="flex items-center justify-between border-y border-[#DEE2E7] px-4 py-3">
      <div>
        <h2 className="text-xl font-semibold leading-6 text-[#1C1C1C]">Deals and offers</h2>
        <p className="text-sm text-[#606060]">Electronic equipments</p>
      </div>
      <div className="flex gap-1">
        {[
          ['13', 'Hour'],
          ['34', 'Min'],
          ['56', 'Sec'],
        ].map(([value, label]) => (
          <div key={label} className="flex h-[48px] w-[45px] flex-col items-center justify-center bg-[#EFF2F4] text-[#8B96A5]">
            <span className="font-semibold">{value}</span>
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="flex overflow-x-auto [scrollbar-width:none]">
      {products.map((product, index) => (
        <Link key={`${product._id}-${index}`} to={`/products/${product._id}`} className="w-[140px] shrink-0 border-r border-[#DEE2E7] p-3 text-center">
          <img src={product.image} alt={product.name} className="mx-auto h-[95px] w-[95px] object-contain" />
          <p className="mt-2 text-sm text-[#1C1C1C] line-clamp-1">{dealLabels[index] ?? product.name}</p>
          <span className="mt-2 inline-flex rounded-full bg-[#FFE3E3] px-4 py-1 text-sm font-medium text-[#EB001B]">
            -{product.discount || 25}%
          </span>
        </Link>
      ))}
    </div>
  </section>
);

const MobileCategory = ({ title, products }: { title: string; products: Product[] }) => (
  <section className="mt-2 bg-white">
    <h2 className="border-y border-[#DEE2E7] px-4 py-4 text-xl font-semibold text-[#1C1C1C]">{title}</h2>
    <div className="flex overflow-x-auto [scrollbar-width:none]">
      {products.slice(0, 4).map((product, index) => (
        <Link key={`${product._id}-${index}`} to={`/products/${product._id}`} className="w-[140px] shrink-0 border-r border-[#DEE2E7] p-4">
          <img src={product.image} alt={product.name} className="mx-auto h-[96px] w-[96px] object-contain" />
          <p className="mt-3 text-sm text-[#1C1C1C] line-clamp-1">Smart watches</p>
          <p className="text-sm text-[#8B96A5]">From USD 19</p>
        </Link>
      ))}
    </div>
    <Link to="/products" className="flex h-14 items-center gap-2 border-t border-[#DEE2E7] px-6 text-base font-medium text-[#0D6EFD]">
      Source now
      <LuArrowRight size={22} />
    </Link>
  </section>
);

export default HomePage;
