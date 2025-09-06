import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  duration_days: number;
  luxury_level: 'budget' | 'moderate' | 'luxury' | 'premium';
  comfort_level: 'backpacker' | 'standard' | 'comfort' | 'luxury';
  is_public: boolean;
  itinerary_data: any; // JSON data from the AI-generated itinerary
  created_at: string;
  updated_at: string;
}

export interface ItineraryRating {
  id: string;
  itinerary_id: string;
  user_id: string;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface ItinerarySummary {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  duration_days: number;
  luxury_level: 'budget' | 'moderate' | 'luxury' | 'premium';
  comfort_level: 'backpacker' | 'standard' | 'comfort' | 'luxury';
  is_public: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_avatar?: string;
  average_rating: number;
  total_ratings: number;
}