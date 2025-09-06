import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

export interface LocationSuggestion {
  id: string;
  name: string;
  fullName: string;
  country: string;
  type: 'city' | 'country' | 'landmark' | 'region';
  flag?: string;
}

export const useLocationAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce the query to avoid excessive API calls
  const [debouncedQuery] = useDebounce(query, 400);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get your API key from environment variables
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!API_KEY) {
        // Fallback to static suggestions when API key is not available
        const staticSuggestions = getStaticSuggestions(searchQuery);
        setSuggestions(staticSuggestions);
        setIsLoading(false);
        return;
      }

      const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

      const prompt = `You are a travel location expert. Given the user input "${searchQuery}", provide up to 8 relevant travel destinations including cities, countries, landmarks, and popular tourist attractions.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "unique-id",
    "name": "Location Name",
    "fullName": "Full Location Name with Context",
    "country": "Country Name",
    "type": "city|country|landmark|region",
    "flag": "🇺🇸"
  }
]

Examples:
- For "par": [{"id":"paris-france","name":"Paris","fullName":"Paris, France","country":"France","type":"city","flag":"🇫🇷"}]
- For "tok": [{"id":"tokyo-japan","name":"Tokyo","fullName":"Tokyo, Japan","country":"Japan","type":"city","flag":"🇯🇵"}]

Focus on popular travel destinations that match the input. Include the appropriate country flag emoji.`;

      const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        throw new Error("No response from AI");
      }

      // Clean and parse the JSON response
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      const parsedSuggestions = JSON.parse(cleanedResponse);
      
      setSuggestions(parsedSuggestions || []);
    } catch (err) {
      console.error('Error fetching location suggestions:', err);
      // Fallback to static suggestions on API error
      const staticSuggestions = getStaticSuggestions(searchQuery);
      setSuggestions(staticSuggestions);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback function for static suggestions
  const getStaticSuggestions = (query: string): LocationSuggestion[] => {
    const popularDestinations = [
      { id: 'paris-france', name: 'Paris', fullName: 'Paris, France', country: 'France', type: 'city' as const, flag: '🇫🇷' },
      { id: 'tokyo-japan', name: 'Tokyo', fullName: 'Tokyo, Japan', country: 'Japan', type: 'city' as const, flag: '🇯🇵' },
      { id: 'new-york-usa', name: 'New York', fullName: 'New York, USA', country: 'United States', type: 'city' as const, flag: '🇺🇸' },
      { id: 'london-uk', name: 'London', fullName: 'London, UK', country: 'United Kingdom', type: 'city' as const, flag: '🇬🇧' },
      { id: 'rome-italy', name: 'Rome', fullName: 'Rome, Italy', country: 'Italy', type: 'city' as const, flag: '🇮🇹' },
      { id: 'barcelona-spain', name: 'Barcelona', fullName: 'Barcelona, Spain', country: 'Spain', type: 'city' as const, flag: '🇪🇸' },
      { id: 'amsterdam-netherlands', name: 'Amsterdam', fullName: 'Amsterdam, Netherlands', country: 'Netherlands', type: 'city' as const, flag: '🇳🇱' },
      { id: 'sydney-australia', name: 'Sydney', fullName: 'Sydney, Australia', country: 'Australia', type: 'city' as const, flag: '🇦🇺' },
      { id: 'dubai-uae', name: 'Dubai', fullName: 'Dubai, UAE', country: 'United Arab Emirates', type: 'city' as const, flag: '🇦🇪' },
      { id: 'singapore', name: 'Singapore', fullName: 'Singapore', country: 'Singapore', type: 'city' as const, flag: '🇸🇬' },
      { id: 'bali-indonesia', name: 'Bali', fullName: 'Bali, Indonesia', country: 'Indonesia', type: 'region' as const, flag: '🇮🇩' },
      { id: 'santorini-greece', name: 'Santorini', fullName: 'Santorini, Greece', country: 'Greece', type: 'city' as const, flag: '🇬🇷' },
      { id: 'iceland', name: 'Iceland', fullName: 'Iceland', country: 'Iceland', type: 'country' as const, flag: '🇮🇸' },
      { id: 'thailand', name: 'Thailand', fullName: 'Thailand', country: 'Thailand', type: 'country' as const, flag: '🇹🇭' },
      { id: 'morocco', name: 'Morocco', fullName: 'Morocco', country: 'Morocco', type: 'country' as const, flag: '🇲🇦' },
    ];

    const lowerQuery = query.toLowerCase();
    return popularDestinations.filter(dest => 
      dest.name.toLowerCase().includes(lowerQuery) ||
      dest.country.toLowerCase().includes(lowerQuery) ||
      dest.fullName.toLowerCase().includes(lowerQuery)
    ).slice(0, 8);
  };

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    clearSuggestions: () => setSuggestions([])
  };
};