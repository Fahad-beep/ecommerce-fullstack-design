import React from 'react'
import { cn } from '../../utils/cn'

interface GiftCardProps {
    text: string,
    className?: string
}

const GiftCard = ({text, className}: GiftCardProps) => {
  return (
    <div className={cn('rounded-lg h-[7rem] w-full p-2', className)}>
        <p className='w-[70%] text-white text-lg '>
            {text}
        </p>
    </div>
  )
}

export default GiftCard
