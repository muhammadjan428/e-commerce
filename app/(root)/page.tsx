import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getActiveBillboards } from "@/lib/actions/billboard.actions";
import { getWishlistItems } from "@/lib/actions/wishlist.actions";
import { getSettings } from "@/lib/actions/settings.actions";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  Search,
  ArrowRight,
  Settings,
} from "lucide-react";
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
    typeof resolvedSearchParams?.category === "string"
      ? resolvedSearchParams.category
      : "";
  const searchQuery =
    typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";

  const { userId } = await auth();

  const [products, categories, billboards, wishlistItems, settingsData] =
    await Promise.all([
      getAllProducts(page, 6, category, searchQuery), // Pass search query to getAllProducts
      getAllCategories(),
      getActiveBillboards(),
      userId ? getWishlistItems() : [],
      getSettings(),
    ]);

  // Handle null settings by providing default values
  const settings = settingsData || {
    _id: "",
    taxRate: 8.5,
    shippingRate: 5.99,
    freeShippingThreshold: 50,
    maintenanceMode: false,
    maxCartItems: 50,
    contactEmail: "muhammadjanfullstack@gmail.com",
    contactPhone: "+92-348-096-7184",
    socialMedia: {
        facebook: 'https://www.facebook.com/syedmuhammad.jan.79',
        twitter: 'https://x.com/Muhammad_Jan11',
        instagram: 'https://www.instagram.com/syedmuhammadjan/',
        linkedin: 'https://www.linkedin.com/in/muhammad-jan-b247092a0/'
      },
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
    wishlistItems.map((item) => item.product._id)
  );

  const hasNextPage = products.length === 6;

  // Helper function to build URL with current filters
  const buildUrl = (newPage?: number, newCategory?: string) => {
    const params = new URLSearchParams();

    if (newPage && newPage > 1) params.set("page", newPage.toString());
    if (newCategory) params.set("category", newCategory);
    if (searchQuery) params.set("q", searchQuery);

    const queryString = params.toString();
    return queryString ? `/?${queryString}` : "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">

           <div className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6">
            <div className="flex justify-end mb-4 sm:mb-6">
              <Link
                href="/admin"
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20"
              >
                <Settings className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
                <span className="font-medium hidden sm:inline">Admin Dashboard</span>
                <span className="font-medium sm:hidden">Admin</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
              </Link>
            </div>
          </div>

          {/* Billboard Section - Hide when searching */}
          {!searchQuery && (
            <div className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6">
              <PublicBillboardDisplay
                billboards={billboards}
                selectedCategoryId={category || undefined}
              />
            </div>
          )}

          {/* Admin Dashboard Button - Top Right after Billboard */}
         

          <div className="px-3 sm:px-4 md:px-6 pb-6">
            {/* Header Section */}
            <div className="mb-8 sm:mb-10 md:mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                {searchQuery ? (
                  <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span>
                  {searchQuery ? "Search Results" : "Premium Collection"}
                </span>
              </div>

              {searchQuery ? (
                <>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
                    Search Results for "{searchQuery}"
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                    Found {products.length} product
                    {products.length !== 1 ? "s" : ""} matching your search
                  </p>
                  {/* Clear search button */}
                  <div className="mt-4">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl text-gray-700 hover:text-blue-600 hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 text-sm font-medium"
                    >
                      Clear Search
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
                    Discover Amazing Products
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                    Explore our curated collection of premium products designed
                    to elevate your lifestyle
                  </p>
                </>
              )}
            </div>

            {/* Category Filter - Only show when not searching */}
            {!searchQuery && (
              <div className="mb-8 sm:mb-10 md:mb-12">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/20">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      Shop by Category
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    <Link
                      href="/"
                      className={`group relative overflow-hidden px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
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
                        className={`group relative overflow-hidden px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
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
            )}

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 md:p-16 text-center border border-white/20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  {searchQuery ? (
                    <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                  ) : (
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {searchQuery ? "No products found" : "No products found"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base md:text-lg">
                  {searchQuery
                    ? `No products match your search for "${searchQuery}". Try a different search term or browse our categories.`
                    : category
                    ? "There are no products in this category yet. Check back soon for new arrivals!"
                    : "We're curating amazing products for you. Please check back soon."}
                </p>
                {searchQuery && (
                  <div className="mt-6">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Browse All Products
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product: any) => (
                  <div
                    key={product._id}
                    className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-2"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-center p-4 sm:p-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-500" />
                            </div>
                            <span className="text-gray-500 font-medium text-sm sm:text-base">
                              Image coming soon
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="mb-3 sm:mb-4">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-2">
                          {product.name}
                        </h2>
                        <div className="flex items-center justify-between">
                          <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-100 gap-2 sm:gap-3">
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
            <div className="flex flex-row justify-center items-center mt-8 sm:mt-12 md:mt-16 gap-2 sm:gap-4 md:gap-6 px-2 sm:px-4">
              {/* Previous Button */}
              <div className="flex items-center">
                {page <= 1 ? (
                  <span className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200 text-xs sm:text-sm md:text-base whitespace-nowrap">
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span className="font-medium hidden xs:inline">
                      Previous
                    </span>
                    <span className="font-medium xs:hidden">Prev</span>
                  </span>
                ) : (
                  <Link
                    href={buildUrl(page - 1, category)}
                    className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base whitespace-nowrap"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium hidden xs:inline">
                      Previous
                    </span>
                    <span className="font-medium xs:hidden">Prev</span>
                  </Link>
                )}
              </div>

              {/* Page Numbers */}
              <div className="flex gap-1 sm:gap-2 md:gap-3">
                {page > 1 && (
                  <Link
                    href={buildUrl(page - 1, category)}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl text-gray-600 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg text-xs sm:text-sm md:text-base"
                  >
                    {page - 1}
                  </Link>
                )}
                <span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25 text-xs sm:text-sm md:text-base">
                  {page}
                </span>
                {hasNextPage && (
                  <Link
                    href={buildUrl(page + 1, category)}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl text-gray-600 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg text-xs sm:text-sm md:text-base"
                  >
                    {page + 1}
                  </Link>
                )}
              </div>

              {/* Next Button */}
              <div className="flex items-center">
                {!hasNextPage ? (
                  <span className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200 text-xs sm:text-sm md:text-base whitespace-nowrap">
                    <span className="font-medium hidden xs:inline">Next</span>
                    <span className="font-medium xs:hidden">Next</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </span>
                ) : (
                  <Link
                    href={buildUrl(page + 1, category)}
                    className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base whitespace-nowrap"
                  >
                    <span className="font-medium hidden xs:inline">Next</span>
                    <span className="font-medium xs:hidden">Next</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-16 sm:mt-20">
        <Footer settings={settings} />
      </div>
    </div>
  );
}