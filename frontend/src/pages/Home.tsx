// src/pages/Home.tsx
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

  const safe = (arr: any): Product[] => (Array.isArray(arr) ? arr : []);

  const formatProductsForComponent = (list: Product[] = []): Product[][] => {
    const chunkSize = 3;
    const chunks: Product[][] = [];
    for (let i = 0; i < list.length; i += chunkSize) {
      chunks.push(list.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Baza (dacă store-ul e încă loading, base devine [])
  const base = useMemo(() => safe(products), [products]);

  // Fallback-uri calculate din base (ca să nu fie goale cele 3 secțiuni)
  const latestFallback = useMemo(() => {
    const list = [...base];

    if (list.length && (list[0] as any)?.createdAt) {
      list.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return list.slice(0, 9);
    }

    if (list.length && (list[0] as any)?._id) {
      // Mongo _id sort (aprox newest-first)
      list.sort((a: any, b: any) => String(b._id).localeCompare(String(a._id)));
      return list.slice(0, 9);
    }

    return list.slice(0, 9);
  }, [base]);

  const topRatedFallback = useMemo(() => {
    return [...base]
      .sort((a: any, b: any) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      .slice(0, 9);
  }, [base]);

  const discountFallback = useMemo(() => {
    const discounted = base.filter((p: any) => Number(p.discount) > 0).slice(0, 9);
    return discounted.length > 0 ? discounted : base.slice(0, 9);
  }, [base]);

  // Dacă store-ul îți dă listele, le folosim; dacă nu, folosim fallback
  const latestFinal = safe(latestProducts).length > 0 ? safe(latestProducts) : latestFallback;
  const topRatedFinal = safe(topRatedProducts).length > 0 ? safe(topRatedProducts) : topRatedFallback;
  const discountFinal = safe(discountProducts).length > 0 ? safe(discountProducts) : discountFallback;

  // Pentru FeaturedProducts (grid mare) e util să treacă produse “decent” complete
  const featuredFinal = useMemo(() => {
    const withImage = base.filter((p: any) => Array.isArray(p.images) && p.images[0]);
    return withImage.length > 0 ? withImage : base;
  }, [base]);

  return (
    <div className="w-full">
      <Header />
      <Banner />
      <Categorys />

      <div className="py-[45px]">
        <FeatureProducts products={featuredFinal} />
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
