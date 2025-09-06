import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plane, User, LogOut, MapPin, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';
import { toast } from '@/components/ui/sonner';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const { user, signOut, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0 min-w-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Plane className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-blue-600 whitespace-nowrap">
              Wandr
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center min-w-0">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap ${
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/community" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap ${
                location.pathname === '/community' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              Community
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-trips" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      My Trips
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <Button 
                  variant="ghost" 
                  onClick={() => openAuthModal('signin')}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => openAuthModal('signup')}
                  className="text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 whitespace-nowrap"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};