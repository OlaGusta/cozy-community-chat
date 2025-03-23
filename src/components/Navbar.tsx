
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, MessageSquare, Users, Settings, Home } from 'lucide-react';
import { cn } from "@/lib/utils";
import Logo from './Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const links = [
    { name: 'Hem', path: '/dashboard', icon: Home },
    { name: 'Chattar', path: '/chats', icon: MessageSquare },
    { name: 'Meddelanden', path: '/messages', icon: MessageSquare },
    { name: 'Medlemmar', path: '/members', icon: Users },
    { name: 'Meddelanden', path: '/announcements', icon: Bell },
    { name: 'Inställningar', path: '/settings', icon: Settings },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex-none">
          <Logo size={isMobile ? 'sm' : 'md'} withText={!isMobile} />
        </Link>

        {!isMobile && (
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(link.path) 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col py-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-base font-medium transition-colors",
                    isActive(link.path)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  {link.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
