import React from 'react'
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
    <section className='flex flex-row max-h-[40rem] w-screen justify-center py-[2rem] '>
        <section className='w-[89%] h-full flex flex-row justify-between bg-white rounded-lg p-5 items-center '>
            <div className='flex flex-col justify-center items-start gap-y-4 bg-red-500 h-full'>
                {options.map((val) => (
                    <IconLabel key={val} label={val} textClassName='text-[1rem] font-semibold' />
                ))}
            </div>
            <div className='self-stretch w-[30rem] bg-amber-600 rounded-md'></div>
            <div className='flex flex-col w-[20rem] h-full gap-2'>
                <MainUserCard />
                <GiftCard className='bg-[#F38332]' text='Get US $10 Off With A New Supplier'/>
                <GiftCard className='bg-[#55BDC3]' text='Send Qoutes With Supplier Preferences'/>
            </div>
        </section>
      
    </section>
  )
}

export default MainSection
