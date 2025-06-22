'use client';

import { useTransition, useState } from 'react';
import { deleteProduct } from '@/lib/actions/product.actions';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setError(null);
    startTransition(async () => {
      try {
        await deleteProduct(id);
         toast.success('Product deleted successfully!', {
                  style: {
                    background: 'white', // Tailwind's blue-600
                    color: '#DC2626',
                  },
                });
        router.refresh();
      } catch (err) {
        setError('Delete failed. Please try again.');
        console.error('Delete error:', err);
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete product"
        className="p-2 text-red-600 rounded-full hover:bg-red-50 transition-colors"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 text-red-700 text-xs rounded shadow-lg z-10 w-48">
          {error}
        </div>
      )}
    </div>
  );
}