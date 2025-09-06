import { useState } from "react";
import { TravelPlannerForm, type TripFormData } from "@/components/TravelPlannerForm";
import { TripItinerary } from "@/components/TripItinerary";
import { useTravelPlanner } from "@/hooks/useTravelPlanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Sparkles, MapPin, Clock, Users, Star } from "lucide-react";

const Index = () => {
  const { isLoading, itinerary, error, generateItinerary, resetPlanner } = useTravelPlanner();
  const [showForm, setShowForm] = useState(true);

  const handleFormSubmit = async (formData: TripFormData) => {
    setShowForm(false);
    await generateItinerary(formData);
  };

  const handleNewSearch = () => {
    resetPlanner();
    setShowForm(true);
  };

  if (itinerary && !showForm) {
    return (
      <main className="min-h-screen bg-background py-8 px-4">
        <TripItinerary itinerary={itinerary} onNewSearch={handleNewSearch} />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="animate-float">
            <Plane className="w-16 h-16 mx-auto mb-6 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Your Dream Trip
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Powered by AI, crafted with care. Let us create your perfect personalized travel itinerary in minutes.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="px-4 py-2 text-base bg-white/20 text-white border-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Planning
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-base bg-white/20 text-white border-white/30">
              <MapPin className="w-4 h-4 mr-2" />
              Custom Itineraries
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-base bg-white/20 text-white border-white/30">
              <Clock className="w-4 h-4 mr-2" />
              Instant Results
            </Badge>
          </div>

          <Button 
            variant="hero" 
            size="xl" 
            className="animate-pulse-travel"
            onClick={() => {
              const formSection = document.getElementById('trip-form');
              formSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Start Planning Now
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-card">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-4">
            Why Choose Our AI Travel Planner?
          </h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
            Experience the future of travel planning with our intelligent system
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-background shadow-card border border-border hover:border-primary/50 transition-smooth">
              <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI-Powered Intelligence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced AI analyzes millions of travel data points to create the perfect itinerary tailored to your preferences and budget.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-background shadow-card border border-border hover:border-primary/50 transition-smooth">
              <div className="w-16 h-16 bg-gradient-sunset rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Personalized Experience</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every itinerary is unique to you. Tell us your interests, budget, and travel style for a completely customized experience.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-background shadow-card border border-border hover:border-primary/50 transition-smooth">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Expert Recommendations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get insider tips, hidden gems, and local favorites that you won't find in typical guidebooks. Travel like a local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trip Planning Form Section */}
      <section id="trip-form" className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Let's Plan Your Adventure
            </h2>
            <p className="text-xl text-muted-foreground">
              Fill out the form below and let our AI create your perfect itinerary
            </p>
          </div>
          
          {showForm ? (
            <TravelPlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl animate-pulse mb-8">🧠</div>
              <h3 className="text-2xl font-semibold mb-4">AI is crafting your perfect itinerary...</h3>
              <p className="text-muted-foreground text-lg">
                Analyzing destinations, activities, and local insights to create your personalized travel plan.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
              <p className="text-destructive font-medium">{error}</p>
              <Button variant="outline" onClick={handleNewSearch} className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Index;
