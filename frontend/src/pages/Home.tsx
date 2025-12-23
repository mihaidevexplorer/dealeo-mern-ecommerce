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

  const isValidProduct = (p: any): p is Product => {
    return (
      !!p &&
      typeof p.slug === "string" &&
      p.slug.length > 0 &&
      Array.isArray(p.images) &&
      typeof p.images?.[0] === "string" &&
      p.images[0].length > 0 &&
      typeof p.name === "string" &&
      p.name.length > 0 &&
      typeof p.price === "number"
    );
  };

  const formatProductsForComponent = (list: Product[] = []): Product[][] => {
    const chunkSize = 3;
    const chunks: Product[][] = [];
    for (let i = 0; i < list.length; i += chunkSize) {
      chunks.push(list.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // fallback-uri calculate din products (dacă store-ul nu le populează)
  const safeProducts = useMemo(() => (Array.isArray(products) ? products.filter(isValidProduct) : []), [products]);

  const latestLocal = useMemo(() => {
    const list = [...safeProducts];

    // dacă ai createdAt în model:
    if (list.length && (list[0] as any).createdAt) {
      list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list.slice(0, 9);
    }

    // fallback: Mongo _id (aproximativ newest-first)
    if (list.length && (list[0] as any)._id) {
      list.sort((a: any, b: any) => String(b._id).localeCompare(String(a._id)));
      return list.slice(0, 9);
    }

    return list.slice(0, 9);
  }, [safeProducts]);

  const topRatedLocal = useMemo(() => {
    const list = safeProducts
      .filter((p: any) => typeof p.rating === "number")
      .sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0));
    return list.slice(0, 9);
  }, [safeProducts]);

  const discountLocal = useMemo(() => {
    const list = safeProducts
      .filter((p: any) => typeof p.discount === "number" && p.discount > 0)
      .sort((a: any, b: any) => (b.discount ?? 0) - (a.discount ?? 0));
    return list.slice(0, 9);
  }, [safeProducts]);

  // Folosim store dacă are date; altfel fallback calculat
  const latestFinal = (Array.isArray(latestProducts) && latestProducts.length > 0 ? latestProducts : latestLocal).filter(isValidProduct);
  const topRatedFinal = (Array.isArray(topRatedProducts) && topRatedProducts.length > 0 ? topRatedProducts : topRatedLocal).filter(isValidProduct);
  const discountFinal = (Array.isArray(discountProducts) && discountProducts.length > 0 ? discountProducts : discountLocal).filter(isValidProduct);

  return (
    <div className="w-full">
      <Header />
      <Banner />
      <Categorys />

      <div className="py-[45px]">
        <FeatureProducts products={safeProducts} />
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
