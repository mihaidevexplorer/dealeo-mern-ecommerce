//src/pages/Home.tsx
import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Categorys from '../components/Categorys';
import FeatureProducts from '../components/products/FeatureProducts';
import Products from '../components/products/Products';
import Footer from '../components/Footer';
import { useGetProducts, useGetCategories, useGetBanners } from '../hooks/useHome';
import { useHomeStore } from '../store/useHomeStore';
import type { Product } from '../types';

const Home: React.FC = () => {

    useGetProducts();
    useGetCategories();
    useGetBanners();

    const {
        products,
        latestProducts,
        topRatedProducts,
        discountProducts
    } = useHomeStore();

 
    const formatProductsForComponent = (products: Product[]): Product[][] => {
       
        const chunkSize = 3; // sau alt număr în funcție de design
        const chunks: Product[][] = [];
        for (let i = 0; i < products.length; i += chunkSize) {
            chunks.push(products.slice(i, i + chunkSize));
        }
        return chunks;
    };

    return (
        <div className='w-full'>
            <Header />
            <Banner />
            <Categorys />
            <div className='py-[45px]'>
                <FeatureProducts products={products} />
            </div>
           
            <div className='py-10'>
                <div className='w-[85%] flex flex-wrap mx-auto'>
                    <div className='grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7'>
                        <div className='overflow-hidden'>
                            <Products title='Latest Product' products={formatProductsForComponent(latestProducts)} />
                        </div>
                        
                        <div className='overflow-hidden'>
                            <Products title='Top Rated Product' products={formatProductsForComponent(topRatedProducts)} />
                        </div>

                        <div className='overflow-hidden'>
                            <Products title='Discount Product' products={formatProductsForComponent(discountProducts)} />
                        </div>
                    </div> 
                </div> 
            </div>
            <Footer />
        </div>
    );
};

export default Home;
