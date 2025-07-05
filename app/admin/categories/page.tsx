import { getAllCategories } from '@/lib/actions/category.actions';
import CreateCategoryForm from '@/components/forms/CreateCategoryForm';
import CategoryCard from '@/components/shared/categoryCard';
import { Sparkles, Star, FolderOpen } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Category Management</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Manage Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Organize your products with beautiful categories that make shopping effortless
            </p>
          </div>

          {/* Create Category Form */}
          <div className="mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Category
                </h2>
              </div>
              <CreateCategoryForm />
            </div>
          </div>

          {/* Categories Grid */}
          {categories.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FolderOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No categories found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                Create your first category to start organizing your products beautifully.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    All Categories ({categories.length})
                  </h2>
                </div>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((cat) => (
                    <CategoryCard key={cat._id} category={cat} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}