
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ChatConversation, ChatMessage } from '@/types/chat';
import type { User } from '@/types/user'; // Assuming User type is used for participants/senders
import {
  getConversationsFromStorage,
  getMessagesForConversationFromStorage,
  addMessageToConversationInStorage,
  findOrCreateConversationInStorage,
} from '@/lib/chatStore';
import { mockUsers } from '@/lib/mockData'; // For sender info and starting new convos

export function useChatData() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Simulate current user - in a real app, this would come from an auth context
  const currentUserId = useMemo(() => (mockUsers.length > 0 ? mockUsers[0].id : 'default-user'), []);

  useEffect(() => {
    const loadedConversations = getConversationsFromStorage();
    setConversations(loadedConversations);
    setIsLoadingConversations(false);
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      setIsLoadingMessages(true);
      const loadedMessages = getMessagesForConversationFromStorage(activeConversationId);
      
      // Denormalize sender info for display
      const messagesWithSender = loadedMessages.map(msg => {
        const sender = mockUsers.find(u => u.id === msg.senderId);
        return sender ? { ...msg, sender: {id: sender.id, displayName: sender.displayName, avatarUrl: sender.avatarUrl }} : msg;
      });

      setMessages(messagesWithSender);
      setIsLoadingMessages(false);
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  const sendMessage = useCallback((conversationId: string, text: string): ChatMessage | null => {
    if (!text.trim()) return null;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId,
      senderId: currentUserId, // Use simulated current user ID
      text,
      timestamp: Date.now(),
    };

    addMessageToConversationInStorage(newMessage);
    
    // Refresh messages for active conversation if it's the one we sent to
    if (conversationId === activeConversationId) {
      const updatedMessagesRaw = getMessagesForConversationFromStorage(conversationId);
      const messagesWithSender = updatedMessagesRaw.map(msg => {
        const sender = mockUsers.find(u => u.id === msg.senderId);
        return sender ? { ...msg, sender: {id: sender.id, displayName: sender.displayName, avatarUrl: sender.avatarUrl }} : msg;
      });
      setMessages(messagesWithSender);
    }
    
    // Refresh conversations to update last message and sort order
    setConversations(getConversationsFromStorage());
    return newMessage;
  }, [currentUserId, activeConversationId]);

  const startConversation = useCallback((otherParticipantId: string): ChatConversation => {
    const conversation = findOrCreateConversationInStorage(currentUserId, otherParticipantId);
    setConversations(getConversationsFromStorage()); // Refresh list
    setActiveConversationId(conversation.id); // Optionally set as active
    return conversation;
  }, [currentUserId]);

  const getConversationById = useCallback((conversationId: string): ChatConversation | undefined => {
    return conversations.find(c => c.id === conversationId);
  }, [conversations]);
  
  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [activeConversationId, conversations]);

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    sendMessage,
    startConversation,
    currentUserId, // Expose for UI to know who "self" is
    getConversationById,
  };
}
