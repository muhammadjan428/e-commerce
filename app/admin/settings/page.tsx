'use client';

import { useState, useEffect } from 'react';
import { Settings, DollarSign, Phone, Globe, Mail, Package, Sparkles, ShoppingCart, Percent, Truck, Shield } from 'lucide-react';
import { getSettings, updateSettings, resetSettings } from '@/lib/actions/settings.actions';

// Settings type matching your server actions
interface SettingsType {
  _id?: string;
  taxRate: number;
  shippingRate: number;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  emailSettings: {
    orderConfirmation: boolean;
    shippingUpdates: boolean;
    promotionalEmails: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SettingsType>({
    taxRate: 8.5,
    shippingRate: 5.99,
    freeShippingThreshold: 50,
    contactEmail: 'muhammadjanfullstack@gmail.com',
    contactPhone: '+92-348-096-7184',
    socialMedia: {
      facebook: 'https://www.facebook.com/syedmuhammad.jan.79',
      twitter: 'https://x.com/Muhammad_Jan11',
      instagram: 'https://www.instagram.com/syedmuhammadjan/',
      linkedin: 'https://www.linkedin.com/in/muhammad-jan-b247092a0/'
    },
    emailSettings: {
      orderConfirmation: true,
      shippingUpdates: true,
      promotionalEmails: false
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('business');
  const [error, setError] = useState<string | null>(null);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const currentSettings = await getSettings();
        if (currentSettings) {
          setSettings(currentSettings);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await updateSettings(settings);
      
      if (result.success) {
        alert('Settings saved successfully!');
        // Optionally reload settings to get updated data
        const updatedSettings = await getSettings();
        if (updatedSettings) {
          setSettings(updatedSettings);
        }
      } else {
        setError(result.message || 'Failed to save settings');
        alert(`Error: ${result.message || 'Failed to save settings'}`);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      alert('Error: Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default values?')) return;
    
    setSaving(true);
    setError(null);

    try {
      const result = await resetSettings();
      
      if (result.success) {
        alert('Settings reset to default values');
        // Reload settings after reset
        const updatedSettings = await getSettings();
        if (updatedSettings) {
          setSettings(updatedSettings);
        }
      } else {
        setError(result.message || 'Failed to reset settings');
        alert(`Error: ${result.message || 'Failed to reset settings'}`);
      }
    } catch (err) {
      console.error('Error resetting settings:', err);
      setError('Failed to reset settings');
      alert('Error: Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value
      }
    }));
  };

  const getNumericValue = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = parseFloat(value);
      return !isNaN(parsed) ? parsed : defaultValue;
    }
    return defaultValue;
  };

  const getStringValue = (value: any, defaultValue: string = ''): string => {
    return typeof value === 'string' ? value : defaultValue;
  };

  const tabs = [
    { id: 'business', name: 'Business', icon: ShoppingCart, gradient: 'from-blue-500 to-purple-600' },
    { id: 'contact', name: 'Contact', icon: Phone, gradient: 'from-green-500 to-teal-600' },
    { id: 'social', name: 'Social Media', icon: Globe, gradient: 'from-pink-500 to-rose-600' },
    { id: 'email', name: 'Email', icon: Mail, gradient: 'from-orange-500 to-red-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10">
        {/* Responsive Container - No padding on small screens */}
        <div className="max-w-6xl mx-auto px-0 sm:px-4 lg:px-6">
          {/* Header Section */}
          <div className="px-4 sm:px-0 py-6 sm:py-8 lg:py-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Configuration Panel</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 sm:mb-4">
              Settings
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Manage your store configuration and preferences
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-4 sm:mx-0 mb-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Tabs - Responsive Design */}
          <div className="px-2 sm:px-0 mb-6 sm:mb-8">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative px-3 py-2 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-blue-500/25`
                        : 'bg-white/70 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/90'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline sm:inline">{tab.name}</span>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Container - No margins on small screens */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white/70 backdrop-blur-sm rounded-none sm:rounded-3xl shadow-xl border-0 sm:border border-white/20 overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Business Tab */}
                {activeTab === 'business' && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="text-center mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Business Settings</h2>
                      <p className="text-sm sm:text-base text-gray-600">Configure your store's financial and shipping settings</p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div className="group">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <label className="text-base sm:text-lg font-bold text-gray-900">
                            Tax Rate (%)
                          </label>
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={getNumericValue(settings.taxRate, 8.5)}
                          onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div className="group">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <label className="text-base sm:text-lg font-bold text-gray-900">
                            Shipping Rate
                          </label>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={getNumericValue(settings.shippingRate, 5.99)}
                          onChange={(e) => updateField('shippingRate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div className="group">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <label className="text-base sm:text-lg font-bold text-gray-900">
                            Free Shipping Threshold
                          </label>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={getNumericValue(settings.freeShippingThreshold, 50)}
                          onChange={(e) => updateField('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <h3 className="font-bold text-blue-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                        Preview
                      </h3>
                      <div className="text-blue-800 space-y-2 text-sm sm:text-base">
                        <p className="font-medium">Tax Rate: {getNumericValue(settings.taxRate, 8.5)}%</p>
                        <p className="font-medium">Shipping: ${getNumericValue(settings.shippingRate, 5.99)}</p>
                        <p className="font-medium">Free shipping on orders over: ${getNumericValue(settings.freeShippingThreshold, 50)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="text-center mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                      <p className="text-sm sm:text-base text-gray-600">Set up your store's contact details</p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="group">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <label className="text-base sm:text-lg font-bold text-gray-900">
                            Contact Email
                          </label>
                        </div>
                        <input
                          type="email"
                          value={getStringValue(settings.contactEmail, 'muhammadjanfullstack@gmail.com')}
                          onChange={(e) => updateField('contactEmail', e.target.value)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div className="group">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <label className="text-base sm:text-lg font-bold text-gray-900">
                            Contact Phone
                          </label>
                        </div>
                        <input
                          type="tel"
                          value={getStringValue(settings.contactPhone, '+92-348-096-7184')}
                          onChange={(e) => updateField('contactPhone', e.target.value)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Media Tab */}
                {activeTab === 'social' && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="text-center mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Social Media Links</h2>
                      <p className="text-sm sm:text-base text-gray-600">Connect your social media accounts</p>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      {[
                        { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage', gradient: 'from-blue-500 to-indigo-600' },
                        { key: 'twitter', label: 'Twitter/X URL', placeholder: 'https://twitter.com/youraccount', gradient: 'from-sky-500 to-blue-600' },
                        { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/youraccount', gradient: 'from-pink-500 to-rose-600' },
                        { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/yourcompany', gradient: 'from-blue-600 to-cyan-600' },
                      ].map((social) => (
                        <div key={social.key} className="group">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${social.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <label className="text-base sm:text-lg font-bold text-gray-900">
                              {social.label}
                            </label>
                          </div>
                          <input
                            type="url"
                            value={getStringValue(settings.socialMedia?.[social.key as keyof typeof settings.socialMedia])}
                            onChange={(e) => updateNestedField('socialMedia', social.key, e.target.value)}
                            placeholder={social.placeholder}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white text-sm sm:text-base"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Tab */}
                {activeTab === 'email' && (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="text-center mb-6 sm:mb-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Email Settings</h2>
                      <p className="text-sm sm:text-base text-gray-600">Configure your email preferences</p>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      {[
                        { key: 'orderConfirmation', label: 'Send order confirmation emails', description: 'Automatically send confirmation emails when orders are placed' },
                        { key: 'shippingUpdates', label: 'Send shipping update emails', description: 'Notify customers about shipping status changes' },
                        { key: 'promotionalEmails', label: 'Send promotional emails', description: 'Send marketing and promotional content to customers' },
                      ].map((email) => (
                        <div key={email.key} className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 hover:bg-white transition-all duration-300">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex items-center h-6 pt-1">
                              <input
                                type="checkbox"
                                id={email.key}
                                checked={Boolean(settings.emailSettings?.[email.key as keyof typeof settings.emailSettings])}
                                onChange={(e) => updateNestedField('emailSettings', email.key, e.target.checked)}
                                className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 transition-all duration-300"
                              />
                            </div>
                            <div className="flex-1">
                              <label htmlFor={email.key} className="text-base sm:text-lg font-bold text-gray-900 cursor-pointer block">
                                {email.label}
                              </label>
                              <p className="text-gray-600 mt-1 text-sm sm:text-base">{email.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons - Stack on mobile */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-8 border-t border-gray-100 mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto group relative overflow-hidden px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 text-sm sm:text-base"
                    disabled={saving}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    <span className="relative">Reset to Default</span>
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className={`w-full sm:w-auto group relative overflow-hidden px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
                        saving
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                      }`}
                      disabled={saving}
                    >
                      {!saving && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                      )}
                      <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Save Settings</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;