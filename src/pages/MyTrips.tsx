import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, DollarSign, Eye, Edit, Trash2, Plus } from "lucide-react";
import { useItineraries } from "@/hooks/useItineraries";
import { useAuth } from "@/hooks/useAuth";
import { ItineraryDetailModal } from "@/components/ItineraryDetailModal";
import { useState } from "react";
import { Link } from "react-router-dom";

const MyTrips = () => {
  const { user } = useAuth();
  const { userItineraries, loading, error } = useItineraries();
  const [selectedItinerary, setSelectedItinerary] = useState<string | null>(null);

  const getLuxuryBadgeColor = (level: string) => {
    switch (level) {
      case 'budget': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-blue-100 text-blue-800';
      case 'luxury': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComfortBadgeColor = (level: string) => {
    switch (level) {
      case 'backpacker': return 'bg-orange-100 text-orange-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'comfort': return 'bg-indigo-100 text-indigo-800';
      case 'luxury': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">My Custom Itineraries</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view your saved itineraries</p>
          <Link to="/">
            <Button variant="hero">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">My Custom Itineraries</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Itineraries</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">My Custom Itineraries</h1>
        </div>
        <Link to="/">
          <Button variant="hero">
            <Plus className="w-4 h-4 mr-2" />
            Create New Trip
          </Button>
        </Link>
      </div>

      {userItineraries.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Itineraries Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start planning your first adventure!
          </p>
          <Link to="/">
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Trip
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userItineraries.map((itinerary) => (
            <Card key={itinerary.id} className="bg-gradient-card shadow-card border-0 hover:shadow-elevation transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 line-clamp-2">
                      {itinerary.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <MapPin className="w-4 h-4" />
                      {itinerary.destination}
                    </CardDescription>
                  </div>
                  <Badge variant={itinerary.is_public ? "default" : "secondary"} className="ml-2">
                    {itinerary.is_public ? "Public" : "Private"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {itinerary.duration_days} days
                  </div>
                  <div className="text-xs">
                    Created {new Date(itinerary.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={getLuxuryBadgeColor(itinerary.luxury_level)}>
                    <DollarSign className="w-3 h-3 mr-1" />
                    {itinerary.luxury_level}
                  </Badge>
                  <Badge className={getComfortBadgeColor(itinerary.comfort_level)}>
                    {itinerary.comfort_level}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedItinerary(itinerary.id)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="px-3"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="px-3 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedItinerary && (
        <ItineraryDetailModal
          itineraryId={selectedItinerary}
          isOpen={!!selectedItinerary}
          onClose={() => setSelectedItinerary(null)}
        />
      )}
    </div>
  );
};

export default MyTrips;