import { PersonIcon } from '../../Icons/Person'
import { Button } from './Button';

const MainUserCard = () => {
    const name = "User";
  return (
    <section className='bg-[#E3F0FF] flex flex-col p-4 gap-4 rounded-2xl'>
      <section className='flex flex-row align-middle items-center gap-2'>
        <div className='rounded-full w-[3rem] h-[3rem] bg-white items-center align-middle flex justify-center shrink-0'>
            <PersonIcon size={27}/>
        </div>
            <p className='text-lg'>Hello, {name}<br />Let's Get Started</p>
      </section>
      <Button className='w-full' size='small'>Join Now</Button>
      <Button className='w-full' size='small' variant='dark'>Log In</Button>
    </section>
  )
}

export default MainUserCard
