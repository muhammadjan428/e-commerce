import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

export default async function Products({
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <p className="text-gray-600 mt-1">
          Explore a variety of products and make your purchase today.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Filter by Category
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              !category
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id.toString()}
              href={`/?category=${cat._id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                cat._id.toString() === category
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {category
              ? "There are no products in this category yet."
              : "We're working on adding products. Please check back soon."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-square bg-gray-50">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center p-4">
                      <div className="bg-gray-300 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                      <span className="text-gray-500 text-sm mt-2">
                        No image
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 truncate">
                        {product.name}
                      </h2>
                      <p className="text-xl font-semibold text-gray-900 mt-1">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <Link
                    href="/wishlist"
                    className="text-gray-500 hover:text-red-500 transition"
                    title="Add to Wishlist"
                  >
                    <Heart className="w-6 h-6" />
                  </Link>

                  <Link
                    href={`/checkout?id=${product._id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                  >
                    Add To Cart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 gap-4">
        {page <= 1 ? (
          <span className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </span>
        ) : (
          <Link
            href={`/?page=${page - 1}${category ? `&category=${category}` : ""}`}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </Link>
        )}

        <div className="flex gap-1">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}${category ? `&category=${category}` : ""}`}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {page - 1}
            </Link>
          )}
          <span className="px-3 py-2 bg-blue-600 text-white rounded-lg">
            {page}
          </span>
          {hasNextPage && (
            <Link
              href={`/?page=${page + 1}${category ? `&category=${category}` : ""}`}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {page + 1}
            </Link>
          )}
        </div>

        {!hasNextPage ? (
          <span className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed">
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </span>
        ) : (
          <Link
            href={`/?page=${page + 1}${category ? `&category=${category}` : ""}`}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
}