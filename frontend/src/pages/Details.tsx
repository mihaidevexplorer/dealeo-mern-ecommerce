// src/pages/Details.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import Rating from "../components/Rating";
import { FaHeart } from "react-icons/fa6";
import { FaEye, FaRegHeart, FaExpand } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import { FaFacebookF, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import Reviews from "../components/Reviews";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCardStore";
import { useHomeStore } from "../store/useHomeStore";

import { useProductDetails } from "../hooks/useHome";
import { useAddToCart, useAddToWishlist } from "../hooks/useCard";
import type { Product } from "../types";

const Details = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // Swiper refs
  const thumbnailSwiperRef = useRef<SwiperType | null>(null);
  const relatedProductsSwiperRef = useRef<SwiperType | null>(null);

  // Zustand stores
  const { userInfo } = useAuthStore();
  const { loader } = useCartStore();
  const { product, relatedProducts, moreProducts } = useHomeStore();

  // React Query mutations
  const { mutate: addToCart } = useAddToCart();
  const { mutate: addToWishlist } = useAddToWishlist();

  // Fetch product details
  useProductDetails(slug || "");

  // UI state
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [tab, setTab] = useState<"reviews" | "description">("reviews");
  const [quantity, setQuantity] = useState(1);

  // Thumbs nav state (reactive)
  const [thumbCanPrev, setThumbCanPrev] = useState(false);
  const [thumbCanNext, setThumbCanNext] = useState(false);

  const images = useMemo(() => product?.images || [], [product?.images]);

  // Reset when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [product?._id]);

  // Lock body scroll when modal open (mobile fix)
  useEffect(() => {
    if (!isImageModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isImageModalOpen]);

  // Quantity
  const inc = () => {
    if (product && quantity >= product.stock) toast.error("Out of Stock");
    else setQuantity((q) => q + 1);
  };

  const dec = () => {
    setQuantity((q) => (q > 1 ? q - 1 : q));
  };

  // Cart/Wishlist
  const add_card = () => {
    if (userInfo && product) {
      addToCart({ userId: userInfo.id, quantity, productId: product._id });
    } else {
      navigate("/login");
    }
  };

  const add_wishlist = () => {
    if (userInfo && product) {
      addToWishlist({ userId: userInfo.id, productId: product._id });
    } else {
      navigate("/login");
    }
  };

  const add_wishlist_for_product = (p: Product) => {
    if (userInfo) addToWishlist({ userId: userInfo.id, productId: p._id });
    else navigate("/login");
  };

  // Buy now
  const buynow = () => {
    if (!product) return;

    const basePrice =
      product.discount !== 0
        ? product.price - Math.floor((product.price * product.discount) / 100)
        : product.price;

    const obj = [
      {
        sellerId: product.sellerId,
        shopName: product.shopName,
        price: quantity * (basePrice - Math.floor((basePrice * 5) / 100)),
        products: [{ quantity, productInfo: product }],
      },
    ];

    navigate("/shipping", {
      state: {
        products: obj,
        price: basePrice * quantity,
        shipping_fee: 50,
        items: 1,
      },
    });
  };

  // Image navigation
  const nextImage = () => {
    if (images.length <= 1) return;
    setSelectedImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setSelectedImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  // Modal keyboard support (desktop)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isImageModalOpen) return;
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "Escape") setIsImageModalOpen(false);
  };

  // Update thumb nav state when swiper changes
  const syncThumbNav = (swiper: SwiperType) => {
    setThumbCanPrev(!swiper.isBeginning);
    setThumbCanNext(!swiper.isEnd);
  };

  const handleThumbPrev = () => thumbnailSwiperRef.current?.slidePrev();
  const handleThumbNext = () => thumbnailSwiperRef.current?.slideNext();

  const handleRelatedPrev = () => relatedProductsSwiperRef.current?.slidePrev();
  const handleRelatedNext = () => relatedProductsSwiperRef.current?.slideNext();

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1} className="min-h-screen">
      <Header />

      {/* Banner */}
      <section className='bg-[url("/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className="absolute left-0 top-0 w-full h-full bg-[#242222d0]">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
              <h2 className="text-3xl font-bold">Product Details</h2>
              <div className="flex justify-center items-center gap-2 text-2xl w-full">
                <Link to="/">Home</Link>
                <span className="pt-1">
                  <IoIosArrowForward />
                </span>
                <span>Product Details</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section>
        <div className="bg-slate-100 py-5 mb-5">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex flex-wrap gap-2 items-center text-md text-slate-600 w-full">
