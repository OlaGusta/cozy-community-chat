
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [apartment, setApartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      toast({
        title: "Lösenorden matchar inte",
        description: "Var god kontrollera dina lösenord.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            apartment
          },
          emailRedirectTo: `${window.location.origin}`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registrering lyckades",
        description: "Ett bekräftelsemejl har skickats. Klicka på länken i mejlet för att aktivera ditt konto.",
      });
      navigate('/');
      
    } catch (error: any) {
      toast({
        title: "Registrering misslyckades",
        description: error.message || "Ett fel uppstod vid registrering. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md animate-in slide-up">
        <div className="flex justify-center mb-8">
          <Logo size="lg" withText />
        </div>
        
        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Skapa ett konto</CardTitle>
            <CardDescription className="text-center">
              Registrera dig för att få tillgång till föreningens gemenskap
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Namn</Label>
                <Input
                  id="name"
                  placeholder="Förnamn Efternamn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
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
                <Label htmlFor="apartment">Lägenhetsnummer</Label>
                <Input
                  id="apartment"
                  placeholder="t.ex. 1201"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? "Registrerar..." : "Registrera"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Tillbaka till inloggning
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
