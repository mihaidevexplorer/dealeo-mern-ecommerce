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
  // Dacă sunt hooks React Query / Zustand + query, e OK să fie chemate aici.
  // Dacă sunt simple fetch-uri (side-effects), mută-le în useEffect.
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

  // IMPORTANT: filtrăm înainte de chunking ca să nu producem slide-uri goale
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

      <div className="py-[45px]">
        <FeatureProducts products={(products || []).filter(isValidProduct)} />
      </div>

      {/* Secțiunea de jos apare doar dacă există măcar ceva valid */}
      {hasAnyBottomSection && (
        <section className="py-10">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7">
              <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-4">
                  <Products title="Latest Product" products={latestChunks} />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-4">
                  <Products title="Top Rated Product" products={topRatedChunks} />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-4">
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
