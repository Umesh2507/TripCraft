import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, Globe, Lock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface SaveItineraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (options: {
    title: string;
    isPublic: boolean;
    luxuryLevel: 'budget' | 'moderate' | 'luxury' | 'premium';
    comfortLevel: 'backpacker' | 'standard' | 'comfort' | 'luxury';
  }, itineraryData: any) => Promise<{ success: boolean; error?: string }>;
  defaultTitle?: string;
  itineraryData: any;
}

export const SaveItineraryDialog = ({ isOpen, onClose, onSave, defaultTitle = '', itineraryData }: SaveItineraryDialogProps) => {
  const [title, setTitle] = useState(defaultTitle);
  const [isPublic, setIsPublic] = useState(false);
  const [luxuryLevel, setLuxuryLevel] = useState<'budget' | 'moderate' | 'luxury' | 'premium'>('moderate');
  const [comfortLevel, setComfortLevel] = useState<'backpacker' | 'standard' | 'comfort' | 'luxury'>('standard');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your itinerary');
      return;
    }

    setIsSaving(true);
    try {
      console.log('SaveItineraryDialog: Starting save with data:', {
        title: title.trim(),
        isPublic,
        luxuryLevel,
        comfortLevel,
      });
      
      const result = await onSave({
        title: title.trim(),
        isPublic,
        luxuryLevel,
        comfortLevel,
      }, itineraryData);

      if (result.success) {
        toast.success('Itinerary saved successfully!');
        onClose();
        // Reset form
        setTitle('');
        setIsPublic(false);
        setLuxuryLevel('moderate');
        setComfortLevel('standard');
      } else {
        const errorMessage = result.error || 'Failed to save itinerary';
        console.error('SaveItineraryDialog: Save failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('SaveItineraryDialog: Error during save:', error);
      toast.error('Failed to save itinerary');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Your Itinerary
          </DialogTitle>
          <DialogDescription>
            Save this itinerary to your collection and optionally share it with the community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="My Amazing Trip to..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="luxury">Budget Level</Label>
              <Select value={luxuryLevel} onValueChange={(value: any) => setLuxuryLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comfort">Comfort Level</Label>
              <Select value={comfortLevel} onValueChange={(value: any) => setComfortLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backpacker">Backpacker</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="comfort">Comfort</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-primary" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">
                  {isPublic ? 'Public' : 'Private'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isPublic 
                    ? 'Share with the community' 
                    : 'Keep it to yourself'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !title.trim()}
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save Itinerary'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};