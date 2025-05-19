import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Moon, 
  Sun, 
  Smartphone, 
  LogOut, 
  UserCircle, 
  Lock, 
  Palette,
  UploadCloud,
  Camera,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  FileText,
  Trash2,
  Download,
  Laptop,
  X
} from 'lucide-react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { Profile, ExtendedProfile } from '@/types/supabase';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    apartment: ""
  });
  
  // Fetch user profile when component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user has admin role in localStorage
        const userRole = localStorage.getItem('userRole');
        const isUserAdmin = userRole === 'admin';
        setIsAdmin(isUserAdmin);
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Fel vid hämtning av profil",
            description: "Det gick inte att hämta din profilinformation.",
            variant: "destructive"
          });
        } else if (profileData) {
          // Create extended profile with phone field
          // Since phone doesn't exist in the profile schema, we initialize it with an empty string
          const extendedProfile: ExtendedProfile = {
            ...profileData,
            phone: "" // Initialize with empty string since it doesn't exist in the database
          };
          
          setProfile(extendedProfile);
          setFormData({
            fullName: extendedProfile.name || "",
            email: extendedProfile.email || session.user.email || "",
            phone: "", // Initialize with empty string
            apartment: extendedProfile.apartment || ""
          });
        }
      } else {
        // Redirect to login if no session
        navigate('/');
      }
      
      setIsLoading(false);
    };
    
    fetchUserProfile();
  }, [toast, navigate]);
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Inte inloggad",
        description: "Du måste vara inloggad för att uppdatera din profil.",
        variant: "destructive"
      });
      return;
    }
    
    // Create update object with fields that should be updated
    const updateData: {
      name: string;
      email: string;
      apartment?: string;
    } = {
      name: formData.fullName,
      email: formData.email,
    };
    
    // Only include apartment if user is admin
    if (isAdmin) {
      updateData.apartment = formData.apartment;
    }
    
    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', session.user.id);
    
    if (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Fel vid uppdatering",
        description: "Det gick inte att uppdatera din profil.",
        variant: "destructive"
      });
    } else {
      // Update local state to include phone number even though it's not in DB
      if (profile) {
        setProfile({
          ...profile,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone, // Maintain phone in local state
          apartment: updateData.apartment || profile.apartment
        });
      }
      
      toast({
        title: "Profil uppdaterad",
        description: "Dina profilinställningar har sparats.",
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Aviseringsinställningar uppdaterade",
      description: "Dina aviseringsinställningar har sparats.",
    });
  };
  
  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Utseendeinställningar uppdaterade",
      description: "Dina utseendeinställningar har sparats.",
    });
  };

  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Integritetsinställningar uppdaterade",
      description: "Dina integritetsinställningar har sparats.",
    });
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Säkerhetsinställningar uppdaterade",
      description: "Dina säkerhetsinställningar har sparats.",
    });
  };

  const handleSaveGDPR = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "GDPR-inställningar uppdaterade",
      description: "Dina GDPR-inställningar har sparats.",
    });
  };

  const confirmDataDeletion = () => {
    toast({
      title: "Begäran om radering skickad",
      description: "Din begäran om radering av personuppgifter har skickats. Detta kan ta upp till 30 dagar.",
    });
  };

  const downloadData = () => {
    toast({
      title: "Dataexport förbereds",
      description: "Din data förbereds för nedladdning. Du kommer att få ett meddelande när den är klar.",
    });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Fel vid utloggning",
        description: "Det gick inte att logga ut.",
        variant: "destructive"
      });
    } else {
      // Clear localStorage completely
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      
      toast({
        title: "Loggade ut",
        description: "Du har loggats ut från BRF Humlan4.",
      });
      
      // Redirect to home page
      navigate('/');
    }
  };

  // Show a loading animation while the profile is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar profil...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show initials from the user's name
  const getInitials = () => {
    if (!profile?.name) return "";
    return profile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 animate-in">Inställningar</h1>
        
        <Tabs defaultValue="profile" className="animate-in">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 flex-shrink-0">
              <TabsList className="flex flex-col h-auto bg-transparent space-y-1 p-0">
                <TabsTrigger 
                  value="profile" 
                  className="justify-start px-3 w-full h-10"
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="justify-start px-3 w-full h-10"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Aviseringar
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="justify-start px-3 w-full h-10"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Utseende
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="justify-start px-3 w-full h-10"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Säkerhet
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className="justify-start px-3 w-full h-10"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Integritet
                </TabsTrigger>
                <TabsTrigger 
                  value="gdpr" 
                  className="justify-start px-3 w-full h-10"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  GDPR
                </TabsTrigger>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="justify-start px-3 w-full h-10" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logga ut
                </Button>
              </TabsList>
            </div>
            
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <form onSubmit={handleSaveProfile}>
                    <CardHeader>
                      <CardTitle>Profil</CardTitle>
                      <CardDescription>
                        Hantera din profilinformation.
                        {isAdmin && (
                          <span className="text-green-600 ml-2 font-medium">
                            (Administratörsrättigheter)
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:text-left sm:justify-start sm:space-x-4">
                        <div className="relative mb-4 sm:mb-0">
                          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl text-primary font-semibold">
                            {getInitials()}
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="absolute bottom-0 right-0 h-6 w-6 rounded-full border text-xs bg-background"
                          >
                            <UploadCloud className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">{profile?.name || 'Ingen profil'}</h3>
                          <p className="text-sm text-muted-foreground">{profile?.apartment ? `Lägenhet ${profile.apartment}` : 'Ingen lägenhet'}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Fullständigt namn</Label>
                          <Input 
                            id="fullName" 
                            value={formData.fullName}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">E-post</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefonnummer</Label>
                          <Input 
                            id="phone" 
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="apartment">Lägenhetsnummer</Label>
                          <Input 
                            id="apartment" 
                            value={formData.apartment}
                            onChange={handleInputChange}
                            disabled={!isAdmin}
                          />
                          {!isAdmin ? (
                            <p className="text-xs text-muted-foreground">
                              Kan endast ändras av administratör
                            </p>
                          ) : (
                            <p className="text-xs text-green-600">
                              Du kan ändra detta fält som administratör
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit">Spara ändringar</Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <form onSubmit={handleSaveNotifications}>
                    <CardHeader>
                      <CardTitle>Aviseringar</CardTitle>
                      <CardDescription>
                        Hantera dina aviseringsinställningar.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Chattar</h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="chat-notifications">Chatt-meddelanden</Label>
                            <p className="text-sm text-muted-foreground">
                              Få aviseringar när du får ett nytt meddelande
                            </p>
                          </div>
                          <Switch id="chat-notifications" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="mentions">Omnämningar</Label>
                            <p className="text-sm text-muted-foreground">
                              Få aviseringar när du blir omnämnd i en chatt
                            </p>
                          </div>
                          <Switch id="mentions" defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Meddelanden & Evenemang</h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="announcements">Föreningsmeddelanden</Label>
                            <p className="text-sm text-muted-foreground">
                              Få aviseringar om viktiga meddelanden från styrelsen
                            </p>
                          </div>
                          <Switch id="announcements" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="events">Evenemang</Label>
                            <p className="text-sm text-muted-foreground">
                              Få aviseringar om kommande evenemang i föreningen
                            </p>
                          </div>
                          <Switch id="events" defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Leveransmetod</h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-notifications">E-postaviseringar</Label>
                            <p className="text-sm text-muted-foreground">
                              Skicka även aviseringar till din e-post
                            </p>
                          </div>
                          <Switch id="email-notifications" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="push-notifications">Push-aviseringar</Label>
                            <p className="text-sm text-muted-foreground">
                              Få aviseringar på din mobiltelefon
                            </p>
                          </div>
                          <Switch id="push-notifications" defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit">Spara inställningar</Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="mt-0">
                <Card>
                  <form onSubmit={handleSaveAppearance}>
                    <CardHeader>
                      <CardTitle>Utseende</CardTitle>
                      <CardDescription>
                        Anpassa appens utseende efter dina preferenser.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Tema</h3>
                        
                        <div className="flex flex-col space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Välj vilket tema du vill använda för appen. Du kan välja mellan ljust, mörkt eller systemets inställning.
                          </p>
                          
                          <ThemeToggle />
                          
                          <div className="p-4 border rounded-lg bg-card">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`p-1 rounded-full ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`}>
                                  {theme === "dark" ? (
                                    <Moon className="h-5 w-5 text-slate-200" />
                                  ) : (
                                    <Sun className="h-5 w-5 text-amber-500" />
                                  )}
                                </div>
                                <p className="text-sm font-medium">
                                  {theme === "light" ? "Ljust tema" : theme === "dark" ? "Mörkt tema" : "Systemtema"}
                                </p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {theme === "system" && "Följer ditt systems inställningar"}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Accentfärg</h3>
                        
                        <div className="grid grid-cols-5 gap-4">
                          <div className="border rounded-full h-8 w-8 bg-blue-500 ring-2 ring-blue-500 ring-offset-2"></div>
                          <div className="border rounded-full h-8 w-8 bg-green-500"></div>
                          <div className="border rounded-full h-8 w-8 bg-purple-500"></div>
                          <div className="border rounded-full h-8 w-8 bg-orange-500"></div>
                          <div className="border rounded-full h-8 w-8 bg-pink-500"></div>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Textinställningar</h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="text-size">Textstorlek</Label>
                            <p className="text-sm text-muted-foreground">
                              Ändra storlek på text i appen
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">A</span>
                            <Input type="range" id="text-size" className="w-24" />
                            <span className="text-xl">A</span>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/20 space-y-2">
                          <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium text-blue-800 dark:text-blue-400">Tema tips</h3>
                          </div>
                          <p className="text-sm text-blue-700 dark:text-blue-500">
                            Mörkt tema kan hjälpa till att minska ögontrötthet vid användning i mörka miljöer och kan spara batteritid på OLED-skärmar.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit">Spara inställningar</Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card>
                  <form onSubmit={handleSaveSecurity}>
                    <CardHeader>
                      <CardTitle>Säkerhet</CardTitle>
                      <CardDescription>
                        Hantera dina säkerhetsinställningar och skydda ditt konto.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Ändra lösenord</h3>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Nuvarande lösenord</Label>
                            <Input id="current-password" type="password" />
                            <p className="text-xs text-muted-foreground mt-1">
                              Vi sparar aldrig ditt lösenord i klartext
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-password">Nytt lösenord</Label>
                            <Input id="new-password" type="password" />
                            <p className="text-xs text-muted-foreground mt-1">
                              Använd minst 12 tecken med stora och små bokstäver, siffror och specialtecken
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Bekräfta nytt lösenord</Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => {
                              toast({
                                title: "Lösenord uppdaterat",
                                description: "Ditt lösenord har ändrats.",
                              });
                            }}
                          >
                            Uppdatera lösenord
                          </Button>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Tvåfaktorsautentisering (2FA)</h3>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <Label>SMS-autentisering</Label>
                            <p className="text-sm text-muted-foreground">
                              Få en kod via SMS varje gång du loggar in
                            </p>
                          </div>
                          <Switch id="sms-auth" />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <Label>Autentiseringsapp</Label>
                            <p className="text-sm text-muted-foreground">
                              Använd en app som Google Authenticator för säkrare inloggning
                            </p>
                          </div>
                          <Switch id="app-auth" />
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Sessioner</h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-start p-4 border rounded-lg bg-muted/50">
                            <div className="space-y-1">
                              <p className="font-medium">Denna enhet</p>
                              <p className="text-sm text-muted-foreground">iPhone 13 • Stockholm</p>
                              <p className="text-xs text-muted-foreground">Senast aktiv: Nu</p>
                            </div>
                            <Button variant="outline" size="sm">Logga ut</Button>
                          </div>
                          
                          <div className="flex justify-between items-start p-4 border rounded-lg">
                            <div className="space-y-1">
                              <p className="font-medium">MacBook Pro</p>
                              <p className="text-sm text-muted-foreground">Chrome • Stockholm</p>
                              <p className="text-xs text-muted-foreground">Senast aktiv: Igår 15:42</p>
                            </div>
                            <Button variant="outline" size="sm">Logga ut</Button>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20 space-y-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-amber-600" />
                            <h3 className="font-medium text-amber-800 dark:text-amber-400">Säkerhetstips</h3>
                          </div>
                          <p className="text-sm text-amber-700 dark:text-amber-500">
                            Logga aldrig in från offentliga datorer och se till att du alltid loggar ut när du är klar.
                            Använd unika lösenord för varje konto och överväg att använda en lösenordshanterare.
                          </p>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full text-destructive hover:text-destructive"
                          onClick={() => {
                            toast({
                              title: "Sessioner avslutade",
                              description: "Du har loggats ut från alla enheter.",
                            });
                          }}
                        >
                          Logga ut från alla enheter
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit">Spara inställningar</Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy" className="mt-0">
                <Card>
                  <form onSubmit={handleSavePrivacy}>
                    <CardHeader>
                      <CardTitle>Integritet</CardTitle>
                      <CardDescription>
                        Hantera hur din personliga information delas med andra.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Kontaktinformation</h3>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="share-phone" />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="share-phone"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Dela telefonnummer med andra medlemmar
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Tillåt andra medlemmar att se ditt telefonnummer i din profil
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox id="share-email" defaultChecked />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="share-email"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Dela e-post med andra medlemmar
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Tillåt andra medlemmar att se din e-postadress i din profil
                            </p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Mediaåtkomst</h3>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="allow-camera" />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="allow-camera"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Tillåt kameraåtkomst i appen
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Tillåt appen att använda din kamera för att ta bilder och videochatta
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox id="allow-microphone" />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="allow-microphone"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Tillåt mikrofonåtkomst i appen
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Tillåt appen att använda din mikrofon för röstmeddelanden och videochatt
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="allow-location" />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="allow-location"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Tillåt platsåtkomst i appen
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Tillåt appen att använda din plats för lokaliserade händelser och meddelanden
                            </p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Synlighet</h3>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="online-status" defaultChecked />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="online-status"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Visa online-status
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Visa när du är online för andra medlemmar
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox id="read-receipts" defaultChecked />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="read-receipts"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Skicka läskvitton
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Låt andra veta när du har läst deras meddelanden
                            </p>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/20 space-y-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium text-blue-800 dark:text-blue-400">Integritetsinformation</h3>
                          </div>
                          <p className="text-sm text-blue-700 dark:text-blue-500">
                            Dina integritetsinställningar ger dig kontroll över hur din information delas. 
                            Delning av kontaktuppgifter underlättar kommunikation men är helt frivilligt.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit">Spara inställningar</Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="gdpr" className="mt-0">
                <Card>
                  <form onSubmit={handleSaveGDPR}>
                    <CardHeader>
                      <CardTitle>GDPR-inställningar</CardTitle>
                      <CardDescription>
                        Hantera dina rättigheter enligt dataskyddsförordningen (GDPR).
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/20">
                          <p className="text-sm text-blue-700 dark:text-blue-500">
                            Enligt GDPR (General Data Protection Regulation) har du rätt att få tillgång till, exportera och 
                            radera dina personuppgifter. Du har också rätt att bli informerad om hur dina personuppgifter behandlas.
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Datahantering</h3>
                        
                        <div className="grid gap-4">
                          <div className="flex justify-between items-center p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <p className="font-medium">Exportera din data</p>
                              <p className="text-sm text-muted-foreground">
                                Ladda ner en kopia av all din personliga data
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={downloadData}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Exportera
                            </Button>
                          </div>
                          
                          <div className="flex justify-between items-center p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <p className="font-medium">Datahanteringsavtal</p>
                              <p className="text-sm text-muted-foreground">
                                Läs om hur vi behandlar dina personuppgifter
                              </p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Visa
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[700px] max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Datahanteringsavtal</DialogTitle>
                                  <DialogDescription>
                                    Information om hur vi hanterar dina personuppgifter
                                  </DialogDescription>
                                  <DialogClose asChild>
                                    <Button variant="ghost" className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
                                      <X className="h-4 w-4" />
                                      <span className="sr-only">Stäng</span>
                                    </Button>
                                  </DialogClose>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <h3 className="font-medium">Insamlad information</h3>
                                  <p className="text-sm">
                                    Vi samlar in följande personuppgifter:
                                  </p>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                    <li>Namn och kontaktuppgifter (e-post, telefon)</li>
                                    <li>Lägenhetsnummer och adressuppgifter</li>
                                    <li>Information om din aktivitet i appen</li>
                                    <li>Kommunikation med andra boende och styrelsen</li>
                                  </ul>
                                  
                                  <h3 className="font-medium mt-6">Hur vi använder dina uppgifter</h3>
                                  <p className="text-sm">
                                    Dina personuppgifter används för att:
                                  </p>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                    <li>Tillhandahålla kommunikationstjänster inom bostadsrättsföreningen</li>
                                    <li>Förmedla information om händelser och viktiga meddelanden</li>
                                    <li>Förbättra appens funktionalitet baserat på användning</li>
                                    <li>Förenkla kontakten mellan medlemmar efter samtycke</li>
                                  </ul>
                                  
                                  <h3 className="font-medium mt-6">Lagring och säkerhet</h3>
                                  <p className="text-sm">
                                    Vi lagrar dina uppgifter på säkra servrar inom EU och använder 
                                    kryptering för att skydda din data. Vi delar aldrig dina uppgifter 
                                    med tredje part utan ditt samtycke, såvida det inte krävs enligt lag.
                                  </p>
                                  
                                  <h3 className="font-medium mt-6">Dina rättigheter</h3>
                                  <p className="text-sm">
                                    Du har rätt att:
                                  </p>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                    <li>Få tillgång till dina personuppgifter</li>
                                    <li>Rätta felaktiga uppgifter</li>
                                    <li>Begära radering av dina uppgifter</li>
                                    <li>Begära begränsning av behandling</li>
                                    <li>Invända mot behandling</li>
                                    <li>Dataportabilitet (få ut dina uppgifter)</li>
                                  </ul>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button type="button">Jag förstår</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          <div className="flex justify-between items-center p-4 border rounded-lg border-destructive/20">
                            <div className="space-y-0.5">
                              <p className="font-medium">Begär radering av personuppgifter</p>
                              <p className="text-sm text-muted-foreground">
                                Begär att alla dina personuppgifter tas bort från våra system
                              </p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Radera data
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Bekräfta radering av data</DialogTitle>
                                  <DialogDescription>
                                    Detta kommer att radera all din personliga information från vår plattform. Det går inte att ångra.
                                  </DialogDescription>
                                  <DialogClose asChild>
                                    <Button variant="ghost" className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
                                      <X className="h-4 w-4" />
                                      <span className="sr-only">Stäng</span>
                                    </Button>
                                  </DialogClose>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="text-sm text-muted-foreground mb-4">
                                    Vid radering kommer:
                                  </p>
                                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                                    <li>Ditt konto att avslutas</li>
                                    <li>Dina personuppgifter att raderas</li>
                                    <li>Dina meddelanden att anonymiseras</li>
                                    <li>Du att bli utloggad från alla enheter</li>
                                  </ul>
                                </div>
                                <DialogFooter className="flex gap-2 sm:justify-between">
                                  <DialogClose asChild>
                                    <Button type="button" variant="outline" className="sm:flex-grow">
                                      Avbryt
                                    </Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      className="sm:flex-grow"
                                      onClick={confirmDataDeletion}
                                    >
                                      Bekräfta radering
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="text-lg font-medium">Samtycke</h3>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="analytics-consent" defaultChecked />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="analytics-consent"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Anonymiserad användningsanalys
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Tillåt insamling av anonymiserad användningsdata för att förbättra appen
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="email-consent" defaultChecked />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor="email-consent"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              E-postkommunikation
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Tillåt att vi skickar viktiga uppdateringar och information via e-post
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit">Spara inställningar</Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
