import { Link } from 'react-router-dom';
import { Plane, MapPin, Users, Settings, Home, Globe } from 'lucide-react';

export const SiteMap = () => {
  const siteMapSections = [
    {
      title: "Main Pages",
      icon: <Home className="w-5 h-5" />,
      links: [
        { name: "Home", path: "/", description: "AI-powered travel planning" },
        { name: "Community", path: "/community", description: "Discover shared itineraries" },
        { name: "My Trips", path: "/my-trips", description: "Your saved travel plans" },
        { name: "Settings", path: "/settings", description: "Account preferences" },
      ]
    },
    {
      title: "Features",
      icon: <Plane className="w-5 h-5" />,
      links: [
        { name: "AI Trip Planning", path: "/#trip-form", description: "Generate personalized itineraries" },
        { name: "Travel Recommendations", path: "/community", description: "Expert-curated suggestions" },
        { name: "Budget Planning", path: "/#trip-form", description: "Smart budget optimization" },
        { name: "Local Insights", path: "/community", description: "Insider tips and hidden gems" },
      ]
    },
    {
      title: "Popular Destinations",
      icon: <MapPin className="w-5 h-5" />,
      links: [
        { name: "India", path: "/?destination=India", description: "Taj Mahal, Kerala, Rajasthan" },
        { name: "Europe", path: "/?destination=Europe", description: "Paris, Rome, Barcelona" },
        { name: "Asia", path: "/?destination=Asia", description: "Tokyo, Bali, Thailand" },
        { name: "Americas", path: "/?destination=Americas", description: "New York, Peru, Brazil" },
        { name: "Africa", path: "/?destination=Africa", description: "Egypt, Morocco, Kenya" },
        { name: "Australia", path: "/?destination=Australia", description: "Sydney, Melbourne, Perth" },
      ]
    },
    {
      title: "Travel Types",
      icon: <Globe className="w-5 h-5" />,
      links: [
        { name: "Adventure Travel", path: "/?interests=Adventure", description: "Hiking, climbing, extreme sports" },
        { name: "Cultural Tours", path: "/?interests=Culture", description: "Museums, history, local traditions" },
        { name: "Food & Wine", path: "/?interests=Food", description: "Culinary experiences and tastings" },
        { name: "Relaxation", path: "/?interests=Wellness", description: "Spas, beaches, wellness retreats" },
        { name: "Photography", path: "/?interests=Photography", description: "Scenic spots and photo tours" },
        { name: "Family Travel", path: "/?travelers=family", description: "Kid-friendly destinations" },
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold">Wandr Site Map</h2>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Explore all the amazing features and destinations available on our AI-powered travel platform
          </p>
        </div>

        {/* Site Map Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {siteMapSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-blue-400">
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="group block hover:bg-white/5 rounded-lg p-2 transition-all duration-200"
                    >
                      <div className="text-blue-300 group-hover:text-blue-200 font-medium mb-1">
                        {link.name}
                      </div>
                      <div className="text-slate-400 text-sm group-hover:text-slate-300">
                        {link.description}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-hero bg-clip-text text-transparent">
                Wandr
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                © 2025 Wandr. AI-powered travel planning for everyone.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Discover the world with intelligent itineraries
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};