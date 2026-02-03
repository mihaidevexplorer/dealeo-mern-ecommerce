import React, { useMemo, useState } from "react";
import { CalendarDaysIcon, TagIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  slug: string;
  readTime: string;
};

const Blog: React.FC = () => {
  const posts: BlogPost[] = useMemo(
    () => [
      {
        id: "1",
        title: "How to choose the right product for your needs",
        excerpt:
          "A practical guide to comparing features, reading reviews, and making confident shopping decisions.",
        category: "Guides",
        date: "2026-02-03",
        author: "Admin",
        slug: "choose-the-right-product",
        readTime: "5 min",
      },
      {
        id: "2",
        title: "Shipping explained: what to expect",
        excerpt:
          "Learn how delivery works, how to track your order, and what to do if delays occur.",
        category: "Shipping",
        date: "2026-01-27",
        author: "Support Team",
        slug: "shipping-explained",
        readTime: "4 min",
      },
      {
        id: "3",
        title: "Top best-selling products this month",
        excerpt:
          "A look at the most popular products and why customers love them.",
        category: "Trends",
        date: "2026-01-18",
        author: "Admin",
        slug: "top-best-sellers",
        readTime: "6 min",
      },
      {
        id: "4",
        title: "Returns & refunds: simple rules",
        excerpt:
          "Everything you need to know about returns, refunds, and eligibility.",
        category: "Policy",
        date: "2025-12-30",
        author: "Admin",
        slug: "returns-and-refunds",
        readTime: "5 min",
      },
    ],
    []
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category)));
    return ["All", ...unique];
  }, [posts]);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q);

      const matchesCategory =
        activeCategory === "All" ? true : p.category === activeCategory;

      return matchesQuery && matchesCategory;
    });
  }, [posts, query, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-12 md-lg:py-10 sm:py-8">
          <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-700 px-3 py-1 text-xs font-semibold">
            Blog
          </span>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 md-lg:text-3xl sm:text-2xl">
            News, guides & updates
          </h1>
          <p className="mt-4 text-gray-600 text-lg md-lg:text-base sm:text-sm max-w-2xl">
            Helpful articles, shopping tips, and store updates — written to help you make better decisions.
          </p>

          {/* Controls */}
          <div className="mt-8 flex gap-4 md:flex-col md:gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 h-[46px] px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none
                         focus:bg-white focus:border-orange-400 transition"
            />

            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-[260px] md:w-full h-[46px] px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none
                         focus:bg-white focus:border-orange-400 transition cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-12 md-lg:py-10 sm:py-8">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="font-semibold text-gray-900">No articles found</p>
            <p className="text-sm text-gray-600 mt-2">
              Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 md-lg:grid-cols-2 sm:grid-cols-1">
            {filtered.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

/* ---------- Article Card ---------- */

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-5 hover:shadow-md transition">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
          <TagIcon className="w-4 h-4" />
          {post.category}
        </span>
        <span className="text-xs text-gray-500">{post.readTime}</span>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-gray-900 leading-snug">
        {post.title}
      </h2>

      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        {post.excerpt}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <CalendarDaysIcon className="w-4 h-4" />
          <span>{post.date}</span>
          <span className="text-gray-300">•</span>
          <span>{post.author}</span>
        </div>

        <Link
          to={`/blog/${post.slug}`}
          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}

