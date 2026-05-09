import { cn } from '../../utils/cn'

interface GiftCardProps {
    text: string,
    className?: string
}

const GiftCard = ({text, className}: GiftCardProps) => {
  return (
    <div className={cn('flex min-h-[5.5rem] w-full items-center rounded-2xl p-4', className)}>
        <p className='w-[70%] text-white text-lg '>
            {text}
        </p>
    </div>
  )
}

export default GiftCard
