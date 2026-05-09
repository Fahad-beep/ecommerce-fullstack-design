import { FaHeadset, FaShieldHalved, FaTruckFast, FaBoxesStacked } from 'react-icons/fa6';

const services = [
  {
    icon: FaTruckFast,
    title: 'Fast delivery',
    text: 'Reliable shipping across the marketplace.',
  },
  {
    icon: FaShieldHalved,
    title: 'Secure payments',
    text: 'Safe checkout flow for every order.',
  },
  {
    icon: FaHeadset,
    title: '24/7 support',
    text: 'Help is always available when shoppers need it.',
  },
  {
    icon: FaBoxesStacked,
    title: 'Large catalog',
    text: 'Products grouped from live backend metadata.',
  },
];

const ServicesStrip = () => {
  return (
    <section className="flex w-full justify-center px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <article
              key={service.title}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF] text-[#114eb5]">
                <Icon size={18} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesStrip;
