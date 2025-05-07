
// Utility functions for date formatting and manipulation

/**
 * Format date for display in a human-readable format
 * @param date The date to format
 * @returns Formatted string like "För X min/tim/dagar sedan"
 */
export const formatDate = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 60) {
    return `För ${diffMins} min sedan`;
  } else if (diffMins < 24 * 60) {
    const hours = Math.floor(diffMins / 60);
    return `För ${hours} tim sedan`;
  } else {
    const days = Math.floor(diffMins / (24 * 60));
    return `För ${days} dag${days > 1 ? 'ar' : ''} sedan`;
  }
};
