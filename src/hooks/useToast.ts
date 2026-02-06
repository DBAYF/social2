import { useCallback } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

export function useToast() {
  const { addNotification, removeNotification, clearAll } = useNotificationStore();

  const toast = useCallback(
    (options: {
      title: string;
      message?: string;
      type?: 'success' | 'error' | 'warning' | 'info';
      duration?: number;
    }) => {
      addNotification({
        type: options.type || 'info',
        title: options.title,
        message: options.message,
        duration: options.duration,
      });
    },
    [addNotification]
  );

  const success = useCallback(
    (title: string, message?: string) => toast({ title, message, type: 'success' }),
    [toast]
  );

  const error = useCallback(
    (title: string, message?: string) => toast({ title, message, type: 'error' }),
    [toast]
  );

  const warning = useCallback(
    (title: string, message?: string) => toast({ title, message, type: 'warning' }),
    [toast]
  );

  const info = useCallback(
    (title: string, message?: string) => toast({ title, message, type: 'info' }),
    [toast]
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss: removeNotification,
    dismissAll: clearAll,
  };
}
