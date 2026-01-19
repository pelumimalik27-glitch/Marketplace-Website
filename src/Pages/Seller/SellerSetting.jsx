import React, { useState } from 'react';
import { Save, Upload, Globe, Truck, Shield, Bell, CreditCard, Store, User, Mail, Phone, MapPin } from 'lucide-react';

function SellerSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  // General Settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Sony Store',
    storeDescription: 'Official Sony authorized retailer for gaming consoles and electronics.',
    contactEmail: 'support@sonystore.com',
    contactPhone: '+1 (800) 123-4567',
    storeAddress: '123 Electronics Ave, San Francisco, CA 94107',
    website: 'www.sonystore.com',
    currency: 'USD',
    timezone: 'America/Los_Angeles',
  });
  
  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState({
    processingTime: '1-2 business days',
    domesticShipping: [
      { name: 'Standard', price: 4.99, delivery: '5-7 days' },
      { name: 'Express', price: 12.99, delivery: '2-3 days' },
      { name: 'Free Shipping', price: 0, delivery: '7-10 days', minOrder: 50 },
    ],
    internationalShipping: false,
    returnPolicy: '30 days',
    returnAddress: '456 Returns St, San Francisco, CA 94107',
  });
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newOrder: true,
      orderUpdate: true,
      customerMessage: true,
      reviewReceived: true,
      payoutProcessed: true,
      lowStock: true,
    },
    pushNotifications: {
      newOrder: true,
      customerMessage: true,
      importantUpdates: true,
    },
    smsNotifications: {
      orderShipped: false,
      orderDelivered: false,
      payoutReceived: false,
    },
  });
  
  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '24 hours',
    apiAccess: false,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: <Store size={18} /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard size={18} /> },
  ];

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-gray-600 mt-2">Configure your store preferences and settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Store Name *</label>
                  <input
                    type="text"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email *</label>
                  <input
                    type="email"
                    value={storeSettings.contactEmail}
                    onChange={(e) => setStoreSettings({...storeSettings, contactEmail: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    value={storeSettings.contactPhone}
                    onChange={(e) => setStoreSettings({...storeSettings, contactPhone: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings({...storeSettings, currency: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="JPY">Japanese Yen (¥)</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Store Description</label>
                  <textarea
                    value={storeSettings.storeDescription}
                    onChange={(e) => setStoreSettings({...storeSettings, storeDescription: e.target.value})}
                    rows="4"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Store Address</label>
                  <input
                    type="text"
                    value={storeSettings.storeAddress}
                    onChange={(e) => setStoreSettings({...storeSettings, storeAddress: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <div className="flex">
                    <span className="p-3 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500">https://</span>
                    <input
                      type="text"
                      value={storeSettings.website}
                      onChange={(e) => setStoreSettings({...storeSettings, website: e.target.value})}
                      className="flex-1 p-3 border rounded-r-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select
                    value={storeSettings.timezone}
                    onChange={(e) => setStoreSettings({...storeSettings, timezone: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Store Logo & Banner</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload size={32} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Upload Store Logo</p>
                    <p className="text-sm text-gray-500 mb-4">Recommended: 400x400px, PNG or JPG</p>
                    <button className="text-orange-600 hover:text-orange-700">
                      Choose File
                    </button>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload size={32} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Upload Store Banner</p>
                    <p className="text-sm text-gray-500 mb-4">Recommended: 1200x300px, PNG or JPG</p>
                    <button className="text-orange-600 hover:text-orange-700">
                      Choose File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Processing Time *</label>
                  <select
                    value={shippingSettings.processingTime}
                    onChange={(e) => setShippingSettings({...shippingSettings, processingTime: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="1-2 business days">1-2 business days</option>
                    <option value="2-3 business days">2-3 business days</option>
                    <option value="3-5 business days">3-5 business days</option>
                    <option value="5-7 business days">5-7 business days</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Return Policy</label>
                  <select
                    value={shippingSettings.returnPolicy}
                    onChange={(e) => setShippingSettings({...shippingSettings, returnPolicy: e.target.value})}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="30 days">30 days</option>
                    <option value="14 days">14 days</option>
                    <option value="7 days">7 days</option>
                    <option value="No returns">No returns</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Domestic Shipping Options</h3>
                  <button className="text-orange-600 hover:text-orange-700 text-sm">
                    + Add Option
                  </button>
                </div>
                
                <div className="space-y-4">
                  {shippingSettings.domesticShipping.map((option, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name</label>
                          <input
                            type="text"
                            value={option.name}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Price ($)</label>
                          <input
                            type="number"
                            value={option.price}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Delivery Time</label>
                          <input
                            type="text"
                            value={option.delivery}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Min Order (optional)</label>
                          <input
                            type="number"
                            value={option.minOrder || ''}
                            placeholder="No minimum"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">International Shipping</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="internationalShipping"
                    checked={shippingSettings.internationalShipping}
                    onChange={(e) => setShippingSettings({...shippingSettings, internationalShipping: e.target.checked})}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label htmlFor="internationalShipping" className="text-sm">
                    Enable international shipping
                  </label>
                </div>
                
                {shippingSettings.internationalShipping && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600">
                      International shipping rates will be calculated based on destination and weight.
                      You can configure specific rates in the shipping zones settings.
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Return Address</label>
                <textarea
                  value={shippingSettings.returnAddress}
                  onChange={(e) => setShippingSettings({...shippingSettings, returnAddress: e.target.value})}
                  rows="3"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}
          
          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.emailNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm">
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </label>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: {
                            ...notificationSettings.emailNotifications,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Push Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.pushNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm">
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </label>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: {
                            ...notificationSettings.pushNotifications,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">SMS Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.smsNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm">
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </label>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: {
                            ...notificationSettings.smsNotifications,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Account Security</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Login Alerts</p>
                      <p className="text-sm text-gray-600">Get notified of new logins to your account</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.loginAlerts}
                      onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-gray-600">Automatically log out after period of inactivity</p>
                    </div>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                      className="border rounded px-3 py-1"
                    >
                      <option value="1 hour">1 hour</option>
                      <option value="4 hours">4 hours</option>
                      <option value="24 hours">24 hours</option>
                      <option value="7 days">7 days</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Access</p>
                      <p className="text-sm text-gray-600">Allow third-party applications to access your store data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.apiAccess}
                      onChange={(e) => setSecuritySettings({...securitySettings, apiAccess: e.target.checked})}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Payout Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Payout Schedule</label>
                    <select className="w-full p-3 border rounded-lg">
                      <option>Weekly (Every Monday)</option>
                      <option>Bi-weekly (1st & 15th of month)</option>
                      <option>Monthly (End of month)</option>
                      <option>Manual (On request)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Payout Amount</label>
                    <div className="flex items-center">
                      <span className="p-3 border border-r-0 rounded-l-lg bg-gray-50">$</span>
                      <input
                        type="number"
                        defaultValue="50"
                        className="flex-1 p-3 border rounded-r-lg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Tax Information</label>
                    <input
                      type="text"
                      placeholder="Tax ID or Business Number"
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Connected Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-gray-500">Account ending in ****1234</p>
                      </div>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700">
                      Edit
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded">
                        <CreditCard size={20} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray-500">seller@example.com</p>
                      </div>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700">
                      Edit
                    </button>
                  </div>
                  
                  <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400">
                    + Add New Payment Method
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Store Status */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Store Status</h3>
            <p className="text-gray-600 text-sm mt-1">Temporarily pause your store</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Store is Active</span>
            </div>
            <button className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50">
              Pause Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerSettings;