
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, MessageSquare, Users, Settings, Home, LogOut, Shield } from 'lucide-react';
import { cn } from "@/lib/utils";
import Logo from './Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const adminRole = localStorage.getItem('userRole') === 'admin';
      setIsAdmin(adminRole);
    };
    
    checkAdminStatus();
  }, []);
  
  const links = [
    { name: 'Hem', path: '/dashboard', icon: Home },
    { name: 'Gruppchattar', path: '/chats', icon: MessageSquare },
    { name: 'Direktmeddelanden', path: '/messages', icon: MessageSquare },
    { name: 'Medlemmar', path: '/members', icon: Users },
    { name: 'Inställningar', path: '/settings', icon: Settings },
  ];
  
  // Add admin link if user is admin
  if (isAdmin) {
    links.push({ name: 'Admin Panel', path: '/admin', icon: Shield });
  }
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear all auth related local storage
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      
      toast({
        title: "Utloggad",
        description: "Du har loggats ut från systemet.",
      });
      
      // Force navigation to home page
      setOpen(false); // Close mobile menu if open
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Fel vid utloggning",
        description: "Ett problem uppstod vid utloggning. Försök igen.",
        variant: "destructive"
      });
    }
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
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium"
            >
              <LogOut className="h-4 w-4 mr-1" /> Logga ut
            </Button>
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
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="flex items-center justify-start gap-3 px-4 py-3 text-base font-medium hover:bg-muted rounded-none text-left"
              >
                <LogOut className="h-5 w-5" /> Logga ut
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
