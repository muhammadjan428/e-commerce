'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Calendar, 
  MapPin, 
  DollarSign, 
  ShoppingBag,
  AlertCircle,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { PurchasedProduct } from '@/lib/actions/purchase.actions';

interface PurchasesClientProps {
  purchases: PurchasedProduct[];
  isSignedIn: boolean;
  error: string | null;
}

export default function PurchasesClient({ purchases, isSignedIn, error }: PurchasesClientProps) {
  // Function to generate and download receipt
  const downloadReceipt = (purchase: PurchasedProduct) => {
    const receiptContent = `
PURCHASE RECEIPT
================

Order ID: ${purchase.paymentId.slice(-8)}
Date: ${new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}

Customer Information:
Name: ${purchase.userName}
Email: ${purchase.userEmail}

Product Details:
Product: ${purchase.productName}
Price: $${purchase.amount.toFixed(2)}
Location: ${purchase.location}

Payment ID: ${purchase.paymentId}

Thank you for your purchase!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${purchase.paymentId.slice(-8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Show sign-in message if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-xl p-12"
        >
          <AlertCircle className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 text-lg">Please sign in to view your purchases.</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 text-lg">{error}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Purchases
          </h1>
          <p className="text-gray-600 text-xl">Your shopping journey at a glance</p>
        </motion.div>

        {purchases.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-16 text-center border border-gray-100"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No purchases yet</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Start your shopping adventure! Your first purchase will appear here.
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
            </motion.a>
          </motion.div>
        ) : (
          /* Purchases List */
          <div className="space-y-8">
            {purchases.map((purchase, index) => (
              <motion.div
                key={purchase._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                        {purchase.images && purchase.images.length > 0 ? (
                          <img 
                            src={purchase.images[0]} 
                            alt={purchase.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center mb-3">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl mr-4">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{purchase.productName}</h3>
                              <p className="text-sm text-gray-500">Order #{purchase.paymentId.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 rounded-2xl">
                          <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">{purchase.amount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base mb-6">
                        <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                          <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Purchase Date</p>
                            <p className="font-semibold">
                              {new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                          <MapPin className="w-5 h-5 mr-3 text-red-500" />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-semibold">{purchase.location}</p>
                          </div>
                        </div>
                      </div>

                      {/* Purchase Actions */}
                      <div className="pt-6 border-t border-gray-100">
                        <motion.button
                          onClick={() => downloadReceipt(purchase)}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Purchase Summary */}
        {purchases.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Purchase Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <div className="text-4xl font-bold mb-2">{purchases.length}</div>
                <div className="text-blue-100">Total Orders</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <div className="text-4xl font-bold mb-2">
                  ${purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                </div>
                <div className="text-blue-100">Total Spent</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <div className="text-4xl font-bold mb-2">
                  ${(purchases.reduce((sum, p) => sum + p.amount, 0) / purchases.length).toFixed(2)}
                </div>
                <div className="text-blue-100">Average Order</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}