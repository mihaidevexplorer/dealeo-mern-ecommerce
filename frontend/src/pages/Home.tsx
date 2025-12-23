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

  const formatProductsForComponent = (productsList: Product[]): Product[][] => {
    const chunkSize = 3;
    const chunks: Product[][] = [];
    for (let i = 0; i < productsList.length; i += chunkSize) {
      chunks.push(productsList.slice(i, i + chunkSize));
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

      <section className='py-10'>
        <div className='w-full max-w-7xl mx-auto px-4 lg:px-6'>
          <div className='grid grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7'>
            <div className='overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100'>
              <div className='p-4'>
                <Products title='Latest Product' products={formatProductsForComponent(latestProducts)} />
              </div>
            </div>

            <div className='overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100'>
              <div className='p-4'>
                <Products title='Top Rated Product' products={formatProductsForComponent(topRatedProducts)} />
              </div>
            </div>

            <div className='overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100'>
              <div className='p-4'>
                <Products title='Discount Product' products={formatProductsForComponent(discountProducts)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
