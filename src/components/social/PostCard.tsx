
'use client';

import type { Post } from '@/types/post';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { UserCircle, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { author, content, createdAt, id } = post;

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const authorInitials = author.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <Card className="mb-4 shadow-sm" data-ai-hint="social post community">
      <CardHeader className="flex flex-row items-start space-x-3 pb-2">
        <Avatar>
          {/* Placeholder for actual user avatar image */}
          {/* <AvatarImage src={`https://placehold.co/40x40.png?text=${authorInitials}`} alt={author} /> */}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {authorInitials || <UserCircle />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{author}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{timeAgo}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
      {onDelete && (
         <CardFooter className="pt-2 pb-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => onDelete(id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
