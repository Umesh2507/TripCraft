import { useState } from "react";
import { TripFormData } from "@/components/TravelPlannerForm";
import { TripItineraryData } from "@/components/TripItinerary";
import { useItineraries } from "./useItineraries";
import { useAuth } from "./useAuth";

// Helper function to calculate trip duration
const calculateDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `${daysDiff} days`;
};

// Helper function to format budget display
const getBudgetRange = (budget: string): string => {
  const budgetMap: Record<string, string> = {
    budget: "$500-1000",
    moderate: "$1000-3000", 
    luxury: "$3000-5000",
    premium: "$5000+"
  };
  return budgetMap[budget] || "Custom Budget";
};

// Helper function to format travelers display
const formatTravelers = (travelers: string): string => {
  const travelerMap: Record<string, string> = {
    "1": "Solo Traveler",
    "2": "2 People",
    "3-4": "3-4 People",
    "5+": "5+ People"
  };
  return travelerMap[travelers] || travelers;
};

export const useTravelPlanner = () => {
  const { user } = useAuth();
  const { saveItinerary } = useItineraries();
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<TripItineraryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const generateItinerary = async (formData: TripFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get your API key from the environment variables (your secret notepad!)
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      
      // Check if API key exists
      if (!API_KEY) {
        throw new Error("API key not found. Please add VITE_GEMINI_API_KEY to your .env.local file.");
      }

      // For Google Gemini API - replace with your actual API endpoint
      // Using Gemini 2.5 Flash model
      const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

      // Create a detailed prompt for the AI
      const prompt = `Create a detailed travel itinerary for ${formData.destination} from ${formData.startDate} to ${formData.endDate} for ${formatTravelers(formData.travelers)} with a ${formData.budget} budget.

Interests: ${formData.interests.join(', ')}

Please provide a comprehensive travel plan in JSON format with the following structure:
{
  "overview": "Brief description of the trip",
  "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4", "highlight 5"],
  "days": [
    {
      "day": 1,
      "date": "formatted date",
      "title": "Day title",
      "activities": [
        {
          "time": "9:00 AM",
          "title": "Activity name",
          "description": "Activity description",
          "location": "Location name",
          "duration": "2 hours",
          "cost": "$20-30",
          "rating": 4.5,
          "category": "Culture & History"
        }
      ],
      "estimatedCost": "$150-200",
      "transportation": "Walking/Metro"
    }
  ],
  "tips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"]
}`;

      // Make the API call
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
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get itinerary from AI service.");
      }

      const data = await response.json();
      
      // Extract the AI's response text
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        throw new Error("No response received from AI service.");
      }

      // Try to parse the JSON response from the AI
      let parsedData;
      try {
        // Remove any markdown formatting if present
        const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
        parsedData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse);
        throw new Error("AI returned invalid format. Please try again.");
      }

      // Transform the AI response into our expected format
      const realItinerary: TripItineraryData = {
        destination: formData.destination,
        duration: calculateDuration(formData.startDate, formData.endDate),
        totalBudget: getBudgetRange(formData.budget),
        travelers: formatTravelers(formData.travelers),
        overview: parsedData.overview || `Discover the magic of ${formData.destination} with this carefully curated adventure.`,
        highlights: parsedData.highlights || [
          `Explore the most iconic landmarks of ${formData.destination}`,
          "Experience authentic local cuisine and cultural traditions",
          "Discover hidden gems off the beaten path",
          "Perfect balance of adventure and relaxation",
          "Expert local recommendations for unique experiences"
        ],
        days: parsedData.days || [],
        tips: parsedData.tips || [
          "Book accommodations in advance for better rates",
          "Learn basic local phrases to enhance your experience",
          "Pack comfortable walking shoes for city exploration",
          "Keep digital copies of important documents",
          "Try local street food for authentic flavors"
        ]
      };

      setItinerary(realItinerary);
      
      // Auto-save the itinerary to database if user is authenticated
      if (user) {
        try {
          await saveItinerary({
            title: `${formData.destination} Adventure`,
            destination: formData.destination,
            duration_days: parseInt(calculateDuration(formData.startDate, formData.endDate).split(' ')[0]),
            luxury_level: (formData.budget === 'budget' || formData.budget === 'moderate' || formData.budget === 'luxury' || formData.budget === 'premium') 
              ? formData.budget as 'budget' | 'moderate' | 'luxury' | 'premium' 
              : 'moderate',
            comfort_level: 'standard', // Default comfort level
            is_public: true, // Make it public so other users can view it
            itinerary_data: realItinerary,
          });
          console.log('Itinerary auto-saved successfully');
        } catch (saveError) {
          console.error('Failed to auto-save itinerary:', saveError);
          // Don't show error to user, just log it
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate itinerary. Please try again.";
      setError(errorMessage);
      console.error("Error generating itinerary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPlanner = () => {
    setItinerary(null);
    setError(null);
    setShowSaveDialog(false);
  };

  const saveCurrentItinerary = async (options: {
    title: string;
    isPublic: boolean;
    luxuryLevel: 'budget' | 'moderate' | 'luxury' | 'premium';
    comfortLevel: 'backpacker' | 'standard' | 'comfort' | 'luxury';
  }) => {
    if (!itinerary) return;

    try {
      await saveItinerary({
        title: options.title,
        destination: itinerary.destination,
        duration_days: parseInt(itinerary.duration.split(' ')[0]),
        luxury_level: options.luxuryLevel,
        comfort_level: options.comfortLevel,
        is_public: options.isPublic,
        itinerary_data: itinerary,
      });
      setShowSaveDialog(false);
      return true;
    } catch (error) {
      console.error('Failed to save itinerary:', error);
      return false;
    }
  };

  return {
    isLoading,
    itinerary,
    error,
    showSaveDialog,
    generateItinerary,
    resetPlanner,
    saveCurrentItinerary,
    setShowSaveDialog,
  };
};