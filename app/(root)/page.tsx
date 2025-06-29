import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getActiveBillboards } from "@/lib/actions/billboard.actions";
import { getWishlistItems } from "@/lib/actions/wishlist.actions";
import { getSettings } from "@/lib/actions/settings.actions";
import { ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import PublicBillboardDisplay from "@/components/PublicBillboardDisplay";
import { auth } from "@clerk/nextjs/server";
import Footer from "@/components/ContactSection";
import AnimatedBackground from "@/components/AnimatedBackground";

// Ensure this is a Server Component - do not add 'use client' directive

export default async function Products({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);
  const category =
    typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category : "";

  const { userId } = await auth();

  const [products, categories, billboards, wishlistItems, settingsData] = await Promise.all([
    getAllProducts(page, 6, category),
    getAllCategories(),
    getActiveBillboards(),
    userId ? getWishlistItems() : [],
    getSettings(),
  ]);

  // Handle null settings by providing default values
  const settings = settingsData || {
    _id: '',
    taxRate: 8.5,
    shippingRate: 5.99,
    freeShippingThreshold: 50,
    maintenanceMode: false,
    maxCartItems: 50,
    contactEmail: 'contact@store.com',
    contactPhone: '+1-234-567-8900',
    socialMedia: {},
    emailSettings: {
      orderConfirmation: true,
      shippingUpdates: true,
      promotionalEmails: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Create a Set of wishlist product IDs for quick lookup
  const wishlistProductIds = new Set(
    wishlistItems.map(item => item.product._id)
  );

  const hasNextPage = products.length === 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Billboard Section */}
          <div className="px-6 pt-6">
            <PublicBillboardDisplay 
              billboards={billboards} 
              selectedCategoryId={category || undefined}
            />
          </div>

          <div className="p-6">
            {/* Header Section */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Premium Collection</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                Discover Amazing Products
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Explore our curated collection of premium products designed to elevate your lifestyle
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Shop by Category
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/"
                    className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      !category
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    <span className="relative">All Products</span>
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id.toString()}
                      href={`/?category=${cat._id}`}
                      className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        cat._id.toString() === category
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                      <span className="relative">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-white/20">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  No products found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto text-lg">
                  {category
                    ? "There are no products in this category yet. Check back soon for new arrivals!"
                    : "We're curating amazing products for you. Please check back soon."}
                </p>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-center p-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-gray-500" />
                            </div>
                            <span className="text-gray-500 font-medium">
                              Image coming soon
                            </span>
                          </div>
                        </div>
                      )}
                    
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="mb-4 flex justify-between">
                        <div className="flex items-center gap-2">
                           <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {product.name}
                        </h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <WishlistButton
                          productId={product._id}
                          isInWishlist={wishlistProductIds.has(product._id)}
                        />
                        <AddToCartButton productId={product._id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-16 gap-6">
              {page <= 1 ? (
                <span className="flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Previous</span>
                </span>
              ) : (
                <Link
                  href={`/?page=${page - 1}${category ? `&category=${category}` : ""}`}
                  className="group flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  <span className="font-medium">Previous</span>
                </Link>
              )}

              <div className="flex gap-3">
                {page > 1 && (
                  <Link
                    href={`/?page=${page - 1}${category ? `&category=${category}` : ""}`}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-600 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    {page - 1}
                  </Link>
                )}
                <span className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25">
                  {page}
                </span>
                {hasNextPage && (
                  <Link
                    href={`/?page=${page + 1}${category ? `&category=${category}` : ""}`}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-600 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    {page + 1}
                  </Link>
                )}
              </div>

              {!hasNextPage ? (
                <span className="flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200">
                  <span className="font-medium">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </span>
              ) : (
                <Link
                  href={`/?page=${page + 1}${category ? `&category=${category}` : ""}`}
                  className="group flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="font-medium">Next</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-20">
        <Footer settings={settings} />
      </div>
    </div>
  );
}