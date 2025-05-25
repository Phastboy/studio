
import type { ChatConversation, ChatMessage } from '@/types/chat';
import { mockChatConversations, mockChatMessages, mockUsers } from '@/lib/mockData'; // Import mock data

const CONVERSATIONS_STORAGE_KEY = 'eventide_chat_conversations';
const MESSAGES_STORAGE_KEY_PREFIX = 'eventide_chat_messages_'; // Prefix for per-conversation message storage

// Helper function to get items from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    try {
      return JSON.parse(storedValue) as T;
    } catch (e) {
      console.error(`Failed to parse ${key} from storage, using default.`, e);
      localStorage.removeItem(key); // Clear corrupted data
      return defaultValue;
    }
  }
  return defaultValue;
};

// Helper function to save items to localStorage
const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// --- Conversations Management ---
export const getConversationsFromStorage = (): ChatConversation[] => {
  const conversations = getFromStorage<ChatConversation[]>(CONVERSATIONS_STORAGE_KEY, []);
  if (conversations.length === 0 && mockChatConversations.length > 0) {
    console.log("Local storage for chat conversations is empty, initializing with mock conversations.");
    saveConversationsToStorage(mockChatConversations);
    // Also initialize messages for these mock conversations
    mockChatConversations.forEach(convo => {
      const messagesForConvo = mockChatMessages.filter(msg => msg.conversationId === convo.id);
      if (messagesForConvo.length > 0) {
        saveMessagesForConversationToStorage(convo.id, messagesForConvo);
      }
    });
    return [...mockChatConversations];
  }
  return conversations.sort((a,b) => b.lastMessageAt - a.lastMessageAt);
};

export const saveConversationsToStorage = (conversations: ChatConversation[]): void => {
  saveToStorage(CONVERSATIONS_STORAGE_KEY, conversations);
};

export const addConversationToStorage = (conversation: ChatConversation): ChatConversation[] => {
  const conversations = getConversationsFromStorage();
  const updatedConversations = [conversation, ...conversations];
  saveConversationsToStorage(updatedConversations);
  return updatedConversations;
};

// --- Messages Management ---
// Messages for a specific conversation are stored under a unique key
const getMessagesStorageKey = (conversationId: string) => `${MESSAGES_STORAGE_KEY_PREFIX}${conversationId}`;

export const getMessagesForConversationFromStorage = (conversationId: string): ChatMessage[] => {
  const key = getMessagesStorageKey(conversationId);
  // No mock data initialization here, as messages are tied to specific convos
  // Mock messages for mock convos are handled in getConversationsFromStorage init
  return getFromStorage<ChatMessage[]>(key, []).sort((a,b) => a.timestamp - b.timestamp);
};

export const saveMessagesForConversationToStorage = (conversationId: string, messages: ChatMessage[]): void => {
  const key = getMessagesStorageKey(conversationId);
  saveToStorage(key, messages);
};

export const addMessageToConversationInStorage = (message: ChatMessage): ChatMessage[] => {
  const messages = getMessagesForConversationFromStorage(message.conversationId);
  const updatedMessages = [...messages, message];
  saveMessagesForConversationToStorage(message.conversationId, updatedMessages);

  // Also update the parent conversation's lastMessage and lastMessageAt
  const conversations = getConversationsFromStorage();
  const conversationIndex = conversations.findIndex(c => c.id === message.conversationId);
  if (conversationIndex > -1) {
    const user = mockUsers.find(u => u.id === message.senderId);
    const messageWithSender = user ? {...message, sender: {id: user.id, displayName: user.displayName, avatarUrl: user.avatarUrl}} : message;

    conversations[conversationIndex].lastMessage = messageWithSender;
    conversations[conversationIndex].lastMessageAt = message.timestamp;
    saveConversationsToStorage(conversations); // Save updated conversations list
  }
  return updatedMessages;
};

// Helper to create or find a conversation between two users
export const findOrCreateConversationInStorage = (userId1: string, userId2: string): ChatConversation => {
  const conversations = getConversationsFromStorage();
  let conversation = conversations.find(c => 
    c.participantIds.length === 2 &&
    c.participantIds.includes(userId1) && 
    c.participantIds.includes(userId2)
  );

  if (!conversation) {
    const userDetails1 = mockUsers.find(u => u.id === userId1);
    const userDetails2 = mockUsers.find(u => u.id === userId2);

    if (!userDetails1 || !userDetails2) {
        throw new Error("One or both users not found for creating conversation.");
    }

    const newConversation: ChatConversation = {
      id: `convo-${userId1}-${userId2}-${Date.now()}`, // Simple unique ID
      participantIds: [userId1, userId2],
      participants: [
        { id: userDetails1.id, displayName: userDetails1.displayName, avatarUrl: userDetails1.avatarUrl },
        { id: userDetails2.id, displayName: userDetails2.displayName, avatarUrl: userDetails2.avatarUrl },
      ],
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    };
    addConversationToStorage(newConversation);
    return newConversation;
  }
  return conversation;
};
