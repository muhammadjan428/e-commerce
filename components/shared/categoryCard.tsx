'use client';

import { useState } from 'react';
import { deleteCategory, updateCategory } from '@/lib/actions/category.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleUpdate = async () => {
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
      toast.error('Failed to update category', {
        className: 'bg-blue-600 text-white',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(category._id);
        toast.success('Category deleted successfully!', {
          style: {
            background: 'white', // Tailwind's blue-600
            color: '#DC2626',
          },
        });
      router.refresh();
    } catch {
      toast.error('Failed to delete category', {
        className: 'bg-blue-600 text-white',
      });
    }
  };

  return (
    <div className="border rounded-xl px-4 py-3 shadow-sm bg-white">
      {editMode ? (
        <div className="flex flex-col gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={handleUpdate} size="sm">Save</Button>
            <Button variant="outline" onClick={() => setEditMode(false)} size="sm">Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-medium">{category.name}</p>
            <p className="text-sm text-gray-500">/{category.slug}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-800" onClick={() => setEditMode(true)}>Edit</Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-800" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
}