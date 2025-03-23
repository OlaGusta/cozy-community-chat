
import React from 'react';
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
  UploadCloud
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const Settings = () => {
  const { toast } = useToast();
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profil uppdaterad",
      description: "Dina profilinställningar har sparats.",
    });
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
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="justify-start px-3 w-full h-10" 
                  onClick={() => {
                    toast({
                      title: "Loggade ut",
                      description: "Du har loggats ut från BRF Humlan4.",
                    });
                    // In a real app, you would handle logout and redirection
                  }}
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
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:text-left sm:justify-start sm:space-x-4">
                        <div className="relative mb-4 sm:mb-0">
                          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl text-primary font-semibold">
                            AA
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
                          <h3 className="text-lg font-medium">Anders Andersson</h3>
                          <p className="text-sm text-muted-foreground">Lägenhet 1201</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Fullständigt namn</Label>
                          <Input 
                            id="fullName" 
                            defaultValue="Anders Andersson" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">E-post</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            defaultValue="anders@exempel.se" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefonnummer</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            defaultValue="070-123 45 67" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="apartment">Lägenhetsnummer</Label>
                          <Input 
                            id="apartment" 
                            defaultValue="1201" 
                            disabled 
                          />
                          <p className="text-xs text-muted-foreground">
                            Kan endast ändras av administratör
                          </p>
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
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className="border rounded-md p-3 w-full flex items-center justify-center cursor-pointer bg-background">
                              <Sun className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-sm">Ljust</span>
                          </div>
                          
                          <div className="flex flex-col items-center gap-2">
                            <div className="border rounded-md p-3 w-full flex items-center justify-center cursor-pointer bg-slate-950">
                              <Moon className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-sm">Mörkt</span>
                          </div>
                          
                          <div className="flex flex-col items-center gap-2">
                            <div className="border rounded-md p-3 w-full flex items-center justify-center cursor-pointer bg-gradient-to-r from-background to-slate-950">
                              <Smartphone className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-sm">System</span>
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
                  <CardHeader>
                    <CardTitle>Säkerhet</CardTitle>
                    <CardDescription>
                      Hantera dina säkerhetsinställningar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Ändra lösenord</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Nuvarande lösenord</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nytt lösenord</Label>
                          <Input id="new-password" type="password" />
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
