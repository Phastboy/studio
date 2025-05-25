
'use client';

import type { ChatMessage, ChatConversation } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { MessageInputForm } from './MessageInputForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useRef } from 'react';
import { UserCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MessageAreaProps {
  messages: ChatMessage[];
  activeConversation: ChatConversation | null;
  currentUserId: string;
  onSendMessage: (text: string) => void;
  isLoadingMessages: boolean;
}

export function MessageArea({
  messages,
  activeConversation,
  currentUserId,
  onSendMessage,
  isLoadingMessages
}: MessageAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive or conversation changes
    if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, activeConversation]);

  if (!activeConversation) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-background p-8 text-center">
        <Info className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Select a conversation</h2>
        <p className="text-muted-foreground">Choose a conversation from the list to start chatting.</p>
      </div>
    );
  }

  const otherParticipants = activeConversation.participants.filter(p => p.id !== currentUserId);
  let chatPartnerName = 'Conversation';
  if (otherParticipants.length === 1) {
    chatPartnerName = otherParticipants[0].displayName;
  } else if (otherParticipants.length > 1) {
     chatPartnerName = otherParticipants.map(p => p.displayName.split(' ')[0]).join(', ');
  } else if (activeConversation.participants.length === 1 && activeConversation.participants[0].id === currentUserId) {
    chatPartnerName = "Notes to self";
  }


  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center gap-3 border-b p-4">
        <Avatar className="h-10 w-10 border">
           <AvatarImage 
            src={otherParticipants.length === 1 ? otherParticipants[0].avatarUrl : undefined} 
            alt={chatPartnerName} 
            data-ai-hint="user avatar" 
           />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {otherParticipants.length === 1 
              ? (otherParticipants[0].displayName.split(' ').map(n=>n[0]).join('').toUpperCase() || '?') 
              : (chatPartnerName[0] || '?')
            }
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{chatPartnerName}</h2>
          {/* Could add online status or last seen here */}
        </div>
      </header>

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-1" ref={viewportRef}>
          {isLoadingMessages && <p className="text-center text-muted-foreground">Loading messages...</p>}
          {!isLoadingMessages && messages.length === 0 && (
            <Alert className="max-w-md mx-auto my-8">
              <Info className="h-4 w-4" />
              <AlertTitle>No Messages Yet</AlertTitle>
              <AlertDescription>
                Be the first to send a message in this conversation!
              </AlertDescription>
            </Alert>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isSelf={msg.senderId === currentUserId} />
          ))}
        </div>
      </ScrollArea>
      
      <MessageInputForm onSendMessage={onSendMessage} isLoading={isLoadingMessages} />
    </div>
  );
}
