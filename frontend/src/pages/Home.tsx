// src/pages/Home.tsx
import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Categorys from "../components/Categorys";
import FeatureProducts from "../components/products/FeatureProducts";
import Products from "../components/products/Products";
import Footer from "../components/Footer";
import { useGetProducts, useGetCategories, useGetBanners } from "../hooks/useHome";
import { useHomeStore } from "../store/useHomeStore";
import type { Product } from "../types";

const Home: React.FC = () => {
  useGetProducts();
  useGetCategories();
  useGetBanners();

  const { products, latestProducts, topRatedProducts, discountProducts } = useHomeStore();

  const formatProductsForComponent = (products: Product[]): Product[][] => {
    const chunkSize = 3;
    const chunks: Product[][] = [];
    for (let i = 0; i < products.length; i += chunkSize) {
      chunks.push(products.slice(i, i + chunkSize));
    }
    return chunks;
  };

  return (
    <div className="w-full">
      <Header />
      <Banner />
      <Categorys />

      <div className="py-[45px] xl:py-10 lg:py-10 md:py-9 sm:py-8 xs:py-7 2xs:py-6">
        <div className="w-full max-w-7xl mx-auto px-6 xl:px-6 lg:px-5 md-lg:px-4 md:px-4 sm:px-3 xs:px-2 2xs:px-2">
          <FeatureProducts products={products} />
        </div>
      </div>

      <div className="py-10 xl:py-9 lg:py-9 md:py-8 sm:py-7 xs:py-6 2xs:py-5">
        <div className="w-full max-w-7xl mx-auto px-6 xl:px-6 lg:px-5 md-lg:px-4 md:px-4 sm:px-3 xs:px-2 2xs:px-2">
          <div className="grid w-full grid-cols-3 lg:grid-cols-2 md-lg:grid-cols-2 md:grid-cols-1 gap-7 lg:gap-6 md:gap-5 sm:gap-4 xs:gap-3">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
              <div className="p-4 sm:p-3 xs:p-3 2xs:p-2">
                <Products title="Latest Product" products={formatProductsForComponent(latestProducts)} />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
              <div className="p-4 sm:p-3 xs:p-3 2xs:p-2">
                <Products title="Top Rated Product" products={formatProductsForComponent(topRatedProducts)} />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 lg:col-span-2 md:col-span-1">
              <div className="p-4 sm:p-3 xs:p-3 2xs:p-2">
                <Products title="Discount Product" products={formatProductsForComponent(discountProducts)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home; // Modificat
