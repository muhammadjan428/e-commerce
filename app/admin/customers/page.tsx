import { getAllCustomers } from '@/lib/actions/customer.actions';
import { checkIsAdmin } from '@/lib/actions/users.actions';
import { redirect } from 'next/navigation';
import CustomersTable from '@/components/CustomerTable';

export default async function AdminCustomersPage() {
  // Check if user is admin
  const isAdmin = await checkIsAdmin();
  
  if (!isAdmin) {
    redirect('/');
  }

  // Get all customers
  const customers = await getAllCustomers();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">
          Manage and view customers who have made purchases
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Customer List ({customers.length})
            </h2>
            <div className="text-sm text-gray-500">
              Total Revenue: ${customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toFixed(2)}
            </div>
          </div>
        </div>
        
        <CustomersTable customers={customers} />
      </div>
    </div>
  );
}