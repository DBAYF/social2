import { useState, useCallback } from 'react';
import {
  requestConnection,
  acceptConnection,
  declineConnection,
  blockConnection,
  getUserConnections,
  getPendingConnections,
} from '@/services/api/connections';
import { useToast } from './useToast';
import type { Connection } from '@/types';

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pending, setPending] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const loadConnections = useCallback(async () => {
    setIsLoading(true);
    try {
      const [conns, pend] = await Promise.all([
        getUserConnections(),
        getPendingConnections(),
      ]);
      setConnections(conns);
      setPending(pend);
    } catch (err: any) {
      error('Failed to load connections', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  const request = useCallback(async (otherUserId: string) => {
    try {
      await requestConnection(otherUserId);
      success('Connection request sent');
      await loadConnections();
    } catch (err: any) {
      error('Failed to send request', err.message);
      throw err;
    }
  }, [success, error, loadConnections]);

  const accept = useCallback(async (connectionId: string) => {
    try {
      await acceptConnection(connectionId);
      success('Connection accepted');
      await loadConnections();
    } catch (err: any) {
      error('Failed to accept connection', err.message);
      throw err;
    }
  }, [success, error, loadConnections]);

  const decline = useCallback(async (connectionId: string) => {
    try {
      await declineConnection(connectionId);
      await loadConnections();
    } catch (err: any) {
      error('Failed to decline connection', err.message);
      throw err;
    }
  }, [error, loadConnections]);

  const block = useCallback(async (otherUserId: string) => {
    try {
      await blockConnection(otherUserId);
      success('User blocked');
      await loadConnections();
    } catch (err: any) {
      error('Failed to block user', err.message);
      throw err;
    }
  }, [success, error, loadConnections]);

  return {
    connections,
    pending,
    isLoading,
    loadConnections,
    requestConnection: request,
    acceptConnection: accept,
    declineConnection: decline,
    blockConnection: block,
  };
}
