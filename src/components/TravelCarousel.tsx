import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TravelPlace {
  id: number;
  name: string;
  country: string;
  continent: string;
  image: string;
  description: string;
}

const travelPlaces: TravelPlace[] = [
  {
    id: 1,
    name: "Taj Mahal",
    country: "India",
    continent: "Asia",
    image: "https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Iconic symbol of love and architectural masterpiece"
  },
  {
    id: 2,
    name: "Eiffel Tower",
    country: "France",
    continent: "Europe",
    image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Iron lattice tower and symbol of Paris"
  },
  {
    id: 3,
    name: "Machu Picchu",
    country: "Peru",
    continent: "South America",
    image: "https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Ancient Incan citadel high in the Andes Mountains"
  },
  {
    id: 4,
    name: "Great Wall of China",
    country: "China",
    continent: "Asia",
    image: "https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Ancient fortification stretching across northern China"
  },
  {
    id: 5,
    name: "Pyramids of Giza",
    country: "Egypt",
    continent: "Africa",
    image: "https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Ancient wonders and tombs of pharaohs"
  },
  {
    id: 6,
    name: "Sydney Opera House",
    country: "Australia",
    continent: "Australia",
    image: "https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Architectural marvel and performing arts venue"
  },
  {
    id: 7,
    name: "Statue of Liberty",
    country: "USA",
    continent: "North America",
    image: "https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Symbol of freedom and democracy"
  },
  {
    id: 8,
    name: "Kerala Backwaters",
    country: "India",
    continent: "Asia",
    image: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Serene network of waterways and lagoons"
  },
  {
    id: 9,
    name: "Santorini",
    country: "Greece",
    continent: "Europe",
    image: "https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "Stunning Greek island with white-washed buildings"
  },
  {
    id: 10,
    name: "Victoria Falls",
    country: "Zambia/Zimbabwe",
    continent: "Africa",
    image: "https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    description: "One of the world's largest waterfalls"
  }
];

export const TravelCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === travelPlaces.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? travelPlaces.length - 1 : prevIndex - 1
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentPlace = travelPlaces[currentIndex];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentPlace.image})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white border-white/30"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white border-white/30"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Place Information */}
      <div className="absolute bottom-8 left-8 z-20 text-white max-w-md">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-2xl font-bold mb-1">{currentPlace.name}</h3>
          <p className="text-lg mb-2">{currentPlace.country}, {currentPlace.continent}</p>
          <p className="text-sm opacity-90">{currentPlace.description}</p>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 right-8 z-20 flex space-x-2">
        {travelPlaces.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};