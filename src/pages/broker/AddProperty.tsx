import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MapPin, DollarSign, Home, Image } from 'lucide-react';

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'house',
    price: '',
    currency: 'UGX',
    district: '',
    area: '',
    address: '',
    size: '',
    rooms: '',
    bathrooms: '',
    amenities: [] as string[],
    images: [] as File[]
  });
  const [loading, setLoading] = useState(false);

  const [areas, setAreas] = useState<string[]>([]);
  const { ugandaDistricts, getAreasByDistrict } = require('../../data/ugandaLocations');

  useEffect(() => {
    if (formData.district) {
      setAreas(getAreasByDistrict(formData.district));
    }
  }, [formData.district]);
  const amenityOptions = ['Parking', 'Garden', 'Security', 'Water', 'Electricity', 'Internet', 'Swimming Pool', 'Gym'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { apiService } = await import('../../services/api');
      await apiService.createProperty({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        price: parseFloat(formData.price),
        currency: formData.currency as any,
        location: {
          district: formData.district,
          area: formData.area,
          address: formData.address,
          coordinates: { lat: 0, lng: 0 }
        },
        features: {
          size: parseFloat(formData.size),
          rooms: formData.rooms ? parseInt(formData.rooms) : undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          amenities: formData.amenities
        },
        images: [],
        videos: [],
        status: 'available',
        brokerId: '',
        isVerified: false,
        views: 0
      });
      
      navigate('/broker/properties');
    } catch (error: any) {
      console.error('Failed to create property:', error);
      
      let errorMessage = 'Failed to create property. Please try again.';
      if (error.message.includes('Database schema error')) {
        errorMessage = 'System is being updated. Please try again in a few minutes.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files!)]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Modern 3-Bedroom House in Kololo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  <option value="house">House for Sale</option>
                  <option value="rental">Rental Property</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial Property</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size (sqm)</label>
                <input
                  name="size"
                  type="number"
                  required
                  value={formData.size}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="200"
                />
              </div>

              {formData.category !== 'land' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input
                      name="rooms"
                      type="number"
                      value={formData.rooms}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input
                      name="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="2"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Describe the property features, location benefits, and unique selling points..."
                />
              </div>
            </div>
          </div>

          {/* Location & Price */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Location & Pricing
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select name="district" value={formData.district} onChange={handleChange} className="input-field" required>
                  <option value="">Select District</option>
                  {ugandaDistricts.map((district: string) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area/Location</label>
                <select name="area" value={formData.area || ''} onChange={handleChange} className="input-field" required>
                  <option value="">Select Area</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Address</label>
                <input
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Plot 123, Street Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  name="price"
                  type="number"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="450000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select name="currency" value={formData.currency} onChange={handleChange} className="input-field">
                  <option value="UGX">UGX (Ugandan Shilling)</option>
                  <option value="USD">USD (US Dollar)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenityOptions.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2" />
              Property Images
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload property images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="btn-secondary cursor-pointer">
                Choose Images
              </label>
            </div>
            
            {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">{formData.images.length} images selected</p>
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">{file.name.substring(0, 10)}...</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;