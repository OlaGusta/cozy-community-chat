
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, Shield } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <Card className="mb-6 animate-in">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium mb-2">Hantera föreningen</h2>
        <p className="text-muted-foreground mb-4">
          Som administratör kan du hantera medlemmar, moderera konversationer och övervaka aktiviteter i föreningen.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-muted rounded-lg">
            <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Hantera medlemmar</h3>
              <p className="text-sm text-muted-foreground">
                Bjud in och hantera föreningens medlemmar
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-muted rounded-lg">
            <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Moderera konversationer</h3>
              <p className="text-sm text-muted-foreground">
                Övervaka och hantera chattkonversationer
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-muted rounded-lg">
            <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Hantera rättigheter</h3>
              <p className="text-sm text-muted-foreground">
                Ändra medlemmars behörigheter
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
