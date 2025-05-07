
// Utility functions for date formatting and manipulation
import { format, formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

/**
 * Format date for display in a human-readable format
 * @param date The date to format
 * @returns Formatted string like "För X min/tim/dagar sedan"
 */
export const formatDate = (date: Date) => {
  try {
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale: sv
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    
    // Fallback to basic formatting
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
  }
};

/**
 * Format date to a specific format using date-fns
 * @param date The date to format
 * @param formatString The format string to use
 * @returns Formatted string
 */
export const formatToPattern = (date: Date, formatString: string = 'd MMM yyyy HH:mm') => {
  try {
    return format(date, formatString, { locale: sv });
  } catch (error) {
    console.error('Error formatting date with pattern:', error);
    return date.toLocaleString('sv-SE');
  }
};
