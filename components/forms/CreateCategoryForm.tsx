'use client';

import { useState } from 'react';
import { createCategory } from '@/lib/actions/category.actions';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles } from 'lucide-react';

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
          background: 'white',
          color: '#16a34a',
        },
      });
      
      setName('');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name (e.g., Electronics, Clothing, Books)"
            className="h-12 text-lg bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-2xl px-4"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !name.trim()}
          className="group relative overflow-hidden h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          <span className="relative flex items-center gap-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Category
              </>
            )}
          </span>
        </Button>
      </div>
    </form>
  );
};

export default CreateCategoryForm;