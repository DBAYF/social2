import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns';

export function formatDate(date: Date | number): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateTime(date: Date | number): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}

export function formatTime(date: Date | number): string {
  return format(new Date(date), 'h:mm a');
}

export function formatRelativeTime(date: Date | number): string {
  const d = new Date(date);
  
  if (isToday(d)) {
    return formatDistanceToNow(d, { addSuffix: true });
  }
  
  if (isYesterday(d)) {
    return `Yesterday at ${formatTime(d)}`;
  }
  
  if (isThisWeek(d)) {
    return format(d, 'EEEE');
  }
  
  return formatDate(d);
}

export function formatMessageTime(date: Date | number): string {
  const d = new Date(date);
  
  if (isToday(d)) {
    return formatTime(d);
  }
  
  if (isYesterday(d)) {
    return 'Yesterday';
  }
  
  if (isThisWeek(d)) {
    return format(d, 'EEE');
  }
  
  return format(d, 'MMM d');
}
