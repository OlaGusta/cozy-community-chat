
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

/**
 * Format timestamp for chat messages
 * @param date The date to format
 * @returns Formatted string like "14:30" for today, "Mån" for this week, or "15 maj" for older
 */
export const formatMessageTime = (date: Date): string => {
  try {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const day = 24 * 60 * 60 * 1000;
    
    if (diffMs < day) {
      return format(date, 'HH:mm', { locale: sv });
    } else if (diffMs < 7 * day) {
      return format(date, 'EEE', { locale: sv });
    } else {
      return format(date, 'd MMM', { locale: sv });
    }
  } catch (error) {
    console.error('Error formatting message time:', error);
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  }
};

/**
 * Format full date time
 * @param date The date to format
 * @returns Formatted string like "15 maj 2025 14:30"
 */
export const formatFullDateTime = (date: Date): string => {
  try {
    return format(date, 'd MMM yyyy HH:mm', { locale: sv });
  } catch (error) {
    console.error('Error formatting full date time:', error);
    return date.toLocaleString('sv-SE');
  }
};
