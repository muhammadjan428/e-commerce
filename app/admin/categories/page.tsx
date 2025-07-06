import { Suspense } from 'react';
import { getAllCategories } from '@/lib/actions/category.actions';
import CreateCategoryForm from '@/components/forms/CreateCategoryForm';
import CategoryCard from '@/components/shared/categoryCard';
import { Sparkles, Star, FolderOpen } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Loading from '@/components/shared/Loading';

// Separate component for the data fetching
async function CategoriesContent() {
  const categories = await getAllCategories();
  
  return (
    <>
      {/* Create Category Form */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Add New Category
            </h2>
          </div>
          <CreateCategoryForm />
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 md:p-16 text-center border border-white/20">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <FolderOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            No categories found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto text-base sm:text-lg px-4">
            Create your first category to start organizing your products beautifully.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                All Categories ({categories.length})
              </h2>
            </div>
            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
          {/* Header Section */}
          <div className="mb-8 sm:mb-10 md:mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Category Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight px-2">
              Manage Categories
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Organize your products with beautiful categories that make shopping effortless
            </p>
          </div>

          {/* Categories Content with Suspense */}
          <Suspense fallback={<Loading message="Loading categories..." />}>
            <CategoriesContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}