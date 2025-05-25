
'use client';

import { useState } from 'react';
import type { Post } from '@/types/post';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { UserCircle, Trash2, MessageSquare, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { CommentForm } from '@/components/comment/CommentForm';
import { CommentsList } from '@/components/comment/CommentsList';
import { useCommentData } from '@/hooks/useCommentData';
import { usePostData } from '@/hooks/usePostData'; // For liking
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void; // onDelete is now optional from usePostData perspective
}

export function PostCard({ post, onDelete: onDeleteProp }: PostCardProps) {
  const { author, content, createdAt, id, likeCount } = post;
  const [showComments, setShowComments] = useState(false);
  const { getCommentsByPostId } = useCommentData();
  const { toggleLikePost, isPostLiked, deletePost: deletePostFromHook } = usePostData();
  
  const commentsForThisPost = getCommentsByPostId(id);
  const commentCount = commentsForThisPost.length;

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const authorInitials = author.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  const currentlyLiked = isPostLiked(id);

  const handleDelete = () => {
    if (onDeleteProp) { // Prefer prop if provided (e.g., for profile page specific logic)
      onDeleteProp(id);
    } else if (deletePostFromHook) { // Fallback to hook's delete
      deletePostFromHook(id);
    }
  };
  
  const postHasDeleteHandler = !!onDeleteProp || !!deletePostFromHook;


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
          <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleLikePost(id)}
                className={cn(
                  "text-muted-foreground hover:text-primary p-1.5 h-auto",
                  currentlyLiked && "text-primary hover:text-primary/80"
                )}
            >
                <Heart className={cn("h-4 w-4 mr-1.5", currentlyLiked && "fill-primary")} />
                {likeCount} Like{likeCount !== 1 ? 's' : ''}
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowComments(!showComments)} 
                className="text-muted-foreground hover:text-primary p-1.5 h-auto"
            >
                <MessageSquare className="h-4 w-4 mr-1.5" />
                {commentCount} Comment{commentCount !== 1 ? 's' : ''}
                {showComments ? ' (Hide)' : ''}
            </Button>
          </div>
            {postHasDeleteHandler && (
                <Button variant="ghost" size="sm" onClick={handleDelete} className="text-muted-foreground hover:text-destructive p-1.5 h-auto">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
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
