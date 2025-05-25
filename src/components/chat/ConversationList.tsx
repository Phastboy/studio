
'use client';

import type { ChatConversation } from '@/types/chat';
import { ConversationListItem } from './ConversationListItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface ConversationListProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  currentUserId: string;
  onSelectConversation: (conversationId: string) => void;
  // onStartNewConversation: (participantId: string) => void; // Future use
}

export function ConversationList({
  conversations,
  activeConversationId,
  currentUserId,
  onSelectConversation,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(convo => {
    const otherParticipants = convo.participants.filter(p => p.id !== currentUserId);
    const names = otherParticipants.map(p => p.displayName.toLowerCase()).join(' ');
    return names.includes(searchTerm.toLowerCase()) || 
           (convo.lastMessage?.text || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full border-r bg-card">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Placeholder for "New Chat" button if needed later */}
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((convo) => (
              <ConversationListItem
                key={convo.id}
                conversation={convo}
                isActive={convo.id === activeConversationId}
                currentUserId={currentUserId}
                onSelect={onSelectConversation}
              />
            ))
          ) : (
            <p className="p-4 text-sm text-center text-muted-foreground">
              {searchTerm ? 'No conversations match your search.' : 'No conversations yet.'}
            </p>
          )}
        </nav>
      </ScrollArea>
    </div>
  );
}
