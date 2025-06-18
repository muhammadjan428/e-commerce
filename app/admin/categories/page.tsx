import { getAllCategories } from '@/lib/actions/category.actions';
import CreateCategoryForm from '@/components/forms/CreateCategoryForm';
import CategoryCard from '@/components/shared/categoryCard';

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <CreateCategoryForm />

      <div className="mt-6 grid gap-3">
        {categories.map((cat) => (
          <CategoryCard key={cat._id} category={cat} />
        ))}
      </div>
    </div>
  );
}
