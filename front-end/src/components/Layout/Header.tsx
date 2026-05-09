import { useState, type ElementType, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';
import {
  LuArrowLeft,
  LuChevronDown,
  LuHeart,
  LuMenu,
  LuMessageSquareText,
  LuPackage,
  LuSearch,
  LuShoppingCart,
  LuUserRound,
  LuX,
} from 'react-icons/lu';
import logo from '../../assets/logo.svg';
import { useCart } from '../../context/CartContext';
import { mobileHomeTabs, mobileListTabs } from '../../data/storefront';
import { useMetadata } from '../../hooks/useMetadata';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'All category', path: '/products' },
  { label: 'Hot offers', path: '/products?hasDiscount=true' },
  { label: 'Gift boxes', path: '/products?tag=gift' },
  { label: 'Projects', path: '/products?tag=projects' },
  { label: 'Menu item', path: '/products?tag=menu' },
];

const fallbackCategories = ['Mobile Accessory', 'Electronics', 'Smartphones', 'Modern Tech', 'Clothes'];
const menuLinks = ['New arrivals', 'Best sellers', 'Source requests', 'Saved deals'];
const helpLinks = ['Help center', 'Contact us', 'Shipping', 'Money refund'];

const Header = () => {
  const { itemCount } = useCart();
  const { metadata } = useMetadata();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'category' | 'menu' | 'help' | 'currency' | 'ship' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isCart = location.pathname === '/cart';
  const isProducts = location.pathname === '/products';
  const isHome = location.pathname === '/';
  const showMobileSearch = isHome || isProducts;
  const mobileTabs = isProducts ? mobileListTabs : mobileHomeTabs;
  const categoryItems = metadata?.categories?.length ? metadata.categories : fallbackCategories;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(searchTerm ? `/products?search=${encodeURIComponent(searchTerm)}` : '/products');
    setIsOpen(false);
    setOpenMenu(null);
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(isCart ? '/' : '/products');
  };

  return (
    <header className="bg-white">
      <div className="hidden lg:block">
        <div className="border-b border-[#DEE2E7]">
          <div
            className={cn(
              'mx-auto flex h-[86px] max-w-[1180px] items-center',
              isCart ? 'justify-between' : 'gap-[68px]',
            )}
          >
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Brand logo" className="h-11 w-11" />
              <span className="text-[28px] font-bold text-[#8CB7F5]">Brand</span>
            </Link>

            {!isCart ? (
              <form onSubmit={handleSearch} className="flex h-10 flex-1 items-stretch">
                <label className="flex min-w-0 flex-1 items-center rounded-l-md border-2 border-r-0 border-[#0D6EFD] bg-white">
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search"
                    className="h-full min-w-0 flex-1 px-3 text-base outline-none placeholder:text-[#8B96A5]"
                  />
                </label>
                <select
                  className="h-full w-[145px] border-2 border-l border-r-0 border-[#0D6EFD] bg-white px-3 text-base outline-none"
                  onChange={(event) => {
                    if (event.target.value) navigate(`/products?category=${event.target.value}`);
                  }}
                  defaultValue=""
                >
                  <option value="">All category</option>
                  {categoryItems.slice(0, 8).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="h-full w-[100px] rounded-r-md bg-gradient-to-b from-[#127FFF] to-[#0067FF] text-base font-medium text-white"
                >
                  Search
                </button>
              </form>
            ) : null}

            <div className="ml-auto flex items-center gap-7 text-[#8B96A5]">
              <HeaderIcon icon={LuUserRound} label="Profile" />
              <HeaderIcon icon={LuMessageSquareText} label="Message" />
              <HeaderIcon icon={LuHeart} label="Orders" />
              <HeaderIcon to="/cart" icon={LuShoppingCart} label="My cart" count={itemCount} />
            </div>
          </div>
        </div>

        {!isCart ? (
          <div className="border-b border-[#DEE2E7]">
            <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between">
              <nav className="flex items-center gap-7 text-base font-medium text-[#1C1C1C]">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(openMenu === 'category' ? null : 'category')}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <LuMenu size={21} />
                    All category
                  </button>
                  {openMenu === 'category' ? (
                    <DropdownPanel className="left-0 top-9 w-56">
                      {categoryItems.slice(0, 8).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            navigate(`/products?category=${encodeURIComponent(item)}`);
                            setOpenMenu(null);
                          }}
                          className="block w-full cursor-pointer rounded px-3 py-2 text-left hover:bg-[#E5F1FF] hover:text-[#0D6EFD]"
                        >
                          {item}
                        </button>
                      ))}
                    </DropdownPanel>
                  ) : null}
                </div>
                {navItems.slice(1, 4).map((item) => (
                  <NavLink key={item.label} to={item.path} className="cursor-pointer">
                    {item.label}
                  </NavLink>
                ))}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(openMenu === 'menu' ? null : 'menu')}
                    className="cursor-pointer"
                  >
                    Menu item
                  </button>
                  {openMenu === 'menu' ? (
                    <DropdownPanel className="left-0 top-9 w-48">
                      {menuLinks.map((item) => (
                        <Link
                          key={item}
                          to={`/products?section=${encodeURIComponent(item)}`}
                          onClick={() => setOpenMenu(null)}
                          className="block rounded px-3 py-2 hover:bg-[#E5F1FF] hover:text-[#0D6EFD]"
                        >
                          {item}
                        </Link>
                      ))}
                    </DropdownPanel>
                  ) : null}
                </div>
                <div className="relative">
                  <button type="button" onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')} className="flex cursor-pointer items-center gap-1">
                    Help
                    <LuChevronDown size={18} className="text-[#8B96A5]" />
                  </button>
                  {openMenu === 'help' ? (
                    <DropdownPanel className="left-0 top-9 w-44">
                      {helpLinks.map((item) => (
                        <Link key={item} to="/products" onClick={() => setOpenMenu(null)} className="block rounded px-3 py-2 hover:bg-[#E5F1FF] hover:text-[#0D6EFD]">
                          {item}
                        </Link>
                      ))}
                    </DropdownPanel>
                  ) : null}
                </div>
              </nav>
              <div className="flex items-center gap-8 text-base font-medium text-[#1C1C1C]">
                <div className="relative">
                  <button type="button" onClick={() => setOpenMenu(openMenu === 'currency' ? null : 'currency')} className="flex cursor-pointer items-center gap-1">
                    English, USD
                    <LuChevronDown size={18} className="text-[#8B96A5]" />
                  </button>
                  {openMenu === 'currency' ? (
                    <DropdownPanel className="right-0 top-9 w-44">
                      {['English, USD', 'English, EUR', 'Urdu, PKR'].map((item) => (
                        <button key={item} type="button" onClick={() => setOpenMenu(null)} className="block w-full cursor-pointer rounded px-3 py-2 text-left hover:bg-[#E5F1FF]">
                          {item}
                        </button>
                      ))}
                    </DropdownPanel>
                  ) : null}
                </div>
                <div className="relative">
                  <button type="button" onClick={() => setOpenMenu(openMenu === 'ship' ? null : 'ship')} className="flex cursor-pointer items-center gap-2">
                    Ship to
                    <ReactCountryFlag countryCode="DE" svg style={{ width: '22px', height: '16px' }} />
                    <LuChevronDown size={18} className="text-[#8B96A5]" />
                  </button>
                  {openMenu === 'ship' ? (
                    <DropdownPanel className="right-0 top-9 w-44">
                      {[
                        ['DE', 'Germany'],
                        ['US', 'United States'],
                        ['PK', 'Pakistan'],
                      ].map(([code, label]) => (
                        <button key={code} type="button" onClick={() => setOpenMenu(null)} className="flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-left hover:bg-[#E5F1FF]">
                          <ReactCountryFlag countryCode={code} svg style={{ width: '20px', height: '14px' }} />
                          {label}
                        </button>
                      ))}
                    </DropdownPanel>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="lg:hidden">
        <div className="flex h-14 items-center justify-between border-b border-[#DEE2E7] px-4">
          {isHome ? (
            <>
              <button type="button" onClick={() => setIsOpen(true)} aria-label="Open menu">
                <LuMenu size={24} />
              </button>
              <Link to="/" className="ml-3 flex items-center gap-2">
                <img src={logo} alt="Brand logo" className="h-8 w-8" />
                <span className="text-2xl font-bold text-[#8CB7F5]">Brand</span>
              </Link>
              <div className="ml-auto flex items-center gap-5">
                <Link to="/cart" className="relative" aria-label="Cart">
                  <LuShoppingCart size={24} />
                  {itemCount > 0 ? (
                    <span className="cart-count-pop absolute -right-2 -top-2 rounded-full bg-[#0D6EFD] px-1 text-[10px] font-semibold text-white">
                      {itemCount}
                    </span>
                  ) : null}
                </Link>
                <button type="button" aria-label="Profile">
                  <LuUserRound size={23} />
                </button>
              </div>
            </>
          ) : (
            <>
              <button type="button" onClick={goBack} aria-label="Go back">
                <LuArrowLeft size={24} />
              </button>
              {isProducts || isCart ? (
                <h1 className="ml-4 mr-auto text-xl font-semibold text-[#1C1C1C]">
                  {isCart ? 'Shopping cart' : 'Mobile accessory'}
                </h1>
              ) : (
                <div className="mr-auto" />
              )}
              {!isCart ? (
                <div className="ml-auto flex items-center gap-5">
                  <Link to="/cart" className="relative" aria-label="Cart">
                    <LuShoppingCart size={24} />
                    {itemCount > 0 ? (
                      <span className="cart-count-pop absolute -right-2 -top-2 rounded-full bg-[#0D6EFD] px-1 text-[10px] font-semibold text-white">
                        {itemCount}
                      </span>
                    ) : null}
                  </Link>
                  <button type="button" aria-label="Profile">
                    <LuUserRound size={23} />
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>

        {showMobileSearch ? (
          <form onSubmit={handleSearch} className="border-b border-[#DEE2E7] bg-white px-4 py-2">
            <label className="flex h-10 items-center gap-2 rounded-md border border-[#DEE2E7] bg-[#F7FAFC] px-3 text-[#8B96A5]">
              <LuSearch size={20} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search"
                className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#8B96A5]"
              />
            </label>
          </form>
        ) : null}

        {showMobileSearch ? (
          <div className="flex gap-2 overflow-x-auto border-b border-[#DEE2E7] bg-white px-4 py-4 [scrollbar-width:none]">
            {mobileTabs.map((item) => (
              <Link
                key={item}
                to="/products"
                className="whitespace-nowrap rounded-md bg-[#EFF2F4] px-3 py-2 text-base text-[#0D6EFD]"
              >
                {item}
              </Link>
            ))}
          </div>
        ) : null}

        {isOpen ? (
          <div className="fixed inset-0 z-50 bg-black/30">
            <aside className="h-full w-[280px] bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <img src={logo} alt="Brand logo" className="h-8 w-8" />
                  <span className="text-2xl font-bold text-[#8CB7F5]">Brand</span>
                </Link>
                <button type="button" onClick={() => setIsOpen(false)} aria-label="Close menu">
                  <LuX size={22} />
                </button>
              </div>
              <nav className="mt-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-base text-[#505050]"
                  >
                    <LuPackage size={18} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        ) : null}
      </div>
    </header>
  );
};

interface HeaderIconProps {
  to?: string;
  icon: ElementType;
  label: string;
  count?: number;
}

const HeaderIcon = ({ to, icon: Icon, label, count = 0 }: HeaderIconProps) => {
  const className = 'relative flex cursor-pointer flex-col items-center gap-1 text-xs text-[#8B96A5]';
  const content = (
    <>
      <Icon size={22} />
      <span>{label}</span>
      {count > 0 ? (
        <span className="cart-count-pop absolute -right-2 -top-2 rounded-full bg-[#0D6EFD] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {count}
        </span>
      ) : null}
    </>
  );

  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" className={className}>
      {content}
    </button>
  );
};

const DropdownPanel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('absolute z-50 rounded-md border border-[#DEE2E7] bg-white p-2 text-sm text-[#505050] shadow-lg', className)}>
    {children}
  </div>
);

export default Header;
