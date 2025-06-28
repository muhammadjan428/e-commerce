import { getBillboardById } from '@/lib/actions/billboard.actions';
import { getAllCategories } from '@/lib/actions/category.actions';
import BillboardForm from '@/components/forms/BillboardForm';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBillboardPage({ params }: Props) {
  const resolvedParams = await params;
  const [billboard, categories] = await Promise.all([
    getBillboardById(resolvedParams.id),
    getAllCategories(),
  ]);

  if (!billboard) {
    notFound();
  }

  return (
    <div className="p-6">
      <BillboardForm 
        categories={categories} 
        billboard={billboard} 
        isEdit={true} 
      />
    </div>
  );
}