import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Calendar, DollarSign, Clock, Users, Heart } from 'lucide-react';
import { useItineraries } from '@/hooks/useItineraries';
import { useAuth } from '@/hooks/useAuth';
import { Itinerary, ItineraryRating } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface ItineraryDetailModalProps {
  itineraryId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ItineraryDetailModal = ({ itineraryId, isOpen, onClose }: ItineraryDetailModalProps) => {
  const { user } = useAuth();
  const { getItinerary, getItineraryRatings, rateItinerary } = useItineraries();
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [ratings, setRatings] = useState<ItineraryRating[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReview, setUserReview] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && itineraryId) {
      loadItineraryData();
    }
  }, [isOpen, itineraryId]);

  const loadItineraryData = async () => {
    setLoading(true);
    try {
      const [itineraryData, ratingsData] = await Promise.all([
        getItinerary(itineraryId),
        getItineraryRatings(itineraryId)
      ]);

      setItinerary(itineraryData);
      setRatings(ratingsData);

      // Check if user has already rated this itinerary
      if (user) {
        const existingRating = ratingsData.find(r => r.user_id === user.id);
        if (existingRating) {
          setUserRating(existingRating.rating);
          setUserReview(existingRating.review || '');
        }
      }
    } catch (error) {
      console.error('Failed to load itinerary data:', error);
      toast.error('Failed to load itinerary details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!user) {
      toast.error('Please sign in to rate itineraries');
      return;
    }

    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmittingRating(true);
    try {
      await rateItinerary(itineraryId, userRating, userReview);
      toast.success('Rating submitted successfully!');
      await loadItineraryData(); // Refresh data
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
        onClick={() => interactive && onStarClick?.(i + 1)}
      />
    ));
  };

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!itinerary) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Itinerary not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const itineraryData = itinerary.itinerary_data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {itinerary.title}
          </DialogTitle>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {itinerary.destination}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {itinerary.duration_days} days
            </div>
            <div className="flex items-center gap-1">
              {renderStars(averageRating)}
              <span className="ml-1">
                {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          {itineraryData.overview && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">{itineraryData.overview}</p>
            </div>
          )}

          {/* Trip Details */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              <DollarSign className="w-3 h-3 mr-1" />
              {itinerary.luxury_level}
            </Badge>
            <Badge variant="outline">
              {itinerary.comfort_level}
            </Badge>
          </div>

          {/* Highlights */}
          {itineraryData.highlights && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {itineraryData.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Itinerary */}
          {itineraryData.days && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Daily Itinerary</h3>
              <div className="space-y-4">
                {itineraryData.days.map((day: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">
                      Day {day.day}: {day.title}
                    </h4>
                    <div className="space-y-2">
                      {day.activities?.map((activity: any, actIndex: number) => (
                        <div key={actIndex} className="flex gap-3 text-sm">
                          <span className="font-medium text-primary shrink-0 w-16">
                            {activity.time}
                          </span>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-muted-foreground">{activity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating Section */}
          {user && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Rate This Itinerary</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Your Rating:</span>
                  <div className="flex gap-1">
                    {renderStars(userRating, true, setUserRating)}
                  </div>
                </div>
                <Textarea
                  placeholder="Share your thoughts about this itinerary (optional)"
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleSubmitRating}
                  disabled={isSubmittingRating || userRating === 0}
                  className="w-full"
                >
                  {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          )}

          {/* Reviews */}
          {ratings.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">
                Reviews ({ratings.length})
              </h3>
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={(rating as any).users?.avatar_url || ''} />
                          <AvatarFallback>
                            {(rating as any).users?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {(rating as any).users?.full_name || 'Anonymous'}
                          </p>
                          <div className="flex items-center gap-1">
                            {renderStars(rating.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {rating.review && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {rating.review}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};