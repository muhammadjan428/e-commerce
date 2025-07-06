import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllBillboards } from '@/lib/actions/billboard.actions';
import BillboardList from '@/components/BillboardList';
import AnimatedBackground from '@/components/AnimatedBackground';
import Loading from '@/components/shared/Loading';

// Separate component for the billboards content
async function BillboardsContent({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const { billboards, pagination } = await getAllBillboards(page, 10);

  return (
    <>
      {/* Header Section */}
      <div className="mb-8 sm:mb-10 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Billboard Management</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
          Manage Billboards
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
          Create stunning promotional banners that captivate your audience and drive engagement
        </p>
      </div>

      {/* Action Header */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/20">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  All Billboards ({billboards.length})
                </h2>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Showcase your products with eye-catching promotional banners
                </p>
              </div>
            </div>
            <Link
              href="/admin/billboards/create"
              className="group relative overflow-hidden px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              <span className="relative flex items-center justify-center gap-2">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Create Billboard</span>
                <span className="xs:hidden">Create</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Billboard List */}
      <BillboardList billboards={billboards} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-12 sm:mt-16">
          {/* Desktop Pagination */}
          <div className="hidden sm:flex justify-center items-center gap-6">
            {pagination.hasPrev ? (
              <Link
                href={`/admin/billboards?page=${pagination.currentPage - 1}`}
                className="group flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium text-sm md:text-base">Previous</span>
              </Link>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200">
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">Previous</span>
              </span>
            )}

            <div className="flex gap-2 md:gap-3">
              {pagination.currentPage > 1 && (
                <Link
                  href={`/admin/billboards?page=${pagination.currentPage - 1}`}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl text-gray-600 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg text-sm md:text-base"
                >
                  {pagination.currentPage - 1}
                </Link>
              )}
              <span className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25 text-sm md:text-base">
                {pagination.currentPage}
              </span>
              {pagination.currentPage < pagination.totalPages && (
                <Link
                  href={`/admin/billboards?page=${pagination.currentPage + 1}`}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl text-gray-600 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg text-sm md:text-base"
                >
                  {pagination.currentPage + 1}
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl border border-gray-200">
              <span className="text-xs md:text-sm text-gray-600 font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>

            {pagination.hasNext ? (
              <Link
                href={`/admin/billboards?page=${pagination.currentPage + 1}`}
                className="group flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="font-medium text-sm md:text-base">Next</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200">
                <span className="font-medium text-sm md:text-base">Next</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            )}
          </div>

          {/* Mobile Pagination */}
          <div className="sm:hidden flex flex-col gap-4">
            <div className="flex justify-between items-center">
              {pagination.hasPrev ? (
                <Link
                  href={`/admin/billboards?page=${pagination.currentPage - 1}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="font-medium text-sm">Previous</span>
                </Link>
              ) : (
                <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="font-medium text-sm">Previous</span>
                </span>
              )}

              {pagination.hasNext ? (
                <Link
                  href={`/admin/billboards?page=${pagination.currentPage + 1}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-lg"
                >
                  <span className="font-medium text-sm">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200">
                  <span className="font-medium text-sm">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function BillboardsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
          <Suspense fallback={<Loading message="Loading billboards..." />}>
            <BillboardsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}