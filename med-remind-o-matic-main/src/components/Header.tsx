
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Home, Plus, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4 mr-2" /> },
    { path: '/set-reminder', label: 'Add Reminder', icon: <Plus className="w-4 h-4 mr-2" /> },
    { path: '/reminders', label: 'All Reminders', icon: <ListChecks className="w-4 h-4 mr-2" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glassmorphism border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center" onClick={closeMobileMenu}>
              <div className="bg-primary text-primary-foreground rounded-full p-1.5 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M17 3a2.85 2.83 0 1 1 0 5.7"></path>
                  <path d="M10.42 7.7A2.85 2.83 0 1 1 7.57 3"></path>
                  <path d="M16.71 12.28a2.85 2.83 0 1 1-5.7 0"></path>
                  <path d="M7 21a2.85 2.83 0 1 1 0-5.7"></path>
                  <path d="M7.3 9.42v6.86"></path>
                  <path d="M12.57 19.3h6.86"></path>
                  <path d="M11.15 12.28 7.3 16.13"></path>
                </svg>
              </div>
              <span className="text-xl font-semibold">PillMinder</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                asChild
                className={cn(
                  "transition-all duration-200",
                  isActive(item.path) ? "text-primary-foreground" : "text-foreground hover:text-primary"
                )}
              >
                <NavLink to={item.path} className="flex items-center">
                  {item.icon}
                  {item.label}
                </NavLink>
              </Button>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glassmorphism border-b shadow-sm animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                asChild
                className={cn(
                  "w-full justify-start text-left transition-all duration-200",
                  isActive(item.path) ? "text-primary-foreground" : "text-foreground hover:text-primary"
                )}
              >
                <NavLink to={item.path} onClick={closeMobileMenu} className="flex items-center">
                  {item.icon}
                  {item.label}
                </NavLink>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
