//src/pages/Home.tsx
import React, { useMemo } from "react";
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

  const safeArr = (arr: any): Product[] => (Array.isArray(arr) ? arr : []);

  const formatProductsForComponent = (list: Product[]): Product[][] => {
    const chunkSize = 3;
    const chunks: Product[][] = [];
    for (let i = 0; i < list.length; i += chunkSize) {
      chunks.push(list.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const base = useMemo(() => safeArr(products), [products]);

  // Fallback-uri din products (dacă cele din store sunt goale)
  const latestFallback = useMemo(() => base.slice(0, 9), [base]);

  const topRatedFallback = useMemo(() => {
    return [...base]
      .sort((a: any, b: any) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      .slice(0, 9);
  }, [base]);

  const discountFallback = useMemo(() => {
    const discounted = base.filter((p: any) => Number(p.discount) > 0);
    return (discounted.length ? discounted : base).slice(0, 9);
  }, [base]);

  const latestFinal =
    safeArr(latestProducts).length > 0 ? safeArr(latestProducts) : latestFallback;

  const topRatedFinal =
    safeArr(topRatedProducts).length > 0 ? safeArr(topRatedProducts) : topRatedFallback;

  const discountFinal =
    safeArr(discountProducts).length > 0 ? safeArr(discountProducts) : discountFallback;

  return (
    <div className="w-full">
      <Header />
      <Banner />
      <Categorys />

      <div className="py-[45px]">
        <FeatureProducts products={base} />
      </div>

      <div className="py-10">
        <div className="w-[85%] flex flex-wrap mx-auto">
          <div className="grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7">
            <div className="overflow-hidden">
              <Products title="Latest Product" products={formatProductsForComponent(latestFinal)} />
            </div>

            <div className="overflow-hidden">
              <Products title="Top Rated Product" products={formatProductsForComponent(topRatedFinal)} />
            </div>

            <div className="overflow-hidden">
              <Products title="Discount Product" products={formatProductsForComponent(discountFinal)} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
