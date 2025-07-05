import Link from 'next/link';
import { Plus, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllBillboards } from '@/lib/actions/billboard.actions';
import BillboardList from '@/components/BillboardList';
import AnimatedBackground from '@/components/AnimatedBackground';

export default async function BillboardsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const { billboards, pagination } = await getAllBillboards(page, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Billboard Management</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Manage Billboards
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create stunning promotional banners that captivate your audience and drive engagement
            </p>
          </div>

          {/* Action Header */}
          <div className="mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      All Billboards ({billboards.length})
                    </h2>
                    <p className="text-gray-600">
                      Showcase your products with eye-catching promotional banners
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/billboards/create"
                  className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  <span className="relative flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Billboard
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Billboard List */}
          <BillboardList billboards={billboards} />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 gap-6">
              {pagination.hasPrev ? (
                <Link
                  href={`/admin/billboards?page=${pagination.currentPage - 1}`}
                  className="group flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  <span className="font-medium">Previous</span>
                </Link>
              ) : (
                <span className="flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Previous</span>
                </span>
              )}

              <div className="flex gap-3">
                {pagination.currentPage > 1 && (
                  <Link
                    href={`/admin/billboards?page=${pagination.currentPage - 1}`}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-600 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    {pagination.currentPage - 1}
                  </Link>
                )}
                <span className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25">
                  {pagination.currentPage}
                </span>
                {pagination.currentPage < pagination.totalPages && (
                  <Link
                    href={`/admin/billboards?page=${pagination.currentPage + 1}`}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-600 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    {pagination.currentPage + 1}
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              </div>

              {pagination.hasNext ? (
                <Link
                  href={`/admin/billboards?page=${pagination.currentPage + 1}`}
                  className="group flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="font-medium">Next</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <span className="flex items-center gap-2 px-6 py-3 rounded-2xl text-gray-400 cursor-not-allowed bg-white/50 backdrop-blur-sm border border-gray-200">
                  <span className="font-medium">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}