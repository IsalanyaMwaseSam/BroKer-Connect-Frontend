import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  brokerId: string;
  brokerName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  property,
  brokerId,
  brokerName
}) => {
  const [formData, setFormData] = useState({
    visitDate: '',
    visitTime: '',
    clientName: '',
    clientPhone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          brokerId,
          propertyId: property.id,
          visitDate: formData.visitDate,
          visitTime: formData.visitTime,
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          message: formData.message
        })
      });

      if (response.ok) {
        alert('Booking request sent successfully!');
        onClose();
        setFormData({
          visitDate: '',
          visitTime: '',
          clientName: '',
          clientPhone: '',
          message: ''
        });
      } else {
        alert('Failed to send booking request');
      }
    } catch (error) {
      alert('Failed to send booking request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            <h3 className="font-medium text-gray-900">Book Property Visit</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Property: {property.title}</p>
            <p className="text-sm text-gray-600">Broker: {brokerName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
              <input
                type="date"
                name="visitDate"
                required
                value={formData.visitDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Time</label>
              <select
                name="visitTime"
                required
                value={formData.visitTime}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              name="clientName"
              required
              value={formData.clientName}
              onChange={handleChange}
              className="input-field"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="clientPhone"
              required
              value={formData.clientPhone}
              onChange={handleChange}
              className="input-field"
              placeholder="+256700000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Any specific requirements or questions..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Book Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;