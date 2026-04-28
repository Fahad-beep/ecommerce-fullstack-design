import logo from '../../assets/logo.svg'
import { Button } from '../UI/Button'
import SearchBar from '../UI/SearchBar'
import {HeartIcon} from '../../Icons/Heart'
import {CartIcon} from '../../Icons/Cart'
import {MessageIcon} from '../../Icons/Message'
import {PersonIcon} from '../../Icons/Person'
import IconLabel from '../UI/IconLabel'
import { DropdownButton } from '../UI/DropDown'
import { LuAlignJustify } from "react-icons/lu";
import { LuChevronDown } from 'react-icons/lu';
import ReactCountryFlag from 'react-country-flag'

function Header() {

    const categoryItems = [
    { label: 'Electronics', onClick: () => console.log('Tech clicked') },
    { label: 'Interior', onClick: () => console.log('Interior clicked') },
    { label: 'Clothing', onClick: () => console.log('Clothes clicked') },
  ];
  const accessIconSize = 20;

  return (
    <header className='max-w-screen w-screen flex flex-col bg-white'>
        <section className='flex flex-row justify-between px-[8rem] py-[1rem] border-b-[0.5px] border-b-gray-200'>
            <div className='flex-row flex items-center gap-1'>
                <img src={logo} alt='brand-logo' decoding='async'/>
                <p className='text-[#8CB7F5] font-bold text-xl'>Brand</p>
            </div>
            <div className="flex flex-row items-stretch h-[2.5rem]">
                <SearchBar 
                    label="Search for products..."
                    className="h-full !rounded-r-none border-r-0 focus:ring-0 w-64" 
                />
                <DropdownButton 
                    label="All Categories" 
                    items={categoryItems} 
                    variant="dark" 
                    size="normal"
                    btnClass="h-full !rounded-none hover:!scale-100 active:!scale-100"
                />
                <Button className="h-full !rounded-l-none px-6">
                    Search
                </Button>

                </div>
            <div className='flex flex-row gap-x-[1.5rem]'>
                <IconLabel icon={PersonIcon} label='Profile' size={accessIconSize}/>
                <IconLabel icon={MessageIcon} label='Profile' size={accessIconSize}/>
                <IconLabel icon={HeartIcon} label='Profile' size={accessIconSize}/>
                <IconLabel icon={CartIcon} label='Profile' size={accessIconSize}/>
            </div>
        </section>
        <section className='flex flex-w justify-between py-[1rem] px-[1rem] border-b-[2.5px] border-b-gray-200'>
            <div className='flex flex-row gap-x-[1rem]'>
                <IconLabel className="flex flex-row align-middle " textClassName='text-[0.9rem] font-semibold pl-[0.25rem] text-black' icon={LuAlignJustify} label='All Categories' size={19}/>
                <IconLabel className="flex flex-row align-middle " iconClassName='hidden' textClassName='text-[0.9rem] font-semibold pl-[0.25rem] text-black'  icon={LuAlignJustify} label='Hot Offers' size={19}/>
                <IconLabel className="flex flex-row align-middle " iconClassName='hidden' textClassName='text-[0.9rem] font-semibold pl-[0.25rem] text-black'  icon={LuAlignJustify} label='Gift Offers' size={19}/>
                <IconLabel className="flex flex-row align-middle " iconClassName='hidden' textClassName='text-[0.9rem] font-semibold pl-[0.25rem] text-black'  icon={LuAlignJustify} label='Projects' size={19}/>
                <IconLabel className="flex flex-row align-middle " iconClassName='hidden' textClassName='text-[0.9rem] font-semibold pl-[0.25rem] text-black'  icon={LuAlignJustify} label='Menu Item' size={19}/>
                <IconLabel className="flex flex-row-reverse align-middle justify-center  " iconClassName='' textClassName='text-[0.9rem] font-semibold pl-[0.25rem] text-black'  icon={LuChevronDown} label='Help' size={19}/>
            </div>
            <div className='flex flex-row gap-x-[1rem]'>
                <IconLabel className="flex flex-row-reverse align-middle justify-center gap-x-2" iconClassName='' textClassName='text-[0.9rem] font-semibold pl-[0.25rem] text-black'  icon={LuChevronDown} label='English, USD' size={19}/>
                <IconLabel className="flex flex-row-reverse align-middle justify-center gap-x-2" iconClassName='' textClassName='text-[0.9rem] font-semibold pl-[0.25rem] text-black'  icon={LuChevronDown} 
                    label={
                        <div className="flex items-center gap-1">
                        Ship To
                        <ReactCountryFlag 
                            countryCode="DE" 
                            svg 
                            style={{ width: '1.2em', height: '1.2em' }} 
                            title="Germany" 
                        />
                        </div>
                    } size={19}/>

            </div>
        </section>
    </header>
  )
}

export default Header
