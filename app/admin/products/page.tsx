import Link from 'next/link';
import { getAllProducts } from '@/lib/actions/product.actions';
import { getAllCategories } from '@/lib/actions/category.actions';

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; category?: string }> 
}) {
  // Await searchParams before using its properties
  const params = await searchParams;
  const page = Number(params.page || 1);
  const category = params.category;

  const products = await getAllProducts(page, 6, category);
  const categories = await getAllCategories();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Create Product
        </Link>
      </div>

      <div className="mb-4 flex gap-4 overflow-x-auto">
        <Link href="/admin/products" className={!category ? 'font-bold underline' : ''}>
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/admin/products?category=${cat._id}`}
            className={cat._id === category ? 'font-bold underline' : ''}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>${product.price}</p>
            <p className="text-sm text-gray-500">{product.category?.name || 'No Category'}</p>
            <div className="mt-2 flex gap-2">
              <Link href={`/admin/products/${product._id}/edit`} className="text-blue-600 hover:underline">
                Edit
              </Link>
              <form action={`/api/products/${product._id}/delete`} method="POST">
                <button type="submit" className="text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <Link
          href={`/admin/products?page=${page - 1}${category ? `&category=${category}` : ''}`}
          className={page <= 1 ? 'pointer-events-none text-gray-400' : ''}
        >
          Prev
        </Link>
        <Link href={`/admin/products?page=${page + 1}${category ? `&category=${category}` : ''}`}>
          Next
        </Link>
      </div>
    </div>
  );
}