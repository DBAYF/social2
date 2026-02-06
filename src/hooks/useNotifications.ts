// Stub for in-app notifications
// In production, this would subscribe to a notifications collection
export function useNotifications() {
  return {
    notifications: [],
    isLoading: false,
    load: async () => {},
    markRead: async (_id: string) => {},
  };
}
