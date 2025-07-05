import React from 'react';
import Link from 'next/link';
import { SettingsType } from '@/lib/actions/settings.actions';
import { 
  Mail, 
  Phone, 
  MapPin,
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ShoppingBag,
  Heart,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  Clock,
  Send,
  Star
} from 'lucide-react';

interface ContactSectionProps {
  settings: SettingsType;
}

const Footer: React.FC<ContactSectionProps> = ({ settings }) => {
  const { contactEmail, contactPhone, socialMedia } = settings;

  return (
    <footer id="footer" className="border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8">
        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          
          <div className="text-center group">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Easy Returns</h3>
            <p className="text-sm text-gray-600">30-day return policy</p>
          </div>
          
          <div className="text-center group">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Secure Payment</h3>
            <p className="text-sm text-gray-600">SSL encrypted</p>
          </div>
          
          <div className="text-center group">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">24/7 Support</h3>
            <p className="text-sm text-gray-600">Always here to help</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-gray-800">
                Luxe<span className="text-blue-600">Cart</span>
              </span>
            </div>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm leading-relaxed">
              Your premier destination for luxury shopping. Discover amazing products with unbeatable quality and exceptional service that exceeds expectations.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {socialMedia.facebook && (
                <a 
                  href={socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-blue-600 hover:text-white p-2 sm:p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {socialMedia.twitter && (
                <a 
                  href={socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-blue-400 hover:text-white p-2 sm:p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {socialMedia.instagram && (
                <a 
                  href={socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-pink-500 hover:text-white p-2 sm:p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {socialMedia.linkedin && (
                <a 
                  href={socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-blue-700 hover:text-white p-2 sm:p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">Home</Link></li>
              <li><Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">All Products</Link></li>
              <li><Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">Categories</Link></li>
              <li><Link href="/deals" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">Special Deals</Link></li>
              <li><Link href="/new-arrivals" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">New Arrivals</Link></li>
              <li><Link href="/bestsellers" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Customer Service</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/account" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">My Account</Link></li>
              <li><Link href="/orders" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">Order History</Link></li>
              <li><Link href="/wishlist" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 flex items-center gap-2 text-sm sm:text-base">
                <Heart className="w-4 h-4" /> Wishlist
              </Link></li>
              <li><Link href="/shipping" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block text-sm sm:text-base">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Contact Us</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs sm:text-sm font-medium">Email us</p>
                  <a href={`mailto:${contactEmail}`} className="text-gray-800 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base break-words">
                    {contactEmail}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs sm:text-sm font-medium">Call us</p>
                  <a href={`tel:${contactPhone}`} className="text-gray-800 hover:text-emerald-600 transition-colors font-medium text-sm sm:text-base">
                    {contactPhone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs sm:text-sm font-medium">Visit us</p>
                  <p className="text-gray-800 font-medium text-sm sm:text-base">123 Commerce Street<br />New York, NY 10001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs sm:text-sm font-medium">Business Hours</p>
                  <p className="text-gray-800 font-medium text-sm sm:text-base">Mon-Fri: 9AM-6PM<br />Sat-Sun: 10AM-4PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12 border border-blue-100">
          <div className="text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div className="mb-6 sm:mb-0 sm:flex-1 sm:pr-8">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Stay Updated</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Subscribe to get special offers, free giveaways, and the latest updates delivered to your inbox.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto sm:mx-0 sm:min-w-0 sm:flex-shrink-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm sm:text-base min-w-0"
              />
              <button className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap">
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6">WE ACCEPT</h3>
          <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
            {['VISA', 'MASTERCARD', 'AMEX', 'PAYPAL', 'APPLE PAY'].map((method) => (
              <div key={method} className="bg-white border border-gray-200 hover:border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-xs sm:text-sm font-bold text-gray-700">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Cookie Policy</Link>
              <Link href="/accessibility" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Accessibility</Link>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-600 font-medium text-sm sm:text-base">&copy; 2025 LuxeCart. All rights reserved.</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Made with <span className="text-red-500">❤️</span> for amazing shopping experiences</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;