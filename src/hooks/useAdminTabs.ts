
import { useState } from 'react';

type AdminTab = 'users' | 'chats' | 'messages';

export function useAdminTabs() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  return {
    activeTab,
    setActiveTab,
  };
}

export default useAdminTabs;
