import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { RatingStars } from './RatingStars';

interface ProductData {
    name: string;
    discount: number;
    price: number;
    image: string;
    _id: string;
    rating?: number;
}

interface ProductCardProps {
    className?: string;
    imageClassName?: string;
    variant?: 'discount' | 'preview';
    data?: ProductData;
}

const ProductCardMain = ({className, imageClassName, data, variant = 'discount'}: ProductCardProps) => {
  const href = data?._id ? `/products/${data._id}` : '/products';

  return (
    <>
        { variant === 'discount' && ( 
            <Link to={href} className={cn("bg-white border border-gray-200 overflow-hidden flex flex-col gap-4 justify-center items-center min-h-[14rem] w-full bg-white", className)}>
                <img src={data?.image ?? "https://res.cloudinary.com/dngqowfel/image/upload/v1777307065/10_iqpoi9.jpg"} 
                    alt={data?.name ?? "Product_x"} className={cn("h-28 w-28 object-contain", imageClassName)} id={data?._id ?? ""}/>
                <RatingStars rating={data?.rating} />
                <div className='bg-[#FFE3E3] text-[#F14759] rounded-full px-5 font-semibold text-sm py-1'>%{data?.discount ?? "N/A"}</div>
            </Link>
        )}
        {variant === 'preview' && ( 
            <Link to={href} className={cn(
                "relative flex min-h-[8rem] flex-col items-start overflow-hidden bg-white p-4 group hover:shadow-md transition-shadow", 
                className
            )}>
                <div className='relative z-10'>
                    <p className='font-medium text-[15px] text-gray-900 leading-tight'>{data?.name ?? "Product Name"}</p>
                    <p className='font-normal text-[13px] text-gray-500 mt-2'>
                        From<br/>
                        <span className="text-gray-900">USD {data?.price ?? "19"}</span>
                    </p>
                    <RatingStars rating={data?.rating} className="mt-2" />
                </div>
                <img 
                    src={data?.image ?? "https://res.cloudinary.com/dngqowfel/image/upload/v1777307065/10_iqpoi9.jpg"} 
                    alt={data?.name ?? "Product_x"} 
                    className={cn(
                        "absolute bottom-2 right-2 h-[4.5rem] w-[4.5rem] object-contain transition-transform group-hover:scale-105", 
                        imageClassName
                    )} 
                    id={data?._id ?? ""}
                />
            </Link>
        )}
    </>
  )
}

export default ProductCardMain
