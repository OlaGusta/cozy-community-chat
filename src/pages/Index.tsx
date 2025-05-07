
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Inloggning lyckades",
        description: "Välkommen till BRF Humlan4!",
        duration: 3000, // Set duration to 3 seconds
      });
      
      // Check if user is an admin
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();
      
      if (profileData?.is_admin) {
        localStorage.setItem('userRole', 'admin');
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Inloggning misslyckades",
        description: error.message || "Ett fel uppstod vid inloggning. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md animate-in slide-up">
        <div className="flex justify-center mb-8">
          <Logo size="lg" withText />
        </div>
        
        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Välkommen tillbaka</CardTitle>
            <CardDescription className="text-center">
              Logga in för att fortsätta till föreningens gemenskap
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Lösenord</Label>
                  <a 
                    href="#" 
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Glömt lösenordet?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Loggar in..." : "Logga in"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSignUp}
              >
                Skapa konto
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          Har du problem med att logga in?{" "}
          <a 
            href="mailto:styrelsen@brfhumlan4.se" 
            className="text-primary underline-offset-4 hover:underline"
          >
            Kontakta styrelsen
          </a>
        </p>
      </div>
    </div>
  );
};

export default Index;
