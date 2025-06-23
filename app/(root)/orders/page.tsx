'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

interface OrderDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer_email: string;
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId);
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, [sessionId]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const { verifyOrder } = await import('@/lib/actions/order.actions');
      const result = await verifyOrder(sessionId);
      
      if (result.success && result.data) {
        setOrderDetails(result.data);
      } else {
        setError(result.error || 'Failed to load order details');
      }
    } catch (err) {
      setError('Failed to load order details');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your order. Your payment has been processed successfully.
            </p>
            
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Order ID:</span>
                    <span className="ml-2 text-gray-900">{orderDetails.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Amount:</span>
                    <span className="ml-2 text-gray-900">
                      ${(orderDetails.amount / 100).toFixed(2)} {orderDetails.currency.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2 text-green-600 font-medium capitalize">
                      {orderDetails.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{orderDetails.customer_email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Confirmation Email</h3>
                <p className="text-gray-600">
                  You'll receive an order confirmation email with all the details shortly.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Order Processing</h3>
                <p className="text-gray-600">
                  We'll start preparing your order within 24 hours.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Shipping Updates</h3>
                <p className="text-gray-600">
                  You'll get tracking information once your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.location.href = '/account/orders'}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
}