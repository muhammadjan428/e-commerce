import { getAllCategories } from '@/lib/actions/category.actions';
import ProductForm from '@/components/forms/ProductForm';
import { getProductById } from '@/lib/actions/product.actions';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  const categories = await getAllCategories();

  return (
    <div className="p-6">
      <ProductForm product={product} categories={categories} />
    </div>
  );
}