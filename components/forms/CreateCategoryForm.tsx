'use client';

import { useState } from 'react';
import { createCategory } from '@/lib/actions/category.actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CreateCategoryForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createCategory(name);
      setName('');
    } catch (err: any) {
      setError(err.message || 'Error creating category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="Enter category name"
        value={name}
        onChange={(e:any) => setName(e.target.value)}
      />
      <Button type="submit">Create Category</Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}