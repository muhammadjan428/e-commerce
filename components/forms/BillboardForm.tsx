'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MultipleUploadthing } from '../shared/MultiUploadthing';
import { createBillboard, updateBillboard } from '@/lib/actions/billboard.actions';
import type { BillboardFormData } from '@/lib/validations/billboard.validation';
import { Sparkles, Star, Save, X, Monitor, Tag, FileText, Image as ImageIcon, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

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
    <div className="min-h-screen">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Billboard {isEdit ? 'Editor' : 'Creator'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 sm:mb-4">
              {isEdit ? 'Edit Billboard' : 'Create New Billboard'}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              {isEdit 
                ? 'Update your billboard to keep your promotional content fresh and engaging'
                : 'Design a stunning billboard that captures attention and drives customer engagement'
              }
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            {error && (
              <div className="p-4 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <p className="text-sm sm:text-base text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
              {/* Form Header */}
              <div className="flex items-center gap-3 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Billboard Details</h2>
                  <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Fill in the information below to create your billboard</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      <Star className="w-4 h-4 text-blue-600" />
                      Billboard Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 sm:h-12 px-3 sm:px-4 text-base sm:text-lg bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                      placeholder="Enter compelling billboard title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 resize-none"
                      placeholder="Add a compelling description (optional)"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      <Tag className="w-4 h-4 text-blue-600" />
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 sm:h-12 px-3 sm:px-4 text-base sm:text-lg bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Active Status */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 sm:ml-3 flex items-center gap-1 sm:gap-2 text-sm font-semibold text-gray-700">
                          {formData.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                          Active Billboard
                        </label>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 ml-6 sm:ml-8">
                      {formData.isActive 
                        ? 'This billboard will be visible to customers on your website'
                        : 'This billboard will be hidden from customers'
                      }
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      Billboard Image *
                    </label>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors duration-300">
                      <MultipleUploadthing
                        onUpload={handleImageUpload}
                        initialUrls={formData.imageUrl ? [formData.imageUrl] : []}
                      />
                      <div className="mt-3 sm:mt-4 text-center">
                        <p className="text-xs sm:text-sm text-gray-600">
                          Upload a high-quality image that represents your billboard
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 1920x1080 or higher resolution
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preview Section */}
                  {formData.imageUrl && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        Preview
                      </h3>
                      <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-md">
                        <img
                          src={formData.imageUrl}
                          alt="Billboard preview"
                          className="w-full h-32 sm:h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-white">
                          <h4 className="text-sm sm:text-lg font-bold truncate">
                            {formData.title || 'Billboard Title'}
                          </h4>
                          {formData.description && (
                            <p className="text-xs sm:text-sm opacity-90 mt-1 line-clamp-2">
                              {formData.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 font-medium order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl sm:rounded-2xl transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex-1 sm:flex-none order-1 sm:order-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">Saving...</span>
                    </>
                  ) : (
                    <>
                      {isEdit ? <Save className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      <span className="text-sm sm:text-base">
                        {isEdit ? 'Update Billboard' : 'Create Billboard'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}