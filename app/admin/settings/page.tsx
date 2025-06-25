'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getSettings, updateSettings, resetSettings, toggleMaintenanceMode, SettingsType } from '@/lib/actions/settings.actions';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

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
      toast.success('Settings updated successfully!');
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
      await fetchSettings(); // Refresh settings
      toast.success('Settings reset to default values');
    } catch (error) {
      toast.error('Failed to reset settings');
      console.error('Error resetting settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleMaintenanceToggle = async () => {
    if (!settings) return;

    try {
      const newMode = !settings.maintenanceMode;
      await toggleMaintenanceMode(newMode);
      setSettings(prev => prev ? { ...prev, maintenanceMode: newMode } : null);
      toast.success(`Maintenance mode ${newMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to toggle maintenance mode');
      console.error('Error toggling maintenance mode:', error);
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

  // Helper function to safely get numeric values
  const getNumericValue = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = parseFloat(value);
      return !isNaN(parsed) ? parsed : defaultValue;
    }
    return defaultValue;
  };

  // Helper function to safely get string values
  const getStringValue = (value: any, defaultValue: string = ''): string => {
    return typeof value === 'string' ? value : defaultValue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="bg-white rounded-lg shadow">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to load settings</h2>
            <button 
              onClick={fetchSettings}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'contact', name: 'Contact', icon: '📞' },
    { id: 'social', name: 'Social Media', icon: '🌐' },
    { id: 'email', name: 'Email', icon: '📧' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your store configuration and preferences</p>
        </div>

        {/* Maintenance Mode Alert */}
        {settings.maintenanceMode && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-500 mr-3">🚧</div>
                <div>
                  <h3 className="text-red-800 font-medium">Maintenance Mode Active</h3>
                  <p className="text-red-600 text-sm">Your store is currently in maintenance mode</p>
                </div>
              </div>
              <button
                onClick={handleMaintenanceToggle}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Disable
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={getStringValue(settings.siteName, 'My E-commerce Store')}
                      onChange={(e) => updateField('siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={getStringValue(settings.currency, 'USD')}
                      onChange={(e) => updateField('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={getStringValue(settings.siteDescription, 'Your one-stop shop for amazing products')}
                    onChange={(e) => updateField('siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={getStringValue(settings.currencySymbol, '$')}
                      onChange={(e) => updateField('currencySymbol', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Cart Items
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={getNumericValue(settings.maxCartItems, 50)}
                      onChange={(e) => updateField('maxCartItems', parseInt(e.target.value) || 50)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="guestCheckout"
                      checked={Boolean(settings.allowGuestCheckout)}
                      onChange={(e) => updateField('allowGuestCheckout', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="guestCheckout" className="ml-2 text-sm text-gray-700">
                      Allow guest checkout
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
                      <p className="text-sm text-gray-600">Temporarily disable your store for maintenance</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleMaintenanceToggle}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        settings.maintenanceMode
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {settings.maintenanceMode ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Business Tab */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={getNumericValue(settings.taxRate, 8.5)}
                      onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Rate ({getStringValue(settings.currencySymbol, '$')})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={getNumericValue(settings.shippingRate, 5.99)}
                      onChange={(e) => updateField('shippingRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Free Shipping Threshold ({getStringValue(settings.currencySymbol, '$')})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={getNumericValue(settings.freeShippingThreshold, 50)}
                      onChange={(e) => updateField('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Preview</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Tax Rate: {getNumericValue(settings.taxRate, 8.5)}%</p>
                    <p>Shipping: {getStringValue(settings.currencySymbol, '$')}{getNumericValue(settings.shippingRate, 5.99)}</p>
                    <p>Free shipping on orders over: {getStringValue(settings.currencySymbol, '$')}{getNumericValue(settings.freeShippingThreshold, 50)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={getStringValue(settings.contactEmail, 'contact@store.com')}
                      onChange={(e) => updateField('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={getStringValue(settings.contactPhone, '+1-234-567-8900')}
                      onChange={(e) => updateField('contactPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media Links</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={getStringValue(settings.socialMedia?.facebook)}
                      onChange={(e) => updateNestedField('socialMedia', 'facebook', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter/X URL
                    </label>
                    <input
                      type="url"
                      value={getStringValue(settings.socialMedia?.twitter)}
                      onChange={(e) => updateNestedField('socialMedia', 'twitter', e.target.value)}
                      placeholder="https://twitter.com/youraccount or https://x.com/youraccount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={getStringValue(settings.socialMedia?.instagram)}
                      onChange={(e) => updateNestedField('socialMedia', 'instagram', e.target.value)}
                      placeholder="https://instagram.com/youraccount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={getStringValue(settings.socialMedia?.linkedin)}
                      onChange={(e) => updateNestedField('socialMedia', 'linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="orderConfirmation"
                      checked={Boolean(settings.emailSettings?.orderConfirmation)}
                      onChange={(e) => updateNestedField('emailSettings', 'orderConfirmation', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="orderConfirmation" className="ml-2 text-sm text-gray-700">
                      Send order confirmation emails
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shippingUpdates"
                      checked={Boolean(settings.emailSettings?.shippingUpdates)}
                      onChange={(e) => updateNestedField('emailSettings', 'shippingUpdates', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="shippingUpdates" className="ml-2 text-sm text-gray-700">
                      Send shipping update emails
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="promotionalEmails"
                      checked={Boolean(settings.emailSettings?.promotionalEmails)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={(e) => updateNestedField('emailSettings', 'promotionalEmails', e.target.checked)}
                    />
                    <label htmlFor="promotionalEmails" className="ml-2 text-sm text-gray-700">
                      Send promotional emails
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                disabled={saving}
              >
                Reset to Default
              </button>

              <div className="space-x-4">
                <button
                  type="button"
                  onClick={fetchSettings}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;