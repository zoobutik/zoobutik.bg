import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  badge?: string;
  badge_color?: string;
  category_id: number;
  description: string;
  features: string[];
  in_stock: boolean;
  stock_quantity?: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  count: string;
  color: string;
  description?: string;
  parent_id?: number;
  sort_order?: number;
  is_visible?: boolean;
  navigation_type?: string;
  external_url?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseOrder {
  id: number;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  newsletter_subscribed: boolean;
  discount_code?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  discount_code?: string;
  subscribed_at: string;
  is_active: boolean;
}

export interface DiscountCode {
  id: number;
  code: string;
  discount_percent: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}