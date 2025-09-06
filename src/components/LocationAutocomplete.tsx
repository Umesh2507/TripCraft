import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { useLocationAutocomplete, LocationSuggestion } from '@/hooks/useLocationAutocomplete';
import { cn } from '@/lib/utils';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const LocationAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "e.g. Paris, Tokyo, Bali...",
  required = false 
}: LocationAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { query, setQuery, suggestions, isLoading, error, clearSuggestions } = useLocationAutocomplete();

  // Sync internal query with external value
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value, query, setQuery]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    onChange(suggestion.fullName);
    setQuery(suggestion.fullName);
    setIsOpen(false);
    setSelectedIndex(-1);
    clearSuggestions();
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when there are suggestions or loading
  const showDropdown = isOpen && (suggestions.length > 0 || isLoading || error);

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-semibold text-primary">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative space-y-2">
      <Label htmlFor="destination" className="flex items-center gap-2 text-base font-medium">
        <MapPin className="w-4 h-4 text-primary" />
        Where would you like to go?
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          id="destination"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="h-12 text-base border-2 focus:border-primary transition-smooth pr-10"
          required={required}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-elevation max-h-80 overflow-y-auto"
          role="listbox"
        >
          {isLoading && (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Finding destinations...
            </div>
          )}

          {error && (
            <div className="px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {!isLoading && !error && suggestions.length === 0 && query.length >= 2 && (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No destinations found for "{query}"
            </div>
          )}

          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3 border-b border-border last:border-b-0",
                selectedIndex === index && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleSuggestionSelect(suggestion)}
              role="option"
              aria-selected={selectedIndex === index}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg shrink-0">
                  {suggestion.flag || '📍'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {highlightMatch(suggestion.name, query)}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {highlightMatch(suggestion.country, query)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground capitalize shrink-0">
                  {suggestion.type}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};