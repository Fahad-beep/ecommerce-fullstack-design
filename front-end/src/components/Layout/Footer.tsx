import { FaApple, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa6';
import { IoLogoGooglePlaystore } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';
import logo from '../../assets/logo.svg';

const columns = [
  {
    title: 'About',
    links: ['About Us', 'Find store', 'Categories', 'Blogs'],
  },
  {
    title: 'Partnership',
    links: ['About Us', 'Find store', 'Categories', 'Blogs'],
  },
  {
    title: 'Information',
    links: ['Help Center', 'Money Refund', 'Shipping', 'Contact us'],
  },
  {
    title: 'For users',
    links: ['Login', 'Register', 'Settings', 'My Orders'],
  },
];

const Footer = () => {
  return (
    <footer className="bg-white">
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1.45fr_repeat(4,0.75fr)_0.95fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Brand logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-[#8CB7F5]">Brand</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#505050]">
              Best information about the company goes here but now lorem ipsum is.
            </p>
            <div className="mt-4 flex gap-2">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BDC4CD] text-white"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-[#1C1C1C]">{column.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-[#8B96A5]">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-[#0D6EFD]">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-[#1C1C1C]">Get app</h3>
            <div className="mt-3 space-y-2">
              <a href="#" className="flex h-10 items-center gap-2 rounded-md bg-[#1C1C1C] px-3 !text-white">
                <FaApple size={18} className="text-white" />
                <span className="text-xs leading-tight text-white">Download on the<br />App Store</span>
              </a>
              <a href="#" className="flex h-10 items-center gap-2 rounded-md bg-[#1C1C1C] px-3 !text-white">
                <IoLogoGooglePlaystore size={18} className="text-white" />
                <span className="text-xs leading-tight text-white">Get it on<br />Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#DEE2E7] bg-[#EFF2F4] px-4 py-5 text-sm text-[#606060]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2023 Ecommerce.</p>
          <button type="button" className="flex items-center gap-2">
            <ReactCountryFlag countryCode="US" svg style={{ width: '1.4em', height: '1.4em' }} />
            English
            <span>^</span>
          </button>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
