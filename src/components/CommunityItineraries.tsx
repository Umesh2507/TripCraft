import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Calendar, Users, DollarSign, Eye } from 'lucide-react';
import { useItineraries } from '@/hooks/useItineraries';
import { ItinerarySummary } from '@/lib/supabase';
import { ItineraryDetailModal } from './ItineraryDetailModal';

export const CommunityItineraries = () => {
  const { publicItineraries, loading, error } = useItineraries();
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Community Itineraries</h2>
          <p className="text-muted-foreground">Discover amazing travel plans shared by our community</p>
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
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Itineraries</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
          Community Itineraries
        </h2>
        <p className="text-muted-foreground text-lg">
          Discover amazing travel plans shared by our community
        </p>
      </div>

      {publicItineraries.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Public Itineraries Yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your travel plan with the community!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicItineraries.map((itinerary) => (
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
                  <div className="flex items-center gap-1 ml-2">
                    {renderStars(itinerary.average_rating)}
                    <span className="text-sm font-medium ml-1">
                      {itinerary.average_rating > 0 ? itinerary.average_rating.toFixed(1) : 'New'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {itinerary.duration_days} days
                  </div>
                  <div className="text-xs">
                    {itinerary.total_ratings} rating{itinerary.total_ratings !== 1 ? 's' : ''}
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

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={itinerary.author_avatar || ''} />
                      <AvatarFallback className="text-xs">
                        {itinerary.author_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {itinerary.author_name || 'Anonymous'}
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedItinerary(itinerary.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
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