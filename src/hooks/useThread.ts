import { useState, useCallback, useEffect } from 'react';
import {
  getThreadMessages,
  sendMessage,
  markMessageRead,
  subscribeToThreadMessages,
} from '@/services/api/messages';
import { useToast } from './useToast';
import type { Message } from '@/types';

export function useThread(threadId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error } = useToast();

  useEffect(() => {
    if (!threadId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    getThreadMessages(threadId)
      .then(setMessages)
      .catch((err) => error('Failed to load messages', err.message))
      .finally(() => setIsLoading(false));

    // Subscribe to new messages
    const unsubscribe = subscribeToThreadMessages(threadId, (newMessages) => {
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [threadId, error]);

  const send = useCallback(async (content: string) => {
    if (!threadId) return;
    
    try {
      await sendMessage(threadId, content);
    } catch (err: any) {
      error('Failed to send message', err.message);
      throw err;
    }
  }, [threadId, error]);

  const markRead = useCallback(async (messageId: string) => {
    if (!threadId) return;
    
    try {
      await markMessageRead(threadId, messageId);
    } catch (err: any) {
      // Silent fail for read receipts
      console.error('Failed to mark message read', err);
    }
  }, [threadId]);

  return {
    messages,
    isLoading,
    sendMessage: send,
    markRead,
  };
}
