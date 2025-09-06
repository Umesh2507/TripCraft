import { useState, useEffect } from 'react';
import { supabase, type ItinerarySummary, type Itinerary, type ItineraryRating } from '@/lib/supabase';
import { useAuth } from './useAuth';

export const useItineraries = () => {
  const { user } = useAuth();
  const [publicItineraries, setPublicItineraries] = useState<ItinerarySummary[]>([]);
  const [userItineraries, setUserItineraries] = useState<ItinerarySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch public itineraries sorted by rating
  const fetchPublicItineraries = async () => {
    try {
      const { data, error } = await supabase
        .from('itinerary_summary')
        .select('*')
        .eq('is_public', true)
        .order('average_rating', { ascending: false })
        .order('total_ratings', { ascending: false });

      if (error) throw error;
      setPublicItineraries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch public itineraries');
    }
  };

  // Fetch user's own itineraries
  const fetchUserItineraries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('itinerary_summary')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserItineraries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user itineraries');
    }
  };

  // Save a new itinerary
  const saveItinerary = async (itineraryData: {
    title: string;
    destination: string;
    duration_days: number;
    luxury_level: 'budget' | 'moderate' | 'luxury' | 'premium';
    comfort_level: 'backpacker' | 'standard' | 'comfort' | 'luxury';
    is_public: boolean;
    itinerary_data: any;
  }) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      console.log('Attempting to save itinerary:', itineraryData);
      const { data, error } = await supabase
        .from('itineraries')
        .insert({
          ...itineraryData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Itinerary saved successfully:', data);
      // Refresh user itineraries
      await fetchUserItineraries();
      // Also refresh public itineraries since this might be public
      if (itineraryData.is_public) {
        await fetchPublicItineraries();
      }
      
      return data;
    } catch (err) {
      console.error('Save itinerary error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to save itinerary');
    }
  };

  // Get full itinerary details
  const getItinerary = async (id: string): Promise<Itinerary | null> => {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Failed to fetch itinerary:', err);
      return null;
    }
  };

  // Get ratings for an itinerary
  const getItineraryRatings = async (itineraryId: string): Promise<ItineraryRating[]> => {
    try {
      const { data, error } = await supabase
        .from('itinerary_ratings')
        .select(`
          *,
          users:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('itinerary_id', itineraryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch ratings:', err);
      return [];
    }
  };

  // Add or update a rating
  const rateItinerary = async (itineraryId: string, rating: number, review?: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const { data, error } = await supabase
        .from('itinerary_ratings')
        .upsert({
          itinerary_id: itineraryId,
          user_id: user.id,
          rating,
          review,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh public itineraries to update ratings
      await fetchPublicItineraries();
      
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to rate itinerary');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPublicItineraries(),
        fetchUserItineraries(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    publicItineraries,
    userItineraries,
    loading,
    error,
    saveItinerary,
    getItinerary,
    getItineraryRatings,
    rateItinerary,
    refreshPublicItineraries: fetchPublicItineraries,
    refreshUserItineraries: fetchUserItineraries,
  };
};