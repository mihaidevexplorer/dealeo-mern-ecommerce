//src/pages/Home.tsx
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

  const isValidProduct = (p: Product | any): p is Product => {
    return (
      !!p &&
      typeof p.slug === "string" &&
      p.slug.length > 0 &&
      Array.isArray(p.images) &&
      typeof p.images[0] === "string" &&
      p.images[0].length > 0 &&
      typeof p.name === "string" &&
      p.name.length > 0 &&
      typeof p.price === "number"
    );
  };

  const chunk = (list: Product[], chunkSize = 3): Product[][] => {
    const chunks: Product[][] = [];
    for (let i = 0; i < list.length; i += chunkSize) {
      chunks.push(list.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const latestChunks = useMemo(() => chunk((latestProducts || []).filter(isValidProduct), 3), [latestProducts]);
  const topRatedChunks = useMemo(() => chunk((topRatedProducts || []).filter(isValidProduct), 3), [topRatedProducts]);
  const discountChunks = useMemo(() => chunk((discountProducts || []).filter(isValidProduct), 3), [discountProducts]);

  const hasAnyBottomSection =
    latestChunks.some((g) => g.length > 0) ||
    topRatedChunks.some((g) => g.length > 0) ||
    discountChunks.some((g) => g.length > 0);

  return (
    <div className="w-full">
      <Header />
      <Banner />
      <Categorys />

      <div className="py-[45px] lg:py-10 md:py-9 sm:py-8 xs:py-7 2xs:py-6">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-4 sm:px-3 xs:px-2">
          <FeatureProducts products={(products || []).filter(isValidProduct)} />
        </div>
      </div>

      {hasAnyBottomSection && (
        <section className="py-10 lg:py-9 md:py-8 sm:py-7 xs:py-6 2xs:py-5">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-4 sm:px-3 xs:px-2">
            <div className="grid grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7 lg:gap-6 md:gap-5 sm:gap-4 xs:gap-3">
              <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-4 sm:p-3 xs:p-3 2xs:p-2">
                  <Products title="Latest Product" products={latestChunks} />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-4 sm:p-3 xs:p-3 2xs:p-2">
                  <Products title="Top Rated Product" products={topRatedChunks} />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 md-lg:col-span-2 md:col-span-1">
                <div className="p-4 sm:p-3 xs:p-3 2xs:p-2">
                  <Products title="Discount Product" products={discountChunks} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Home;
