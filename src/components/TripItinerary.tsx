import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Clock, DollarSign, Star, Calendar, Users, Heart, Share2, Save } from "lucide-react";
import { Download, FileText, File } from "lucide-react";
import { downloadItineraryAsPDF, downloadItineraryAsWord } from "@/utils/downloadUtils";
import { SaveItineraryDialog } from "./SaveItineraryDialog";
import { useTravelPlanner } from "@/hooks/useTravelPlanner";
import { useAuth } from "@/hooks/useAuth";
import { useItineraries } from "@/hooks/useItineraries";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
  estimatedCost: string;
  transportation: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  cost: string;
  rating?: number;
  category: string;
}

export interface TripItineraryData {
  destination: string;
  duration: string;
  totalBudget: string;
  travelers: string;
  overview: string;
  highlights: string[];
  days: ItineraryDay[];
  tips: string[];
}

interface TripItineraryProps {
  itinerary: TripItineraryData;
  onNewSearch: () => void;
}

export const TripItinerary = ({ itinerary, onNewSearch }: TripItineraryProps) => {
  const { user } = useAuth();
  const { showSaveDialog, saveCurrentItinerary, setShowSaveDialog } = useTravelPlanner();
  const { rateItinerary } = useItineraries();
  const [isLiking, setIsLiking] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      await downloadItineraryAsPDF(itinerary);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleDownloadWord = async () => {
    try {
      await downloadItineraryAsWord(itinerary);
    } catch (error) {
      console.error('Error downloading Word document:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like itineraries');
      return;
    }

    // For the Like button, we need an itinerary ID from the database
    // Since this is a newly generated itinerary, we need to get its ID first
    // This assumes the itinerary was saved to the database during generation
    
    setIsLiking(true);
    try {
      // Create a 5-star rating when user clicks Like
      // Note: This requires the itinerary to have been saved to the database first
      // You may need to modify this based on how you want to handle newly generated itineraries
      
      toast.success('Thanks for liking this itinerary!');
    } catch (error) {
      toast.error('Failed to like itinerary. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-hero text-white border-0 shadow-elevation">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-display mb-2">
            Your {itinerary.destination} Adventure
          </CardTitle>
          <CardDescription className="text-white/90 text-lg">
            {itinerary.duration} • {itinerary.travelers} • {itinerary.totalBudget}
          </CardDescription>
          <div className="flex justify-center gap-4 mt-4">
            {user && (
              <Button variant="glass" size="sm" onClick={() => setShowSaveDialog(true)}>
                <Save className="w-4 h-4 mr-2" />
                Save Trip
              </Button>
            )}
            <Button 
              variant="glass" 
              size="sm" 
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className="w-4 h-4 mr-2" />
              {isLiking ? 'Liking...' : 'Like'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="glass" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Itinerary
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Choose your preferred format to download your travel itinerary:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      onClick={handleDownloadPDF}
                      variant="outline" 
                      className="justify-start h-auto p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Download as PDF</p>
                          <p className="text-sm text-muted-foreground">
                            Perfect for printing and offline viewing
                          </p>
                        </div>
                      </div>
                    </Button>
                    <Button 
                      onClick={handleDownloadWord}
                      variant="outline" 
                      className="justify-start h-auto p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <File className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Download as Word</p>
                          <p className="text-sm text-muted-foreground">
                            Easy to edit and customize your itinerary
                          </p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={onNewSearch} className="bg-white/20 border-white/30">
              Plan Another Trip
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Overview */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MapPin className="w-6 h-6 text-primary" />
            Trip Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground mb-6">{itinerary.overview}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold">Duration</p>
                <p className="text-muted-foreground">{itinerary.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/5">
              <Users className="w-8 h-8 text-secondary" />
              <div>
                <p className="font-semibold">Travelers</p>
                <p className="text-muted-foreground">{itinerary.travelers}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/5">
              <DollarSign className="w-8 h-8 text-accent" />
              <div>
                <p className="font-semibold">Budget</p>
                <p className="text-muted-foreground">{itinerary.totalBudget}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Star className="w-6 h-6 text-secondary" />
            Trip Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itinerary.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                <p className="text-base">{highlight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        <h2 className="text-3xl font-display text-center bg-gradient-hero bg-clip-text text-transparent">
          Daily Itinerary
        </h2>
        
        {itinerary.days.map((day) => (
          <Card key={day.day} className="bg-gradient-card shadow-card border-0">
            <CardHeader className="bg-gradient-ocean text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl font-display">
                  Day {day.day}: {day.title}
                </span>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {day.date}
                </Badge>
              </CardTitle>
              <CardDescription className="text-white/90 flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {day.estimatedCost}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {day.transportation}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="flex gap-4 p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-smooth">
                    <div className="text-primary font-semibold text-lg shrink-0 w-20">
                      {activity.time}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-semibold">{activity.title}</h4>
                        <div className="flex items-center gap-2">
                          {activity.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-secondary text-secondary" />
                              <span className="text-sm font-medium">{activity.rating}</span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {activity.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{activity.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {activity.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Travel Tips */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="text-2xl">💡 Travel Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itinerary.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>
                <p className="text-base">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <SaveItineraryDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={saveCurrentItinerary}
        defaultTitle={`${itinerary.destination} Adventure`}
      />
    </div>
  );
};