import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onReschedule: (bookingId: string, newDate: string, newTime: string, message: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  booking,
  onReschedule
}) => {
  const [formData, setFormData] = useState({
    visitDate: booking?.visit_date || '',
    visitTime: booking?.visit_time || '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReschedule(booking.id, formData.visitDate, formData.visitTime, formData.message);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Reschedule Visit</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Client: {booking.client_name}</p>
            <p className="text-sm text-gray-600">Property: {booking.property_title}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Current Schedule:</p>
            <p className="text-sm text-gray-600">
              {new Date(booking.visit_date).toLocaleDateString()} at {booking.visit_time}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Message to Client</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Explain the reason for rescheduling..."
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
              className="flex-1 btn-primary"
            >
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;