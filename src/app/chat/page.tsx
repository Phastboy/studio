
'use client';

import { useState, useEffect } from 'react';
import { useChatData } from '@/hooks/useChatData';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageArea } from '@/components/chat/MessageArea';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/lib/mockData'; // For starting new conversations

export default function ChatPage() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    sendMessage,
    startConversation,
    currentUserId,
  } = useChatData();

  const [isStartingNewConversation, setIsStartingNewConversation] = useState(false);

  // Automatically select the first conversation if none is active and conversations load
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId, setActiveConversationId]);

  const handleSendMessage = (text: string) => {
    if (activeConversationId) {
      sendMessage(activeConversationId, text);
    }
  };
  
  // Placeholder: allow starting a new conversation with the second mock user if not already chatting
  // In a real app, this would involve a user search/selection UI.
  const handleStartNewMockConversation = () => {
    if (mockUsers.length < 2) {
      alert("Not enough mock users to start a new conversation.");
      return;
    }
    const otherUserId = mockUsers.find(u => u.id !== currentUserId)?.id;
    if (otherUserId) {
      setIsStartingNewConversation(true);
      const newConvo = startConversation(otherUserId);
      setActiveConversationId(newConvo.id);
      setIsStartingNewConversation(false);
    } else {
        alert("Could not find another mock user to chat with.");
    }
  };

  if (isLoadingConversations) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] overflow-hidden bg-card shadow-md rounded-lg border">
      <div className="w-1/3 max-w-xs min-w-[280px] flex-shrink-0">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentUserId={currentUserId}
          onSelectConversation={setActiveConversationId}
        />
         {/* Placeholder: Button to start a new conversation with a mock user */}
        {mockUsers.length > 1 && (
          <div className="p-2 border-t">
            <Button 
              onClick={handleStartNewMockConversation} 
              variant="outline" 
              className="w-full"
              disabled={isStartingNewConversation}
            >
              {isStartingNewConversation ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <MessageSquarePlus className="h-4 w-4 mr-2"/>}
              Chat with {mockUsers.find(u => u.id !== currentUserId)?.displayName || 'Mock User'}
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1">
        <MessageArea
          messages={messages}
          activeConversation={activeConversation}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          isLoadingMessages={isLoadingMessages}
        />
      </div>
    </div>
  );
}
