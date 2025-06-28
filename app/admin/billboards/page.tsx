import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllBillboards } from '@/lib/actions/billboard.actions';
import BillboardList from '@/components/BillboardList';

export default async function BillboardsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const { billboards, pagination } = await getAllBillboards(page, 10);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billboards</h1>
          <p className="text-gray-600 mt-1">
            Manage billboards for different categories
          </p>
        </div>
        <Link
          href="/admin/billboards/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Billboard
        </Link>
      </div>

      <BillboardList billboards={billboards} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          {pagination.hasPrev && (
            <Link
              href={`/admin/billboards?page=${pagination.currentPage - 1}`}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          {pagination.hasNext && (
            <Link
              href={`/admin/billboards?page=${pagination.currentPage + 1}`}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}