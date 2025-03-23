
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import DirectMessage from "./pages/DirectMessage";
import Messages from "./pages/Messages";
import Announcements from "./pages/Announcements";
import Members from "./pages/Members";
import ChatRooms from "./pages/ChatRooms";
import AdminPanel from "./pages/AdminPanel";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/chats" element={<ChatRooms />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<DirectMessage />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/members" element={<Members />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
