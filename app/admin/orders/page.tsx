'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllPayments, clearCartAfterPayment } from '@/lib/actions/stripe.actions';
import { PaymentData } from '@/cart/cartt';

export default function OrdersPage() {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(payments.length / pageSize);
  const paginatedPayments = payments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const loadPayments = async () => {
    const result = await getAllPayments();
    setPayments(result);
    setLoading(false);
  };

  useEffect(() => {
    // Check if we're returning from a successful checkout
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setShowSuccess(true);
      // Clear cart after successful payment
      clearCartAfterPayment();
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }

    loadPayments();
  }, [searchParams]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-blue-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  Payment successful! Thank you for your order.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">🧾 My Orders</h1>
          <button
            onClick={() =>
              startTransition(() => {
                setLoading(true);
                loadPayments();
              })
            }
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-md transition"
          >
            {isPending ? 'Refreshing...' : '🔄 Refresh Orders'}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading orders...</p>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-8">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <a
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                Start Shopping
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-300 bg-white mb-6">
              <table className="min-w-full text-sm table-auto border-collapse">
                <thead className="bg-indigo-600 text-white uppercase text-xs">
                  <tr className="border-b border-gray-300 [&>th]:border-r [&>th]:border-gray-300 [&>th]:last:border-r-0">
                    <th className="px-6 py-4 text-left">#</th>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Amount</th>
                    <th className="px-6 py-4 text-left">Location</th>
                    <th className="px-6 py-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment, index) => (
                    <tr
                      key={payment.id}
                      className={`[&>td]:border-r [&>td]:border-gray-200 [&>td]:last:border-r-0 ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-indigo-50 transition border-b border-gray-200 last:border-b-0`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-800">{payment.name}</td>
                      <td className="px-6 py-4 text-gray-700">{payment.email}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{payment.location}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(payment.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ⬅ Previous
                </button>

                <span className="text-sm font-medium text-gray-700">
                  Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next ➡
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}