import ReactCountryFlag from 'react-country-flag';

const regions = [
  { country: 'AE', name: 'Arabic Emirates', url: 'shopname.ae' },
  { country: 'AU', name: 'Australia', url: 'shopname.ae' },
  { country: 'US', name: 'United States', url: 'shopname.ae' },
  { country: 'RU', name: 'Russia', url: 'shopname.ru' },
  { country: 'IT', name: 'Italy', url: 'shopname.it' },
  { country: 'DK', name: 'Denmark', url: 'denmark.com.dk' },
  { country: 'FR', name: 'France', url: 'shopname.com.fr' },
  { country: 'AE', name: 'Arabic Emirates', url: 'shopname.ae' },
  { country: 'CN', name: 'China', url: 'shopname.ae' },
  { country: 'GB', name: 'Great Britain', url: 'shopname.co.uk' },
];

const SuppliersByRegion = () => {
  return (
    <section className="mx-auto hidden max-w-[1180px] px-0 py-7 lg:block">
      <h2 className="text-2xl font-semibold text-[#1C1C1C]">Suppliers by region</h2>
      <div className="mt-6 grid grid-cols-5 gap-x-12 gap-y-4">
        {regions.map((region, index) => (
          <div key={`${region.name}-${index}`} className="flex items-start gap-3">
            <ReactCountryFlag
              countryCode={region.country}
              svg
              style={{ width: '28px', height: '20px' }}
              title={region.name}
            />
            <div>
              <p className="text-base leading-5 text-[#1C1C1C]">{region.name}</p>
              <p className="text-sm leading-5 text-[#8B96A5]">{region.url}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuppliersByRegion;
