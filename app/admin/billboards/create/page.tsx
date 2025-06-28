import { getAllCategories } from '@/lib/actions/category.actions';
import BillboardForm from '@/components/forms/BillboardForm';

export default async function CreateBillboardPage() {
  const categories = await getAllCategories();

  return (
    <div className="p-6">
      <BillboardForm categories={categories} />
    </div>
  );
}