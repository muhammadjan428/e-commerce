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
  Clock
} from 'lucide-react';

interface ContactSectionProps {
  settings: SettingsType;
}

const Footer: React.FC<ContactSectionProps> = ({ settings }) => {
  const { contactEmail, contactPhone, socialMedia } = settings;

  return (
    <footer id="footer" className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        {/* Features Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">Free Shipping</h3>
            <p className="text-sm text-gray-400">On orders over $50</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">Easy Returns</h3>
            <p className="text-sm text-gray-400">30-day return policy</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">Secure Payment</h3>
            <p className="text-sm text-gray-400">SSL encrypted</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-1">24/7 Support</h3>
            <p className="text-sm text-gray-400">Always here to help</p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Luxe<span className="text-blue-400">Cart</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Your premier destination for luxury shopping. Discover amazing products with unbeatable quality and service.
            </p>
            <div className="flex gap-4">
              {socialMedia.facebook && (
                <a 
                  href={socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socialMedia.twitter && (
                <a 
                  href={socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialMedia.instagram && (
                <a 
                  href={socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-pink-500 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialMedia.linkedin && (
                <a 
                  href={socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/deals" className="text-gray-400 hover:text-white transition-colors">Special Deals</Link></li>
              <li><Link href="/new-arrivals" className="text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/bestsellers" className="text-gray-400 hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="text-gray-400 hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="text-gray-400 hover:text-white transition-colors">Order History</Link></li>
              <li><Link href="/wishlist" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                <Heart className="w-3 h-3" /> Wishlist
              </Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Email us</p>
                  <a href={`mailto:${contactEmail}`} className="text-white hover:text-blue-400 transition-colors">
                    {contactEmail}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Call us</p>
                  <a href={`tel:${contactPhone}`} className="text-white hover:text-green-400 transition-colors">
                    {contactPhone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Visit us</p>
                  <p className="text-white">123 Commerce Street<br />New York, NY 10001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Business Hours</p>
                  <p className="text-white">Mon-Fri: 9AM-6PM<br />Sat-Sun: 10AM-4PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-1">Stay Updated</h3>
              <p className="text-gray-400 text-sm">Subscribe to get special offers, free giveaways, and updates.</p>
            </div>
            <div className="flex gap-2 max-w-sm mx-auto md:mx-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center mb-8">
          <h3 className="text-sm font-semibold mb-3 text-gray-400">WE ACCEPT</h3>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <div className="bg-gray-800 px-3 py-2 rounded flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium">VISA</span>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium">MASTERCARD</span>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium">AMEX</span>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium">PAYPAL</span>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium">APPLE PAY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
            <div className="text-center md:text-right">
              <p>&copy; 2025 LuxeCart. All rights reserved.</p>
              <p className="text-xs mt-1">Made with ❤️ for amazing shopping experiences</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;