'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getSettings, updateSettings, resetSettings, SettingsType } from '@/lib/actions/settings.actions';
import { Settings, DollarSign, Phone, Globe, Mail, Package, Sparkles, ShoppingCart, Percent, Truck, Shield } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('business');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load settings');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      await updateSettings(settings);
      toast.success('Settings updated successfully!', {
        style: {
          background: 'white',
          color: '#16a34a',
        },
      });
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default values?')) return;

    try {
      setSaving(true);
      await resetSettings();
      await fetchSettings();
      toast.success('Settings reset to default values');
    } catch (error) {
      toast.error('Failed to reset settings');
      console.error('Error resetting settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SettingsType, value: any) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [field]: value
        }
      };
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <AnimatedBackground />
        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-64 mb-8"></div>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <AnimatedBackground />
        <div className="relative z-10 max-w-6xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Failed to load settings</h2>
            <button 
              onClick={fetchSettings}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'business', name: 'Business', icon: ShoppingCart, gradient: 'from-blue-500 to-purple-600' },
    { id: 'contact', name: 'Contact', icon: Phone, gradient: 'from-green-500 to-teal-600' },
    { id: 'social', name: 'Social Media', icon: Globe, gradient: 'from-pink-500 to-rose-600' },
    { id: 'email', name: 'Email', icon: Mail, gradient: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
              <Settings className="w-4 h-4" />
              <span>Configuration Panel</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Settings
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Manage your store configuration and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-blue-500/25`
                        : 'bg-white/70 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/90'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              {/* Business Tab */}
              {activeTab === 'business' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Settings</h2>
                    <p className="text-gray-600">Configure your store's financial and shipping settings</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Percent className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-lg font-bold text-gray-900">
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
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
                        required
                      />
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-lg font-bold text-gray-900">
                          Shipping Rate
                        </label>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={getNumericValue(settings.shippingRate, 5.99)}
                        onChange={(e) => updateField('shippingRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
                        required
                      />
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-lg font-bold text-gray-900">
                          Free Shipping Threshold
                        </label>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={getNumericValue(settings.freeShippingThreshold, 50)}
                        onChange={(e) => updateField('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
                    <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Preview
                    </h3>
                    <div className="text-blue-800 space-y-2">
                      <p className="font-medium">Tax Rate: {getNumericValue(settings.taxRate, 8.5)}%</p>
                      <p className="font-medium">Shipping: ${getNumericValue(settings.shippingRate, 5.99)}</p>
                      <p className="font-medium">Free shipping on orders over: ${getNumericValue(settings.freeShippingThreshold, 50)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                    <p className="text-gray-600">Set up your store's contact details</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-lg font-bold text-gray-900">
                          Contact Email
                        </label>
                      </div>
                      <input
                        type="email"
                        value={getStringValue(settings.contactEmail, 'contact@store.com')}
                        onChange={(e) => updateField('contactEmail', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
                        required
                      />
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <label className="text-lg font-bold text-gray-900">
                          Contact Phone
                        </label>
                      </div>
                      <input
                        type="tel"
                        value={getStringValue(settings.contactPhone, '+1-234-567-8900')}
                        onChange={(e) => updateField('contactPhone', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === 'social' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media Links</h2>
                    <p className="text-gray-600">Connect your social media accounts</p>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage', gradient: 'from-blue-500 to-indigo-600' },
                      { key: 'twitter', label: 'Twitter/X URL', placeholder: 'https://twitter.com/youraccount', gradient: 'from-sky-500 to-blue-600' },
                      { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/youraccount', gradient: 'from-pink-500 to-rose-600' },
                      { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/yourcompany', gradient: 'from-blue-600 to-cyan-600' },
                    ].map((social) => (
                      <div key={social.key} className="group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 bg-gradient-to-r ${social.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <label className="text-lg font-bold text-gray-900">
                            {social.label}
                          </label>
                        </div>
                        <input
                          type="url"
                          value={getStringValue(settings.socialMedia?.[social.key as keyof typeof settings.socialMedia])}
                          onChange={(e) => updateNestedField('socialMedia', social.key, e.target.value)}
                          placeholder={social.placeholder}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Tab */}
              {activeTab === 'email' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Settings</h2>
                    <p className="text-gray-600">Configure your email preferences</p>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { key: 'orderConfirmation', label: 'Send order confirmation emails', description: 'Automatically send confirmation emails when orders are placed' },
                      { key: 'shippingUpdates', label: 'Send shipping update emails', description: 'Notify customers about shipping status changes' },
                      { key: 'promotionalEmails', label: 'Send promotional emails', description: 'Send marketing and promotional content to customers' },
                    ].map((email) => (
                      <div key={email.key} className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:bg-white transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center h-6">
                            <input
                              type="checkbox"
                              id={email.key}
                              checked={Boolean(settings.emailSettings?.[email.key as keyof typeof settings.emailSettings])}
                              onChange={(e) => updateNestedField('emailSettings', email.key, e.target.checked)}
                              className="h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 transition-all duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <label htmlFor={email.key} className="text-lg font-bold text-gray-900 cursor-pointer">
                              {email.label}
                            </label>
                            <p className="text-gray-600 mt-1">{email.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100 mt-8">
                <button
                  type="button"
                  onClick={handleReset}
                  className="group relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                  disabled={saving}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  <span className="relative">Reset to Default</span>
                </button>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={fetchSettings}
                    className="px-8 py-4 rounded-2xl font-bold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all duration-300 transform hover:scale-105"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                      saving
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                    }`}
                    disabled={saving}
                  >
                    {!saving && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    )}
                    <div className="relative flex items-center gap-3">
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;