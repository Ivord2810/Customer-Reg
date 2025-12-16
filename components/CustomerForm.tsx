import React, { useState, useCallback } from 'react';
import { Customer } from '../types';
import { Locate, Save, Loader2 } from 'lucide-react';

interface CustomerFormProps {
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSave, onCancel }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Customer>>({
    businessName: '',
    contactName: '',
    phone: '',
    gpsAddress: '',
    averageBags: 0,
  });

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'averageBags' ? parseInt(value) || 0 : value
    }));
  };

  const getLocation = useCallback(() => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      (err) => {
        setError("Unable to retrieve your location. Please ensure GPS is enabled.");
        console.error(err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      setError("Please capture the GPS location before saving.");
      return;
    }
    if (!formData.businessName || !formData.phone) {
      setError("Business Name and Phone are required.");
      return;
    }

    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      businessName: formData.businessName || '',
      contactName: formData.contactName || '',
      phone: formData.phone || '',
      gpsAddress: formData.gpsAddress || '',
      latitude: location.lat,
      longitude: location.lng,
      averageBags: formData.averageBags || 0,
      lastVisit: new Date().toISOString(),
    };

    onSave(newCustomer);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg max-w-lg mx-auto mt-4 transition-colors">
      <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">Add New Customer</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Mama Tessy Water Depot"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Theresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="024 XXX XXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekly Avg. Bags</label>
          <input
            type="number"
            name="averageBags"
            value={formData.averageBags}
            onChange={handleInputChange}
            min="0"
            className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Digital Address (GhanaPostGPS)</label>
          <input
            type="text"
            name="gpsAddress"
            value={formData.gpsAddress}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. GA-123-4567"
          />
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GPS Location (Required)</label>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <button
              type="button"
              onClick={getLocation}
              disabled={isLocating}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLocating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Locate className="w-4 h-4 mr-2" />}
              {location ? 'Update GPS' : 'Capture GPS'}
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {location ? (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">No location captured</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-900 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 font-bold shadow-md transition-transform active:scale-95"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;