export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'provider' | 'admin';
  phone?: string;
  avatar?: string;
  created_at: string;
  loyalty_points?: number;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  price_per_hour: number;
  amenities: string[];
  images: string[];
  rating: number;
  reviews_count: number;
  provider_id: string;
  provider: ServiceProvider;
  availability: boolean;
  created_at: string;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  description: string;
  services: string[];
  portfolio_images: string[];
  pricing_packages: PricingPackage[];
  rating: number;
  reviews_count: number;
  verified: boolean;
  location: string;
  phone: string;
  email: string;
  availability_calendar: AvailabilitySlot[];
  created_at: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface AvailabilitySlot {
  date: string;
  available: boolean;
  slots: string[];
}

export interface Booking {
  id: string;
  user_id: string;
  provider_id?: string;
  venue_id?: string;
  event_date: string;
  event_time: string;
  event_type: string;
  guests_count: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  provider_id?: string;
  venue_id?: string;
  booking_id: string;
  rating: number;
  comment: string;
  response?: string;
  created_at: string;
  user: Pick<User, 'name' | 'avatar'>;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface SearchFilters {
  location?: string;
  category?: string;
  priceRange?: [number, number];
  date?: string;
  capacity?: number;
  rating?: number;
  amenities?: string[];
}