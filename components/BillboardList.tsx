'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { deleteBillboard, toggleBillboardStatus } from '@/lib/actions/billboard.actions';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Billboard {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
}

interface Props {
  billboards: Billboard[];
}

export default function BillboardList({ billboards }: Props) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string>('');

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this billboard?')) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        const result = await deleteBillboard(id);
        if (!result.success) {
          alert(result.error || 'Failed to delete billboard');
        }
      } catch (error) {
        alert('An error occurred while deleting the billboard');
      } finally {
        setDeletingId('');
      }
    });
  };

  const handleToggleStatus = async (id: string) => {
    startTransition(async () => {
      try {
        const result = await toggleBillboardStatus(id);
        if (!result.success) {
          alert(result.error || 'Failed to update billboard status');
        }
      } catch (error) {
        alert('An error occurred while updating the billboard');
      }
    });
  };

  if (billboards.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No billboards found</h3>
        <p className="text-gray-600 mb-6">Create your first billboard to get started.</p>
        <Link
          href="/admin/billboards/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Billboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Billboard
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {billboards.map((billboard) => (
              <tr key={billboard._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={billboard.imageUrl}
                        alt={billboard.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {billboard.title}
                      </h3>
                      {billboard.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {billboard.description.length > 50
                            ? `${billboard.description.substring(0, 50)}...`
                            : billboard.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {billboard.category.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(billboard._id)}
                    disabled={isPending}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      billboard.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {billboard.isActive ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(billboard.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/admin/billboards/${billboard._id}/edit`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(billboard._id)}
                      disabled={isPending || deletingId === billboard._id}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}