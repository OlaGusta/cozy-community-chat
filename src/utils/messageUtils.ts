
/**
 * Helper utilities for message formatting
 */

/**
 * Format timestamp for messages in a user-friendly way
 */
export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const day = 24 * 60 * 60 * 1000;
  
  if (diff < day) {
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  } else if (diff < 7 * day) {
    const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
    return days[date.getDay()];
  } else {
    const options = { day: 'numeric', month: 'short' } as const;
    return date.toLocaleDateString('sv-SE', options);
  }
};
