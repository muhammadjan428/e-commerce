'use client';

import { useState } from 'react';
import { deleteCategory, updateCategory } from '@/lib/actions/category.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  const handleUpdate = async () => {
    await updateCategory(category._id, name);
    setEditMode(false);
  };

  const handleDelete = async () => {
    await deleteCategory(category._id);
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
            <Button size="sm" onClick={() => setEditMode(true)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
}