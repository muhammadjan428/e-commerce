import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import DeleteButton from "@/components/shared/DeleteButton";
import { Plus, Edit, ChevronLeft, ChevronRight, Sparkles, Star, Package } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);
  const category =
    typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category : "";

  const [products, categories] = await Promise.all([
    getAllProducts(page, 6, category),
    getAllCategories(),
  ]);

  const hasNextPage = products.length === 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between gap-6 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
                  <Package className="w-4 h-4" />
                  <span>Inventory Management</span>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                  Product Management
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Manage your product inventory and create new items
                </p>
              </div>
              <Link
                href="/admin/products/new"
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Create Product</span>
              </Link>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Filter by Category
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/admin/products"
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
                    key={cat._id}
                    href={`/admin/products?category=${cat._id}`}
                    className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      cat._id === category
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
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No products found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg mb-8">
                {category
                  ? "No products in this category yet. Create your first product to get started!"
                  : "Get started by creating your first product."}
              </p>
              <Link
                href="/admin/products/new"
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 inline-flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Create Product</span>
              </Link>
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
                            No image
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                          {product.name}
                        </h2>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="group/edit flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <Edit className="w-4 h-4 transition-transform group-hover/edit:scale-110" />
                        <span>Edit</span>
                      </Link>
                      <DeleteButton id={product._id} />
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
                href={`/admin/products?page=${page - 1}${
                  category ? `&category=${category}` : ""
                }`}
                className="group flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium">Previous</span>
              </Link>
            )}

            <div className="flex gap-3">
              {page > 1 && (
                <Link
                  href={`/admin/products?page=${page - 1}${
                    category ? `&category=${category}` : ""
                  }`}
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
                  href={`/admin/products?page=${page + 1}${
                    category ? `&category=${category}` : ""
                  }`}
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
                href={`/admin/products?page=${page + 1}${
                  category ? `&category=${category}` : ""
                }`}
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
  );
}