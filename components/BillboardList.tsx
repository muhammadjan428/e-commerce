'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { deleteBillboard, toggleBillboardStatus } from '@/lib/actions/billboard.actions';
import { Edit3, Trash2, Eye, EyeOff, Calendar, Tag, Monitor, Sparkles } from 'lucide-react';

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
  const [togglingId, setTogglingId] = useState<string>('');

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this billboard? This action cannot be undone.')) return;

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
    setTogglingId(id);
    startTransition(async () => {
      try {
        const result = await toggleBillboardStatus(id);
        if (!result.success) {
          alert(result.error || 'Failed to update billboard status');
        }
      } catch (error) {
        alert('An error occurred while updating the billboard');
      } finally {
        setTogglingId('');
      }
    });
  };

  if (billboards.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-white/20">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Monitor className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          No billboards found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto text-lg mb-8">
          Create your first billboard to showcase your products and capture customer attention.
        </p>
        <Link
          href="/admin/billboards/create"
          className="group relative overflow-hidden inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          <span className="relative flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create Your First Billboard
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="grid gap-6 p-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {billboards.map((billboard) => (
            <div
              key={billboard._id}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/40 transform hover:scale-[1.02] hover:-translate-y-2"
            >
              {/* Billboard Image */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <Image
                  src={billboard.imageUrl}
                  alt={billboard.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => handleToggleStatus(billboard._id)}
                    disabled={isPending || togglingId === billboard._id}
                    className={`group/badge relative overflow-hidden px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 ${
                      billboard.isActive
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                        : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg shadow-gray-500/25'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/badge:translate-x-[100%] transition-transform duration-700 ease-out" />
                    <span className="relative flex items-center gap-1">
                      {togglingId === billboard._id ? (
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      ) : billboard.isActive ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {billboard.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Billboard Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                    {billboard.title}
                  </h3>
                  {billboard.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {billboard.description.length > 100
                        ? `${billboard.description.substring(0, 100)}...`
                        : billboard.description}
                    </p>
                  )}
                </div>

                {/* Category and Date */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                    <Tag className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">
                      {billboard.category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                    <Calendar className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {new Date(billboard.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Link
                    href={`/admin/billboards/${billboard._id}/edit`}
                    className="group/btn relative overflow-hidden flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-out" />
                    <span className="relative flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </span>
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(billboard._id)}
                    disabled={isPending || deletingId === billboard._id}
                    className="group/btn relative overflow-hidden flex-1 h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-out" />
                    <span className="relative flex items-center gap-2">
                      {deletingId === billboard._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}