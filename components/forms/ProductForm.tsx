'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { MultipleUploadthing } from '../shared/MultiUploadthing';
import { toast } from 'sonner';
import { Package, Sparkles, Star, DollarSign, Tag, Image as ImageIcon } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

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
    setImages(urls);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
              <Package className="w-4 h-4" />
              <span>{product ? 'Edit Product' : 'Create New Product'}</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              {product ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {product ? 'Update your product information and settings' : 'Create a new product for your store inventory'}
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Product Name */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-xl font-bold text-gray-900">
                      Product Name
                    </label>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter product name..."
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
                  />
                </div>

                {/* Price */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-xl font-bold text-gray-900">
                      Price
                    </label>
                  </div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
                  />
                </div>

                {/* Category */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-xl font-bold text-gray-900">
                      Category
                    </label>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Images */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon className="w-4 h-4 text-white" />
                    </div>
                    <label className="text-xl font-bold text-gray-900">
                      Product Images
                    </label>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:bg-white transition-all duration-300">
                    <MultipleUploadthing onUpload={handleImageUpload} initialUrls={images} />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isPending}
                    className={`group relative w-full overflow-hidden px-8 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      isPending
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                    }`}
                  >
                    {!isPending && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    )}
                    <div className="relative flex items-center justify-center gap-3">
                      {isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span>{product ? 'Updating...' : 'Creating...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          <span>{product ? 'Update Product' : 'Create Product'}</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}