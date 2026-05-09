import { SupplierForm } from '../UI/SupplierForm';

const SupplierQuoteForm = () => {
  return (
    <section className="relative grid min-h-[420px] overflow-hidden rounded-md lg:grid-cols-[1fr_490px]">
      <img
        src="/MainSupplierBg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C7FF8] via-[#1C7FF8]/85 to-[#55BDC3]/65" />
      <div className="relative z-10 max-w-[520px] px-10 py-11 text-white">
        <h2 className="text-[32px] font-semibold leading-10">An easy way to send requests to all suppliers</h2>
        <p className="mt-4 max-w-[390px] text-base leading-6">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
        </p>
      </div>
      <div className="relative z-10 flex items-center pr-8">
        <SupplierForm />
      </div>
    </section>
  );
};

export default SupplierQuoteForm;
