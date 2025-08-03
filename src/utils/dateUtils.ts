import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const formatDateRelative = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { 
    addSuffix: true,
    locale: enUS
  });
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
};
