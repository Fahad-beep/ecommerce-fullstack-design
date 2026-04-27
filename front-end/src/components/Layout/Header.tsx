import logo from '../../assets/logo.svg'
import { Button } from '../UI/Button'
import SearchBar from '../UI/SearchBar'
import {HeartIcon} from '../../Icons/Heart'
import {CartIcon} from '../../Icons/Cart'
import {MessageIcon} from '../../Icons/Message'
import {PersonIcon} from '../../Icons/Person'
import IconLabel from '../UI/IconLabel'
import { DropdownButton } from '../UI/DropDown'
function Header() {

    const categoryItems = [
    { label: 'Electronics', onClick: () => console.log('Tech clicked') },
    { label: 'Interior', onClick: () => console.log('Interior clicked') },
    { label: 'Clothing', onClick: () => console.log('Clothes clicked') },
  ];

  return (
    <header className='max-w-screen w-screen'>
        <section className='flex flex-row justify-between px-[8rem] py-[1rem]'>
            <div className='flex-row flex items-center gap-1'>
                <img src={logo} alt='brand-logo' decoding='async'/>
                <p className='text-[#8CB7F5] font-bold text-2xl'>Brand</p>
            </div>
            <div className='flex flex-row'>
                 <SearchBar label='Search'/>
                 <DropdownButton 
                    label="All Categories" 
                    items={categoryItems} 
                    variant="dark" 
                    size="small"
                    className='rounded-none border-none h-[2.5rem] border-[10px] items-center justify-center'
                    btnClass="border-none transition-none hover:scale-1"
                />
                  <Button className='rounded-l-none'>Search</Button>
            </div>
            <div className='flex flex-row gap-x-[1.5rem]'>
                <IconLabel icon={PersonIcon} label='Profile' size={26}/>
                <IconLabel icon={MessageIcon} label='Profile' size={26}/>
                <IconLabel icon={HeartIcon} label='Profile' size={26}/>
                <IconLabel icon={CartIcon} label='Profile' size={26}/>
            </div>
        </section>
        <section>

        </section>
    </header>
  )
}

export default Header
