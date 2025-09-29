import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, Edit } from 'lucide-react';

interface RescheduleResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onResponse: (bookingId: string, action: 'accept' | 'counter', newDate?: string, newTime?: string, message?: string) => void;
}

const RescheduleResponseModal: React.FC<RescheduleResponseModalProps> = ({
  isOpen,
  onClose,
  booking,
  onResponse
}) => {
  const [action, setAction] = useState<'accept' | 'counter'>('accept');
  const [formData, setFormData] = useState({
    visitDate: '',
    visitTime: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'accept') {
      onResponse(booking.id, 'accept');
    } else {
      onResponse(booking.id, 'counter', formData.visitDate, formData.visitTime, formData.message);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Respond to Reschedule</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Property: {booking.property_title}</p>
            <p className="text-sm text-gray-600">Broker: {booking.broker_name}</p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-sm font-medium text-blue-700 mb-1">Proposed New Time:</p>
            <p className="text-sm text-blue-600">
              {new Date(booking.visit_date).toLocaleDateString()} at {formatTime(booking.visit_time)}
            </p>
            {booking.message && (
              <p className="text-sm text-blue-600 mt-2 italic">"{booking.message}"</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="accept"
                  checked={action === 'accept'}
                  onChange={(e) => setAction(e.target.value as 'accept')}
                  className="text-primary-600"
                />
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm font-medium">Accept this time</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="counter"
                  checked={action === 'counter'}
                  onChange={(e) => setAction(e.target.value as 'counter')}
                  className="text-primary-600"
                />
                <div className="flex items-center space-x-2">
                  <Edit size={16} className="text-blue-600" />
                  <span className="text-sm font-medium">Propose different time</span>
                </div>
              </label>
            </div>

            {action === 'counter' && (
              <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={2}
                    className="input-field"
                    placeholder="Explain why you prefer this time..."
                  />
                </div>
              </div>
            )}

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
                {action === 'accept' ? 'Accept Time' : 'Send Counter-Proposal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RescheduleResponseModal;