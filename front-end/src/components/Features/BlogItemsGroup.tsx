import { useProduct } from '../../hooks/useProducts';
import { CategoryBanner } from '../UI/CategoryBanner';
import ProductCardMain from '../UI/ProductCardMain';

interface BlogItemsProps {
    category?: string | string[];
    image?: string;
}

const BlogItemsGroup = ({
    category = "Interior", image = "./HAndOBanner.jpg"
} : BlogItemsProps) => {
    const {products} = useProduct({category: category, limit: 8})
  return (
       <section className="flex w-full justify-center px-4 py-4 sm:px-6 lg:px-8">
               <div className='grid max-w-7xl w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[240px_1fr]'>
                <div className="min-h-[16rem]">
                    <CategoryBanner 
                        buttonText='Source Now' 
                        imageSrc={image} 
                        title='Home And Outdoor'
                        className="h-full w-full rounded-none border-none" 
                    />
                </div>
                <div className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">
                    {products.slice(0, 8).map((prod) => (
                        <ProductCardMain 
                            data={prod} 
                            key={prod._id} 
                            variant='preview' 
                            className="border-none" 
                        />
                    ))}
                </div>

            </div>
        </section>
  )
}

export default BlogItemsGroup
