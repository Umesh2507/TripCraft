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
        console.warn("VITE_GEMINI_API_KEY not found. Location autocomplete disabled.");
        setError("Location autocomplete unavailable");
        setSuggestions([]);
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
      setError('Failed to load suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
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