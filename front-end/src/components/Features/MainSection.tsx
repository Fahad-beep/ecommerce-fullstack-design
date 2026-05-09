import IconLabel from '../UI/IconLabel'
import MainUserCard from '../UI/MainUserCard';
import GiftCard from '../UI/GiftCard';

const MainSection = () => {
    const options = [
        "Auto Mobiles",
        "Clothes And Wear",
        "Home And Interior",
        "Computer And Tech",
        "Tools, equipments",
        "Sports And Outdoor",
        "Animl And Pets",
        "Machinery Tools",
        "More Category",
    ];
  return (
    <section className='flex w-full justify-center px-4 py-4 sm:px-6 lg:px-8'>
        <section className='grid w-full max-w-7xl gap-6 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[220px_1fr_320px] lg:p-6'>
            <div className='flex flex-row flex-wrap gap-x-4 gap-y-3 lg:flex-col lg:items-start'>
                {options.map((val) => (
                    <IconLabel key={val} label={val} textClassName='text-sm font-semibold text-slate-600' className='rounded-full bg-slate-50 px-4 py-2 lg:bg-transparent lg:px-0 lg:py-0' />
                ))}
            </div>
            <div className='overflow-hidden rounded-[1.75rem] bg-amber-600'>
                <img src="./MainSectionBanner.jpg" alt="Main Section Banner" className='h-full w-full object-cover'/>
            </div>
            <div className='flex flex-col gap-3'>
                <MainUserCard />
                <GiftCard className='bg-[#F38332]' text='Get US $10 Off With A New Supplier'/>
                <GiftCard className='bg-[#55BDC3]' text='Send Qoutes With Supplier Preferences'/>
            </div>
        </section>
      
    </section>
  )
}

export default MainSection
