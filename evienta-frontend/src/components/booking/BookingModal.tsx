import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, CreditCard, Check } from 'lucide-react';
import { Venue, ServiceProvider, Booking } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { processPayment } from '../../services/stripe';
import LoadingSpinner from '../common/LoadingSpinner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue?: Venue;
  provider?: ServiceProvider;
  onBookingComplete: (booking: Booking) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  venue,
  provider,
  onBookingComplete
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    event_date: '',
    event_time: '',
    event_type: 'Wedding',
    guests_count: 50,
    notes: '',
    hours: 4
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  if (!isOpen) return null;

  const item = venue || provider;
  if (!item) return null;

  const calculateTotal = () => {
    if (venue) {
      return venue.price_per_hour * bookingData.hours;
    }
    if (provider && provider.pricing_packages.length > 0) {
      return provider.pricing_packages[0].price * bookingData.guests_count;
    }
    return 0;
  };

  const platformFee = calculateTotal() * 0.1;
  const totalAmount = calculateTotal() + platformFee;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentResult = await processPayment('demo_payment_method', totalAmount);
      
      const newBooking: Booking = {
        id: Date.now().toString(),
        user_id: user?.id || '',
        venue_id: venue?.id,
        provider_id: provider?.id,
        event_date: bookingData.event_date,
        event_time: bookingData.event_time,
        event_type: bookingData.event_type,
        guests_count: bookingData.guests_count,
        total_amount: totalAmount,
        status: 'confirmed',
        payment_status: 'paid',
        notes: bookingData.notes,
        created_at: new Date().toISOString()
      };

      onBookingComplete(newBooking);
      setStep('confirmation');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDetails = () => (
    <form onSubmit={handleDetailsSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              required
              value={bookingData.event_date}
              onChange={(e) => setBookingData({ ...bookingData, event_date: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="time"
              required
              value={bookingData.event_time}
              onChange={(e) => setBookingData({ ...bookingData, event_time: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <select
            value={bookingData.event_type}
            onChange={(e) => setBookingData({ ...bookingData, event_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Wedding">Wedding</option>
            <option value="Corporate">Corporate Event</option>
            <option value="Birthday">Birthday Party</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Conference">Conference</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="number"
              min="1"
              required
              value={bookingData.guests_count}
              onChange={(e) => setBookingData({ ...bookingData, guests_count: parseInt(e.target.value) })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {venue && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (Hours)
          </label>
          <input
            type="number"
            min="1"
            max="24"
            required
            value={bookingData.hours}
            onChange={(e) => setBookingData({ ...bookingData, hours: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Notes
        </label>
        <textarea
          rows={3}
          value={bookingData.notes}
          onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
          placeholder="Any special requirements or notes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{venue ? 'Venue Rental' : 'Service'}</span>
            <span>${calculateTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee (10%)</span>
            <span>${platformFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );

  const renderPayment = () => (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Payment Details</h4>
        <p className="text-blue-700 text-sm">
          Total Amount: <span className="font-bold">${totalAmount.toFixed(2)}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            required
            placeholder="1234 5678 9012 3456"
            value={paymentData.cardNumber}
            onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            required
            placeholder="MM/YY"
            value={paymentData.expiryDate}
            onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            required
            placeholder="123"
            value={paymentData.cvv}
            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name on Card
        </label>
        <input
          type="text"
          required
          value={paymentData.nameOnCard}
          onChange={(e) => setPaymentData({ ...paymentData, nameOnCard: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-between space-x-3">
        <button
          type="button"
          onClick={() => setStep('details')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {loading && <LoadingSpinner size="sm" />}
          <span>Complete Payment</span>
        </button>
      </div>
    </form>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Booking Confirmed!
        </h3>
        <p className="text-gray-600">
          Your booking has been successfully confirmed. You will receive a confirmation email shortly.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-left">
        <h4 className="font-semibold text-gray-900 mb-2">Booking Details</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p><strong>Event:</strong> {bookingData.event_type}</p>
          <p><strong>Date:</strong> {new Date(bookingData.event_date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {bookingData.event_time}</p>
          <p><strong>Guests:</strong> {bookingData.guests_count}</p>
          <p><strong>Total:</strong> ${totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Book {venue ? venue.name : provider?.business_name}
              </h2>
              <div className="flex items-center space-x-1 text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{venue?.location || provider?.location}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 'details' && renderDetails()}
          {step === 'payment' && renderPayment()}
          {step === 'confirmation' && renderConfirmation()}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;