
'use client';

import type { ChatMessage } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { UserCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
}

export function MessageBubble({ message, isSelf }: MessageBubbleProps) {
  const senderName = message.sender?.displayName || 'Unknown User';
  const avatarFallback = message.sender?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const avatarUrl = message.sender?.avatarUrl;

  return (
    <div className={cn('flex items-end gap-2 py-2', isSelf ? 'justify-end' : 'justify-start')}>
      {!isSelf && (
        <Avatar className="h-8 w-8 border self-start">
          <AvatarImage src={avatarUrl} alt={senderName} data-ai-hint="user avatar" />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {avatarFallback || <UserCircle />}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[70%] rounded-xl px-4 py-2.5 shadow-sm',
          isSelf
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground rounded-bl-none border'
        )}
      >
        {!isSelf && <p className="text-xs font-medium mb-0.5 text-muted-foreground">{senderName}</p>}
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className={cn(
            "text-xs mt-1",
            isSelf ? "text-primary-foreground/70 text-right" : "text-muted-foreground/80 text-left"
          )}>
            {format(new Date(message.timestamp), 'p')}
          </p>
      </div>
       {isSelf && (
        <Avatar className="h-8 w-8 border self-start">
          <AvatarImage src={avatarUrl} alt={senderName} data-ai-hint="user avatar" />
          <AvatarFallback className="bg-primary/20 text-primary">
            {avatarFallback || <UserCircle />}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
