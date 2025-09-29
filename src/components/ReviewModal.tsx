import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSubmit: (reviewData: any) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    brokerRating: 0,
    brokerComment: '',
    propertyRating: 0,
    propertyComment: '',
    propertyTaken: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      bookingId: booking.id,
      brokerId: booking.broker_id,
      propertyId: booking.property_id,
      ...formData
    });
    onClose();
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className={`${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400 transition-colors`}
        >
          <Star size={20} fill={star <= rating ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-3 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Rate Your Experience</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Property: {booking.property_title}</p>
            <p className="text-sm text-gray-600">Broker: {booking.broker_name}</p>
          </div>

          {/* Property Taken */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.propertyTaken}
                onChange={(e) => setFormData(prev => ({ ...prev, propertyTaken: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">I decided to take this property</span>
              </div>
            </label>
          </div>

          {/* Broker Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate the Broker</label>
            <StarRating 
              rating={formData.brokerRating} 
              onRatingChange={(rating) => setFormData(prev => ({ ...prev, brokerRating: rating }))}
            />
            <textarea
              value={formData.brokerComment}
              onChange={(e) => setFormData(prev => ({ ...prev, brokerComment: e.target.value }))}
              placeholder="Share your experience with the broker..."
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg text-sm"
              rows={3}
            />
          </div>

          {/* Property Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate the Property</label>
            <StarRating 
              rating={formData.propertyRating} 
              onRatingChange={(rating) => setFormData(prev => ({ ...prev, propertyRating: rating }))}
            />
            <textarea
              value={formData.propertyComment}
              onChange={(e) => setFormData(prev => ({ ...prev, propertyComment: e.target.value }))}
              placeholder="What did you think of the property?"
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg text-sm"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={formData.brokerRating === 0 || formData.propertyRating === 0}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;