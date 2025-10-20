import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

// Payment processing utilities
export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  // In a real app, this would call your backend API
  // For demo purposes, we'll simulate the response
  return {
    client_secret: 'pi_demo_client_secret',
    amount,
    currency
  };
};

export const processPayment = async (paymentMethodId: string, amount: number) => {
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success/failure
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    return {
      success: true,
      paymentId: `pay_${Date.now()}`,
      amount
    };
  } else {
    throw new Error('Payment failed. Please try again.');
  }
};