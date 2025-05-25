
'use client';

import type { ChatConversation, ChatParticipant } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict, format } from 'date-fns';
import { UserCircle } from 'lucide-react';

interface ConversationListItemProps {
  conversation: ChatConversation;
  isActive: boolean;
  currentUserId: string;
  onSelect: (conversationId: string) => void;
}

export function ConversationListItem({
  conversation,
  isActive,
  currentUserId,
  onSelect,
}: ConversationListItemProps) {
  const otherParticipants = conversation.participants.filter(p => p.id !== currentUserId);
  
  let displayName = 'Conversation';
  let avatarFallback = '??';
  let avatarUrl: string | undefined;

  if (otherParticipants.length === 1) {
    displayName = otherParticipants[0].displayName;
    avatarFallback = otherParticipants[0].displayName.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
    avatarUrl = otherParticipants[0].avatarUrl;
  } else if (otherParticipants.length > 1) {
    displayName = otherParticipants.map(p => p.displayName.split(' ')[0]).slice(0, 2).join(', ');
    if (otherParticipants.length > 2) displayName += ` & ${otherParticipants.length - 2} more`;
    avatarFallback = 'G'; // Group
  } else if (conversation.participants.length === 1 && conversation.participants[0].id === currentUserId) {
    displayName = "Notes to self"; // Or your name
    avatarFallback = "Me";
    avatarUrl = conversation.participants[0].avatarUrl;
  }


  const lastMessageText = conversation.lastMessage?.text 
    ? (conversation.lastMessage.text.length > 30 
        ? conversation.lastMessage.text.substring(0, 27) + '...' 
        : conversation.lastMessage.text)
    : 'No messages yet';

  const lastMessageTimestamp = conversation.lastMessageAt
    ? formatDistanceToNowStrict(new Date(conversation.lastMessageAt), { addSuffix: true })
    : '';

  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        isActive && 'bg-accent text-accent-foreground'
      )}
    >
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={avatarUrl} alt={displayName} data-ai-hint="user avatar" />
        <AvatarFallback className="bg-muted text-muted-foreground">
            {avatarFallback || <UserCircle />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <div className="font-medium">{displayName}</div>
        <p className="text-xs text-muted-foreground truncate">{lastMessageText}</p>
      </div>
      {conversation.lastMessageAt && (
        <div className="text-xs text-muted-foreground self-start pt-1">
          {lastMessageTimestamp}
        </div>
      )}
    </button>
  );
}
