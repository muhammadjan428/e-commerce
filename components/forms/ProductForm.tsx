'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { MultipleUploadthing } from '../shared/MultiUploadthing';
import { toast } from 'sonner';

interface Props {
  product?: {
    _id: string;
    name: string;
    price: number;
    category: { _id: string };
    images?: string[];
  };
  categories: { _id: string; name: string }[];
}

export default function ProductForm({ product, categories }: Props) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState(product?.category?._id || '');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    images.forEach((url) => formData.append('images', url));

    startTransition(async () => {
      if (product) {
        await updateProduct(product._id, formData);
        toast.success('Product updated successfully!', {
          style: {
            background: 'white',
            color: '#16a34a',
          },
        });
      } else {
        await createProduct(formData);
        toast.success('Product created successfully!', {
          style: {
            background: 'white',
            color: '#16a34a',
          },
        });
      }
      router.push('/admin/products');
    });
  };

  const handleImageUpload = (urls: string[]) => {
    setImages(urls); // ✅ Set entire array
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4 border"
    >
      <h2 className="text-2xl font-semibold text-center mb-2">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
        <MultipleUploadthing onUpload={handleImageUpload} initialUrls={images} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {isPending ? (product ? 'Updating...' : 'Creating...') : product ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}