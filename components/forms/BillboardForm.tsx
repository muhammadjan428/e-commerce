'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MultipleUploadthing } from '../shared/MultiUploadthing';
import { createBillboard, updateBillboard } from '@/lib/actions/billboard.actions';
import type { BillboardFormData } from '@/lib/validations/billboard.validation';

interface Category {
  _id: string;
  name: string;
}

interface Billboard {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
}

interface Props {
  categories: Category[];
  billboard?: Billboard;
  isEdit?: boolean;
}

export default function BillboardForm({ categories, billboard, isEdit = false }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<BillboardFormData>({
    title: billboard?.title || '',
    description: billboard?.description || '',
    imageUrl: billboard?.imageUrl || '',
    category: billboard?.category || '',
    isActive: billboard?.isActive ?? true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, imageUrl: urls[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.imageUrl) {
      setError('Please upload an image');
      return;
    }

    startTransition(async () => {
      try {
        let result;
        
        if (isEdit && billboard) {
          result = await updateBillboard(billboard._id, formData);
        } else {
          result = await createBillboard(formData);
        }

        if (result.success) {
          router.push('/admin/billboards');
          router.refresh();
        } else {
          setError(result.error || 'Something went wrong');
        }
      } catch (error) {
        setError('An unexpected error occurred');
        console.error('Form submission error:', error);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Billboard' : 'Create New Billboard'}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter billboard title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter billboard description (optional)"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billboard Image *
            </label>
            <MultipleUploadthing
              onUpload={handleImageUpload}
              initialUrls={formData.imageUrl ? [formData.imageUrl] : []}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active (billboard will be displayed on the website)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Saving...' : isEdit ? 'Update Billboard' : 'Create Billboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}