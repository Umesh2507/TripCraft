import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, DollarSign, Sparkles } from "lucide-react";
import { LocationAutocomplete } from "./LocationAutocomplete";

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string[];
}

interface TravelPlannerFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading?: boolean;
}

const interestOptions = [
  "Adventure & Outdoors",
  "Culture & History", 
  "Food & Dining",
  "Nightlife & Entertainment",
  "Shopping",
  "Relaxation & Wellness",
  "Photography",
  "Local Experiences"
];

export const TravelPlannerForm = ({ onSubmit, isLoading = false }: TravelPlannerFormProps) => {
  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "",
    interests: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card shadow-elevation border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-display bg-gradient-hero bg-clip-text text-transparent">
          Plan Your Dream Trip
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Tell us about your perfect getaway and we'll create a personalized itinerary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination with Autocomplete */}
          <LocationAutocomplete
            value={formData.destination}
            onChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}
            required
          />

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2 text-base font-medium">
                <Calendar className="w-4 h-4 text-primary" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="h-12 text-base border-2 focus:border-primary transition-smooth"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2 text-base font-medium">
                <Calendar className="w-4 h-4 text-primary" />
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="h-12 text-base border-2 focus:border-primary transition-smooth"
                required
              />
            </div>
          </div>

          {/* Budget and Travelers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2 text-base font-medium">
                <DollarSign className="w-4 h-4 text-primary" />
                Budget Range
              </Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                <SelectTrigger className="h-12 text-base border-2 focus:border-primary">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget-friendly ($0-$1000)</SelectItem>
                  <SelectItem value="moderate">Moderate ($1000-$3000)</SelectItem>
                  <SelectItem value="luxury">Luxury ($3000-$5000)</SelectItem>
                  <SelectItem value="premium">Premium ($5000+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelers" className="flex items-center gap-2 text-base font-medium">
                <Users className="w-4 h-4 text-primary" />
                Number of Travelers
              </Label>
              <Select value={formData.travelers} onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: value }))}>
                <SelectTrigger className="h-12 text-base border-2 focus:border-primary">
                  <SelectValue placeholder="How many people?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Solo traveler</SelectItem>
                  <SelectItem value="2">Couple (2 people)</SelectItem>
                  <SelectItem value="3-4">Small group (3-4 people)</SelectItem>
                  <SelectItem value="5+">Large group (5+ people)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              What interests you? (Select all that apply)
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-smooth text-left ${
                    formData.interests.includes(interest)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            size="xl" 
            className="w-full mt-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="text-2xl animate-pulse">🧠</div>
                AI is crafting your perfect itinerary...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate My Trip Plan
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};