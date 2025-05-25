
'use client';

import { useState } from 'react';
import type { Post } from '@/types/post';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { UserCircle, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { CommentForm } from '@/components/comment/CommentForm';
import { CommentsList } from '@/components/comment/CommentsList';
import { useCommentData } from '@/hooks/useCommentData';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { author, content, createdAt, id } = post;
  const [showComments, setShowComments] = useState(false);
  const { getCommentsByPostId } = useCommentData();
  
  const commentsForThisPost = getCommentsByPostId(id);
  const commentCount = commentsForThisPost.length;


  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const authorInitials = author.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <Card className="mb-4 shadow-md" data-ai-hint="social post community">
      <CardHeader className="flex flex-row items-start space-x-3 pb-3">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {authorInitials || <UserCircle />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{author}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{timeAgo}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
       <CardFooter className="flex-col items-start pt-2 pb-3">
        <div className="w-full flex justify-between items-center">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowComments(!showComments)} 
                className="text-muted-foreground hover:text-primary"
            >
                <MessageSquare className="h-4 w-4 mr-2" />
                {commentCount} Comment{commentCount !== 1 ? 's' : ''}
                {showComments ? ' (Hide)' : ' (Show)'}
            </Button>
            {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Post
                </Button>
            )}
        </div>
        {showComments && (
          <div className="w-full mt-3 pt-3 border-t">
            <h4 className="text-sm font-semibold mb-2 text-foreground/80">Comments</h4>
            <CommentForm postId={id} />
            <CommentsList postId={id} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
