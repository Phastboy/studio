
'use client';

import { useState } from 'react';
import type { Comment } from '@/types/comment';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { UserCircle, Trash2, MessageSquareReply, CornerDownRight } from 'lucide-react';
import { useCommentData } from '@/hooks/useCommentData';
import { useToast } from '@/hooks/use-toast';
import { CommentForm } from './CommentForm';
import { CommentsList } from './CommentsList'; // For rendering replies

interface CommentCardProps {
  comment: Comment;
  postId: string;
  isReply?: boolean; // To slightly indent replies
}

export function CommentCard({ comment, postId, isReply = false }: CommentCardProps) {
  const { author, content, createdAt, id, parentId } = comment;
  const { deleteComment } = useCommentData();
  const { toast } = useToast();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const authorInitials = author.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment and all its replies?')) {
      deleteComment(id);
      toast({
        title: 'Comment Deleted',
        description: 'The comment has been removed.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className={cn('flex space-x-3 py-3', isReply ? 'pl-6' : '')}>
      {isReply && <CornerDownRight className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
          {authorInitials || <UserCircle />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-sm">{author}</span>
            <span className="text-xs text-muted-foreground ml-2">{timeAgo}</span>
          </div>
           <Button variant="ghost" size="iconSm" onClick={handleDelete} className="text-muted-foreground hover:text-destructive h-7 w-7">
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Delete comment</span>
            </Button>
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{content}</p>
        <Button 
            variant="ghost" 
            size="xs" 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs text-muted-foreground hover:text-accent-foreground p-1 h-auto"
        >
          <MessageSquareReply className="h-3.5 w-3.5 mr-1" />
          Reply
        </Button>

        {showReplyForm && (
          <div className="mt-2 pl-4 border-l-2 border-muted/50">
            <CommentForm
              postId={postId}
              parentId={id}
              onCommentAdded={() => setShowReplyForm(false)}
              placeholder={`Replying to ${author}...`}
              submitButtonText="Post Reply"
            />
          </div>
        )}
        
        {/* Recursively render replies for this comment */}
        <div className="mt-2">
            <CommentsList postId={postId} parentId={id} isReplyList={true}/>
        </div>
      </div>
    </div>
  );
}
