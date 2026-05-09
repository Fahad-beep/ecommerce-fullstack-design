import ProductCardMain from '../UI/ProductCardMain'
import { useProduct } from '../../hooks/useProducts'
import { DealTimer } from '../UI/DealTime';

const SaleSection = () => {
    const {products} = useProduct({hasDiscount: true, limit: 5});
  return (
    <section className="flex w-full justify-center px-4 py-4 sm:px-6 lg:px-8">
            <div className='grid w-full max-w-7xl gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 shadow-sm lg:grid-cols-[260px_1fr]'>
            <DealTimer />
            <div className='grid gap-px sm:grid-cols-2 xl:grid-cols-4'>
              {products.map((prod) => (
                  <ProductCardMain data={prod} key={prod._id}/>
              ))
          }
            </div>
            </div>
    </section>
  )
}

export default SaleSection
