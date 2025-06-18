import { getAllCategories } from '@/lib/actions/category.actions';
import ProductForm from '@/components/forms/ProductForm';

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="p-6">
      <ProductForm categories={categories} />
    </div>
  );
}