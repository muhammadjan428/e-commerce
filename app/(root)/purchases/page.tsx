import { auth } from '@clerk/nextjs/server';
import { getUserPurchases, PurchasedProduct } from '@/lib/actions/purchase.actions';
import PurchasesClient from '@/components/PurchaseClient';

export default async function PurchasesPage() {
  const { userId } = await auth();
  
  // If user is not signed in, pass null to client component
  if (!userId) {
    return <PurchasesClient purchases={[]} isSignedIn={false} error={null} />;
  }

  try {
    // Fetch purchases on the server
    const purchases = await getUserPurchases();
    return <PurchasesClient purchases={purchases} isSignedIn={true} error={null} />;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load purchases';
    return <PurchasesClient purchases={[]} isSignedIn={true} error={errorMessage} />;
  }
}