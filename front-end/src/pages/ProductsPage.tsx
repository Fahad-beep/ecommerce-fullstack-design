import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuFilter,
  LuGrid2X2,
  LuHeart,
  LuList,
  LuSlidersHorizontal,
  LuX,
} from 'react-icons/lu';
import type { Product } from '../api/products.api';
import Newsletter from '../components/Layout/Newsletter';
import { ProductCard } from '../components/UI/ProductCard';
import { RatingStars } from '../components/UI/RatingStars';
import { useCart } from '../context/CartContext';
import { useMetadata } from '../hooks/useMetadata';
import { useProducts } from '../hooks/useProducts';
import { cn } from '../utils/cn';
import { formatPrice, oldPrice } from '../data/storefront';

const fallbackCategories = ['Mobile accessory', 'Electronics', 'Smartphones', 'Modern tech'];
const fallbackBrands = ['Samsung', 'Apple', 'Huawei', 'Pocco', 'Lenovo'];
const fallbackFeatures = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'];
const fallbackConditions = ['Any', 'Refurbished', 'Brand new', 'Old items'];
const PRICE_SLIDER_MAX = 10000;

const readListParam = (params: URLSearchParams, key: string) => params.getAll(key).filter(Boolean);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { metadata } = useMetadata();
  const [search, setSearch] = useState(searchParams.get('search') ?? searchParams.get('q') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [brand, setBrand] = useState(searchParams.get('brand') ?? '');
  const [condition, setCondition] = useState(searchParams.get('condition') ?? '');
  const [features, setFeatures] = useState<string[]>(readListParam(searchParams, 'features'));
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') ?? '');
  const [hasDiscount, setHasDiscount] = useState(searchParams.get('hasDiscount') === 'true');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'featured');
  const [view, setView] = useState<'list' | 'grid'>(searchParams.get('view') === 'grid' ? 'grid' : 'list');

  useEffect(() => {
    setSearch(searchParams.get('search') ?? searchParams.get('q') ?? '');
    setCategory(searchParams.get('category') ?? '');
    setBrand(searchParams.get('brand') ?? '');
    setCondition(searchParams.get('condition') ?? '');
    setFeatures(readListParam(searchParams, 'features'));
    setMinPrice(searchParams.get('minPrice') ?? '');
    setMaxPrice(searchParams.get('maxPrice') ?? '');
    setMinRating(searchParams.get('minRating') ?? '');
    setHasDiscount(searchParams.get('hasDiscount') === 'true');
    setVerifiedOnly(searchParams.get('verified') === 'true');
    setSort(searchParams.get('sort') ?? 'featured');
    setView(searchParams.get('view') === 'grid' ? 'grid' : 'list');
  }, [searchParams]);

  const { products, meta, isLoading, error } = useProducts({
    search,
    category: category || undefined,
    brand: brand || undefined,
    condition: condition && condition !== 'Any' ? condition : undefined,
    features: features.length ? features : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    hasDiscount: hasDiscount || undefined,
    limit: 12,
  });

  const categories = metadata?.categories?.length ? metadata.categories : fallbackCategories;
  const brands = metadata?.brands?.length ? metadata.brands : fallbackBrands;
  const availableFeatures = metadata?.features?.length ? metadata.features : fallbackFeatures;
  const conditions = metadata?.conditions?.length ? Array.from(new Set(['Any', ...metadata.conditions])) : fallbackConditions;
  const pageTitle = category || search || 'Mobile accessory';

  const sortedProducts = useMemo(() => {
    const nextProducts = [...products];
    if (sort === 'price-low') return nextProducts.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return nextProducts.sort((a, b) => b.price - a.price);
    if (sort === 'rating') return nextProducts.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return nextProducts;
  }, [products, sort]);

  const activeFilters = [
    category,
    brand,
    condition && condition !== 'Any' ? condition : '',
    ...features,
    minPrice || maxPrice ? 'Price range' : '',
    minRating ? `${minRating} star & up` : '',
    hasDiscount ? 'Deals' : '',
  ].filter(Boolean);
  const displayProducts = sortedProducts;
  const totalCount = meta.totalCount;

  const updateParams = (updates: Record<string, string | string[] | boolean | null>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      nextParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((item) => nextParams.append(key, item));
      } else if (typeof value === 'boolean') {
        if (value) nextParams.set(key, 'true');
      } else if (value) {
        nextParams.set(key, value);
      }
    });
    setSearchParams(nextParams);
  };

  const submitPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedMin = minPrice ? String(Math.max(0, Number(minPrice))) : '';
    const normalizedMax = maxPrice ? String(Math.max(0, Number(maxPrice))) : '';
    const shouldSwap = normalizedMin && normalizedMax && Number(normalizedMin) > Number(normalizedMax);
    const nextMin = shouldSwap ? normalizedMax : normalizedMin;
    const nextMax = shouldSwap ? normalizedMin : normalizedMax;
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
    updateParams({ minPrice: nextMin, maxPrice: nextMax });
  };

  const toggleFeature = (feature: string) => {
    updateParams({
      features: features.includes(feature)
        ? features.filter((item) => item !== feature)
        : [...features, feature],
    });
  };

  const updateMinPrice = (value: string) => {
    const nextValue = Math.max(0, Number(value || 0));
    setMinPrice(value === '' ? '' : String(nextValue));
  };

  const updateMaxPrice = (value: string) => {
    const nextValue = Math.max(0, Number(value || 0));
    setMaxPrice(value === '' ? '' : String(nextValue));
  };

  const toggleRating = (rating: number) => {
    updateParams({ minRating: minRating === String(rating) ? null : String(rating) });
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams();
    nextParams.set('view', view);
    setSearchParams(nextParams);
  };

  return (
    <>
      <section className="hidden bg-[#F7FAFC] px-4 py-5 lg:block">
        <div className="mx-auto max-w-[1180px]">
          <Breadcrumb />

          <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
            <FilterSidebar
              categories={categories}
              brands={brands}
              features={availableFeatures}
              conditions={conditions}
              category={category}
              brand={brand}
              condition={condition}
              selectedFeatures={features}
              minPrice={minPrice}
              maxPrice={maxPrice}
              minRating={minRating}
              priceLimit={PRICE_SLIDER_MAX}
              onCategory={(item) => updateParams({ category: category === item ? null : item })}
              onBrand={(item) => updateParams({ brand: brand === item ? null : item })}
              onFeature={toggleFeature}
              onCondition={(item) => updateParams({ condition: item })}
              onMinPrice={updateMinPrice}
              onMaxPrice={updateMaxPrice}
              onRating={toggleRating}
              onPriceSubmit={submitPrice}
            />

            <div>
              <Toolbar
                totalCount={totalCount}
                pageTitle={pageTitle}
                verifiedOnly={verifiedOnly}
                sort={sort}
                view={view}
                onVerified={(value) => updateParams({ verified: value })}
                onSort={(value) => updateParams({ sort: value })}
                onView={(value) => updateParams({ view: value })}
              />

              {view === 'grid' && activeFilters.length ? (
                <ActiveChips filters={activeFilters} onClear={clearFilters} />
              ) : null}

              {error ? (
                <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              {isLoading ? (
                <LoadingRows view={view} />
              ) : !displayProducts.length ? (
                <EmptyProducts hasFilters={activeFilters.length > 0} onClear={clearFilters} />
              ) : view === 'list' ? (
                <div className="space-y-3">
                  {displayProducts.map((product, index) => (
                    <ProductListRow key={`${product._id}-${index}`} product={product} onAdd={addToCart} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {displayProducts.map((product, index) => (
                    <ProductCard key={`${product._id}-${index}`} product={product} />
                  ))}
                </div>
              )}

              {displayProducts.length ? <Pagination /> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="lg:hidden">
        <MobileProducts products={displayProducts} activeFilters={activeFilters} addToCart={addToCart} clearFilters={clearFilters} />
      </section>

      <Newsletter />
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

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  features: string[];
  conditions: string[];
  category: string;
  brand: string;
  condition: string;
  selectedFeatures: string[];
  minPrice: string;
  maxPrice: string;
  minRating: string;
  priceLimit: number;
  onCategory: (item: string) => void;
  onBrand: (item: string) => void;
  onFeature: (item: string) => void;
  onCondition: (item: string) => void;
  onRating: (rating: number) => void;
  onMinPrice: (value: string) => void;
  onMaxPrice: (value: string) => void;
  onPriceSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const FilterSidebar = ({
  categories,
  brands,
  features,
  conditions,
  category,
  brand,
  condition,
  selectedFeatures,
  minPrice,
  maxPrice,
  minRating,
  priceLimit,
  onCategory,
  onBrand,
  onFeature,
  onCondition,
  onRating,
  onMinPrice,
  onMaxPrice,
  onPriceSubmit,
}: FilterSidebarProps) => {
  const minNumber = Math.max(0, Number(minPrice || 0));
  const maxNumber = maxPrice === '' ? priceLimit : Math.max(0, Number(maxPrice));
  const sliderMin = Math.min(minNumber, priceLimit);
  const sliderMax = Math.min(Math.max(maxNumber, sliderMin), priceLimit);
  const startPercent = (sliderMin / priceLimit) * 100;
  const endPercent = (sliderMax / priceLimit) * 100;

  return (
  <aside className="text-base text-[#505050]">
    <FilterSection title="Category">
      {categories.slice(0, 5).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onCategory(item)}
          className={cn('block w-full cursor-pointer py-2 text-left', category === item ? 'font-medium text-[#0D6EFD]' : '')}
        >
          {item}
        </button>
      ))}
      <button type="button" className="cursor-pointer pt-1 text-[#0D6EFD]">See all</button>
    </FilterSection>

    <FilterSection title="Brands">
      {brands.slice(0, 5).map((item) => (
        <label key={item} className="flex cursor-pointer items-center gap-3 py-2">
          <input
            type="checkbox"
            checked={brand === item}
            onChange={() => onBrand(item)}
            className="h-5 w-5 rounded border-[#BDBDBD] accent-[#0D6EFD]"
          />
          <span>{item}</span>
        </label>
      ))}
      <button type="button" className="cursor-pointer pt-1 text-[#0D6EFD]">See all</button>
    </FilterSection>

    <FilterSection title="Features">
      {features.slice(0, 5).map((item) => (
        <label key={item} className="flex cursor-pointer items-center gap-3 py-2">
          <input
            type="checkbox"
            checked={selectedFeatures.includes(item)}
            onChange={() => onFeature(item)}
            className="h-5 w-5 rounded border-[#BDBDBD] accent-[#0D6EFD]"
          />
          <span>{item}</span>
        </label>
      ))}
      <button type="button" className="cursor-pointer pt-1 text-[#0D6EFD]">See all</button>
    </FilterSection>

    <FilterSection title="Price range">
      <form onSubmit={onPriceSubmit} className="space-y-3">
        <div className="relative h-8">
          <div
            className="absolute left-1 right-1 top-3.5 h-1 rounded-full"
            style={{
              background: `linear-gradient(to right, #DEE2E7 0%, #DEE2E7 ${startPercent}%, #0D6EFD ${startPercent}%, #0D6EFD ${endPercent}%, #DEE2E7 ${endPercent}%, #DEE2E7 100%)`,
            }}
          />
          <input
            type="range"
            min="0"
            max={priceLimit}
            step="10"
            value={sliderMin}
            onChange={(event) => onMinPrice(String(Math.min(Number(event.target.value), sliderMax)))}
            className="price-range-input"
            aria-label="Minimum price slider"
          />
          <input
            type="range"
            min="0"
            max={priceLimit}
            step="10"
            value={sliderMax}
            onChange={(event) => onMaxPrice(String(Math.max(Number(event.target.value), sliderMin)))}
            className="price-range-input"
            aria-label="Maximum price slider"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label>
            <span className="text-base text-[#1C1C1C]">Min</span>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => onMinPrice(event.target.value)}
              placeholder="0"
              className="mt-1 h-10 w-full rounded-md border border-[#DEE2E7] px-3 outline-none placeholder:text-[#BDC4CD]"
              inputMode="numeric"
            />
          </label>
          <label>
            <span className="text-base text-[#1C1C1C]">Max</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => onMaxPrice(event.target.value)}
              placeholder="999999"
              className="mt-1 h-10 w-full rounded-md border border-[#DEE2E7] px-3 outline-none placeholder:text-[#BDC4CD]"
              inputMode="numeric"
            />
          </label>
        </div>
        <button type="submit" className="h-10 w-full cursor-pointer rounded-md border border-[#DEE2E7] bg-white font-medium text-[#0D6EFD]">
          Apply
        </button>
      </form>
    </FilterSection>

    <FilterSection title="Condition">
      {conditions.slice(0, 4).map((item) => (
        <label key={item} className="flex cursor-pointer items-center gap-3 py-2">
          <input
            type="radio"
            name="condition"
            checked={(condition || 'Any') === item}
            onChange={() => onCondition(item)}
            className="h-5 w-5 border-[#BDBDBD] accent-[#0D6EFD]"
          />
          <span>{item}</span>
        </label>
      ))}
    </FilterSection>

    <FilterSection title="Ratings">
      {[5, 4, 3, 2].map((rating) => (
        <button key={rating} type="button" onClick={() => onRating(rating)} className="flex cursor-pointer items-center gap-3 py-2">
          <span className={cn(
            'flex h-5 w-5 items-center justify-center rounded border',
            minRating === String(rating) ? 'border-[#0D6EFD] bg-[#0D6EFD]' : 'border-[#BDBDBD] bg-white',
          )}>
            {minRating === String(rating) ? <span className="h-2 w-2 rounded-sm bg-white" /> : null}
          </span>
          <RatingStars rating={rating} countClassName="hidden" size={16} />
        </button>
      ))}
    </FilterSection>
  </aside>
  );
};

const FilterSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-t border-[#DEE2E7] py-3">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="font-semibold text-[#1C1C1C]">{title}</h3>
      <LuChevronUp size={18} className="text-[#8B96A5]" />
    </div>
    {children}
  </section>
);

interface ToolbarProps {
  totalCount: number;
  pageTitle: string;
  verifiedOnly: boolean;
  sort: string;
  view: 'list' | 'grid';
  onVerified: (value: boolean) => void;
  onSort: (value: string) => void;
  onView: (value: 'list' | 'grid') => void;
}

const Toolbar = ({ totalCount, pageTitle, verifiedOnly, sort, view, onVerified, onSort, onView }: ToolbarProps) => (
  <div className="mb-5 flex h-[62px] items-center justify-between rounded-md border border-[#DEE2E7] bg-white px-4">
    <p className="text-base text-[#1C1C1C]">
      {totalCount.toLocaleString()} items in <span className="font-semibold">{pageTitle}</span>
    </p>
    <div className="flex items-center gap-3">
      <label className="flex cursor-pointer items-center gap-2 text-base text-[#1C1C1C]">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(event) => onVerified(event.target.checked)}
          className="h-5 w-5 rounded accent-[#0D6EFD]"
        />
        Verified only
      </label>
      <select
        value={sort}
        onChange={(event) => onSort(event.target.value)}
        className="h-10 w-[172px] rounded-md border border-[#DEE2E7] bg-white px-3 text-base outline-none"
      >
        <option value="featured">Featured</option>
        <option value="price-low">Price: low to high</option>
        <option value="price-high">Price: high to low</option>
        <option value="rating">Top rated</option>
      </select>
      <ViewSwitch view={view} onView={onView} />
    </div>
  </div>
);

const ViewSwitch = ({ view, onView }: { view: 'list' | 'grid'; onView: (value: 'list' | 'grid') => void }) => (
  <div className="flex overflow-hidden rounded-md border border-[#DEE2E7]">
    <button
      type="button"
      onClick={() => onView('grid')}
      className={cn('flex h-10 w-10 items-center justify-center', view === 'grid' ? 'bg-[#EFF2F4]' : 'bg-white')}
      aria-label="Grid view"
    >
      <LuGrid2X2 size={21} />
    </button>
    <button
      type="button"
      onClick={() => onView('list')}
      className={cn('flex h-10 w-10 items-center justify-center border-l border-[#DEE2E7]', view === 'list' ? 'bg-[#EFF2F4]' : 'bg-white')}
      aria-label="List view"
    >
      <LuList size={22} />
    </button>
  </div>
);

const ActiveChips = ({ filters, onClear }: { filters: string[]; onClear: () => void }) => (
  <div className="mb-5 flex flex-wrap items-center gap-2">
    {filters.map((item) => (
      <span key={item} className="inline-flex h-8 items-center gap-2 rounded-md border border-[#0D6EFD] bg-white px-3 text-base text-[#505050]">
        {item}
        <LuX size={18} className="text-[#8B96A5]" />
      </span>
    ))}
      <button type="button" onClick={onClear} className="ml-2 cursor-pointer text-base text-[#0D6EFD]">
      Clear all filter
    </button>
  </div>
);

const ProductListRow = ({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) => {
  const previousPrice = oldPrice(product);

  return (
    <article className="grid min-h-[230px] grid-cols-[200px_1fr_60px] gap-5 rounded-md border border-[#DEE2E7] bg-white p-5">
      <Link to={`/products/${product._id}`} className="flex h-[184px] w-[184px] items-center justify-center">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
      </Link>
      <div className="min-w-0">
        <Link to={`/products/${product._id}`} className="text-base font-medium text-[#1C1C1C] hover:text-[#0D6EFD]">
          {product.name}
        </Link>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-[22px] font-semibold text-[#1C1C1C]">{formatPrice(product.price)}</span>
          {previousPrice ? <span className="text-base text-[#8B96A5] line-through">{formatPrice(previousPrice)}</span> : null}
        </div>
        <div className="mt-1 flex items-center gap-3 text-base text-[#8B96A5]">
          <RatingStars rating={product.rating} countClassName="text-[#FF9017]" size={15} />
          <span className="h-1 w-1 rounded-full bg-[#DEE2E7]" />
          <span>{product.stock || 154} orders</span>
          <span className="h-1 w-1 rounded-full bg-[#DEE2E7]" />
          <span className="text-[#00B517]">Free Shipping</span>
        </div>
        <p className="mt-3 max-w-[610px] text-base leading-6 text-[#505050] line-clamp-2">
          {product.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'}
        </p>
        <div className="mt-2 flex gap-5">
          <Link to={`/products/${product._id}`} className="text-base font-medium text-[#0D6EFD]">
            View details
          </Link>
          <button type="button" onClick={() => onAdd(product)} className="cursor-pointer text-base font-medium text-[#0D6EFD]">
            Add to cart
          </button>
        </div>
      </div>
      <button type="button" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-[#DEE2E7] bg-white text-[#0D6EFD]" aria-label="Save product">
        <LuHeart size={22} />
      </button>
    </article>
  );
};

const LoadingRows = ({ view }: { view: 'list' | 'grid' }) => (
  <div className={view === 'grid' ? 'grid gap-5 md:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
    {Array.from({ length: view === 'grid' ? 6 : 4 }).map((_, index) => (
      <div key={index} className={cn('animate-pulse rounded-md border border-[#DEE2E7] bg-white', view === 'grid' ? 'h-[405px]' : 'h-[230px]')} />
    ))}
  </div>
);

const EmptyProducts = ({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) => (
  <div className="rounded-md border border-[#DEE2E7] bg-white px-5 py-10 text-center">
    <h2 className="text-xl font-semibold text-[#1C1C1C]">
      {hasFilters ? 'No products match this filter' : 'No products available'}
    </h2>
    <p className="mx-auto mt-2 max-w-md text-base leading-6 text-[#8B96A5]">
      {hasFilters
        ? 'Try widening the price range or clearing the selected filters.'
        : 'Products will appear here once they are added from the admin catalog.'}
    </p>
    {hasFilters ? (
      <button type="button" onClick={onClear} className="mt-5 h-10 cursor-pointer rounded-md border border-[#DEE2E7] bg-white px-4 font-medium text-[#0D6EFD]">
        Clear filters
      </button>
    ) : null}
  </div>
);

const Pagination = () => (
  <div className="mt-8 flex items-center justify-end gap-3">
    <button type="button" className="flex h-10 cursor-pointer items-center gap-4 rounded-md border border-[#DEE2E7] bg-white px-4 text-base text-[#1C1C1C]">
      Show 10
      <LuChevronDown size={18} className="text-[#8B96A5]" />
    </button>
    <div className="flex overflow-hidden rounded-md border border-[#DEE2E7] bg-white">
      <button type="button" className="flex h-10 w-11 cursor-pointer items-center justify-center text-[#8B96A5]"><LuChevronLeft size={20} /></button>
      {[1, 2, 3].map((page) => (
        <button key={page} type="button" className={cn('h-10 w-11 cursor-pointer border-l border-[#DEE2E7]', page === 1 ? 'bg-[#EFF2F4] text-[#8B96A5]' : 'bg-white text-[#1C1C1C]')}>
          {page}
        </button>
      ))}
      <button type="button" className="flex h-10 w-11 cursor-pointer items-center justify-center border-l border-[#DEE2E7] text-[#1C1C1C]"><LuChevronRight size={20} /></button>
    </div>
  </div>
);

const MobileProducts = ({
  products,
  activeFilters,
  addToCart,
  clearFilters,
}: {
  products: Product[];
  activeFilters: string[];
  addToCart: (product: Product) => void;
  clearFilters: () => void;
}) => (
  <div className="bg-[#F7FAFC] pb-8">
    <div className="flex items-center gap-2 border-b border-[#DEE2E7] bg-white px-3 py-2">
      <button type="button" className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#DEE2E7] bg-white text-sm text-[#1C1C1C]">
        Sort: Newest
        <LuSlidersHorizontal size={17} className="text-[#8B96A5]" />
      </button>
      <button type="button" className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#DEE2E7] bg-white text-sm text-[#1C1C1C]">
        Filter (3)
        <LuFilter size={17} className="text-[#8B96A5]" />
      </button>
      <div className="flex overflow-hidden rounded-md border border-[#DEE2E7]">
        <button type="button" className="flex h-8 w-8 items-center justify-center bg-white"><LuGrid2X2 size={18} /></button>
        <button type="button" className="flex h-8 w-8 items-center justify-center border-l border-[#DEE2E7] bg-[#EFF2F4]"><LuList size={20} /></button>
      </div>
    </div>

    {activeFilters.length ? (
    <div className="flex gap-2 overflow-x-auto border-b border-[#DEE2E7] bg-white px-3 py-2 [scrollbar-width:none]">
      {activeFilters.slice(0, 4).map((filter) => (
        <button key={filter} type="button" className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-md border border-[#0D6EFD] bg-white px-3 text-base text-[#505050]">
          {filter}
          <LuX size={18} className="text-[#8B96A5]" />
        </button>
      ))}
      <button type="button" onClick={clearFilters} className="shrink-0 cursor-pointer text-sm text-[#0D6EFD]">
        Clear
      </button>
    </div>
    ) : null}

    {products.length ? (
      <div className="space-y-2 px-2 py-2">
        {products.slice(0, 5).map((product, index) => (
          <MobileProductRow key={`${product._id}-${index}`} product={product} addToCart={addToCart} />
        ))}
      </div>
    ) : (
      <div className="px-2 py-3">
        <EmptyProducts hasFilters={activeFilters.length > 0} onClear={clearFilters} />
      </div>
    )}

    {products.length ? (
    <section className="px-2 pt-2">
      <h2 className="mb-4 text-xl font-semibold text-[#1C1C1C]">You may also like</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {products.slice(0, 4).map((product, index) => (
          <Link key={`${product._id}-related-${index}`} to={`/products/${product._id}`} className="w-[150px] shrink-0 rounded-md border border-[#DEE2E7] bg-white p-3">
            <img src={product.image} alt={product.name} className="mx-auto h-[110px] w-[110px] object-contain" />
            <p className="mt-2 text-base font-semibold text-[#1C1C1C]">{formatPrice(10.3)}</p>
            <p className="text-sm leading-5 text-[#8B96A5] line-clamp-2">{product.name}</p>
          </Link>
        ))}
      </div>
    </section>
    ) : null}
  </div>
);

const MobileProductRow = ({ product, addToCart }: { product: Product; addToCart: (product: Product) => void }) => (
  <article className="grid grid-cols-[96px_1fr] gap-4 rounded-md border border-[#DEE2E7] bg-white p-3">
    <Link to={`/products/${product._id}`} className="flex h-24 w-24 items-center justify-center rounded bg-white">
      <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
    </Link>
    <div>
      <Link to={`/products/${product._id}`} className="text-base leading-5 text-[#606060] line-clamp-1">
        {product.name || 'Regular Fit Resort Shirt'}
      </Link>
      <p className="mt-1 text-base font-semibold text-[#1C1C1C]">{formatPrice(product.price || 57.7)}</p>
      <div className="mt-1 flex items-center gap-2 text-sm text-[#8B96A5]">
        <RatingStars rating={product.rating} countClassName="text-[#FF9017]" size={14} />
        <span className="h-1 w-1 rounded-full bg-[#DEE2E7]" />
        <span>{product.stock || 154} orders</span>
      </div>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-sm text-[#00B517]">Free Shipping</span>
        <button type="button" onClick={() => addToCart(product)} className="cursor-pointer text-sm font-medium text-[#0D6EFD]">
          Add to cart
        </button>
      </div>
    </div>
  </article>
);

export default ProductsPage;
