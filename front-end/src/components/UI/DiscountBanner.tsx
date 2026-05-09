const DiscountBanner = () => {
  return (
    <section className="hidden overflow-hidden rounded-md bg-[#005ADE] lg:block">
      <div className="relative flex min-h-[120px] items-center justify-between px-8">
        <div className="absolute inset-y-0 left-0 w-[65%] bg-gradient-to-r from-[#237CFF] to-[#2C7CF1]" />
        <div className="absolute inset-y-0 left-[58%] w-24 -skew-x-[18deg] bg-[#0051C8]" />
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-white">Super discount on more than 100 USD</h2>
          <p className="mt-1 text-base text-[#CDE1FF]">Have you ever finally just write dummy info</p>
        </div>
        <button
          type="button"
          className="relative z-10 rounded-md bg-[#FF9017] px-6 py-3 text-base font-medium text-white"
        >
          Shop now
        </button>
      </div>
    </section>
  );
};

export default DiscountBanner;
