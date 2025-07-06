'use client';

import { useState } from 'react';
import { deleteCategory, updateCategory } from '@/lib/actions/category.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Edit3, Trash2, Save, X, Folder, Link as LinkIcon } from 'lucide-react';

interface Props {
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

export default function CategoryCard({ category }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(category.name);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    setLoading(true);
    try {
      await updateCategory(category._id, name);
      toast.success('Category updated successfully!', {
        style: {
          background: 'white',
          color: '#2563EB',
        },
      });
      setEditMode(false);
      router.refresh();
    } catch {
      toast.error('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteCategory(category._id);
      toast.success('Category deleted successfully!', {
        style: {
          background: 'white',
          color: '#DC2626',
        },
      });
      router.refresh();
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(category.name);
    setEditMode(false);
  };

  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:scale-[1.02] hover:-translate-y-1">
      {editMode ? (
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Edit Category</h3>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="h-10 sm:h-12 text-base sm:text-lg bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl sm:rounded-2xl px-3 sm:px-4"
              disabled={loading}
            />
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={handleUpdate}
                disabled={loading || !name.trim()}
                className="group relative overflow-hidden flex-1 h-10 sm:h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-green-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <span className="relative flex items-center gap-2 justify-center">
                  {loading ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-sm sm:text-base">Save</span>
                    </>
                  )}
                </span>
              </Button>
              
              <Button
                onClick={handleCancel}
                disabled={loading}
                className="group relative overflow-hidden flex-1 h-10 sm:h-12 bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <span className="relative flex items-center gap-2 justify-center">
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-base">Cancel</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          {/* Category Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
                {category.name}
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                <LinkIcon className="w-3 h-3 flex-shrink-0" />
                <span className="font-mono bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-xs truncate">
                  /{category.slug}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
            <Button
              onClick={() => setEditMode(true)}
              disabled={loading}
              className="group relative overflow-hidden flex-1 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              <span className="relative flex items-center gap-2 justify-center">
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-sm sm:text-base">Edit</span>
              </span>
            </Button>
            
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="group relative overflow-hidden flex-1 h-10 sm:h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-red-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              <span className="relative flex items-center gap-2 justify-center">
                {loading ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-sm sm:text-base">Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">Delete</span>
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}