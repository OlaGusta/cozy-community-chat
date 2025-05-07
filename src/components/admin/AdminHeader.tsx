
import React from 'react';
import { Shield } from 'lucide-react';

const AdminHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
        <Shield className="h-6 w-6" /> Admin Panel
      </h1>
    </div>
  );
};

export default AdminHeader;
