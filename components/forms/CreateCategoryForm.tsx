'use client';

import { useState } from 'react';
import { createCategory } from '@/lib/actions/category.actions';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const CreateCategoryForm = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCategory(name);
      toast.success('Category created successfully!', {
        style: {
          background: 'white', // Tailwind's blue-600
          color: '#16a34a',
        },
      });
      
      setName('');
      router.refresh(); // ensure page revalidates
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter category name"
        className="flex-1"
        required
      />
      <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-800">
        {loading ? 'Creating...' : 'Add'}
      </Button>
    </form>
  );
};

export default CreateCategoryForm;