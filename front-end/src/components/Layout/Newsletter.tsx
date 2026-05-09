import { LuMail } from 'react-icons/lu';

const Newsletter = () => {
  return (
    <section className="hidden bg-[#EFF2F4] px-4 py-9 text-center lg:block">
      <h2 className="text-xl font-semibold text-[#1C1C1C]">Subscribe on our newsletter</h2>
      <p className="mx-auto mt-1 max-w-xl text-base text-[#606060]">
        Get daily news on upcoming offers from many suppliers all over the world
      </p>
      <form className="mx-auto mt-5 flex max-w-[392px] gap-2">
        <label className="flex h-10 flex-1 items-center gap-2 rounded-md border border-[#DEE2E7] bg-white px-3 text-[#8B96A5]">
          <LuMail size={18} />
          <input
            type="email"
            placeholder="Email"
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8B96A5]"
          />
        </label>
        <button
          type="submit"
          className="h-10 rounded-md bg-gradient-to-b from-[#127FFF] to-[#0067FF] px-5 text-sm font-medium text-white"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
