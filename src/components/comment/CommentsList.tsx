
'use client';

import type { Comment } from '@/types/comment';
import { useCommentData } from '@/hooks/useCommentData';
import { CommentCard } from './CommentCard';
import { useMemo } from 'react';

interface CommentsListProps {
  postId: string;
  parentId?: string | null; // For fetching replies to a specific comment
  isReplyList?: boolean; // To adjust styling for nested lists
}

export function CommentsList({ postId, parentId = null, isReplyList = false }: CommentsListProps) {
  const { getCommentsByPostId, isLoading } = useCommentData();

  const comments = useMemo(() => {
    const allPostComments = getCommentsByPostId(postId);
    return allPostComments.filter(comment => comment.parentId === parentId);
  }, [getCommentsByPostId, postId, parentId]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground py-2">Loading comments...</div>;
  }

  if (comments.length === 0 && !isReplyList) { // Only show "no comments" for top-level
    return null; 
  }
  
  if (comments.length === 0 && isReplyList) { // Don't render anything if no replies
    return null;
  }


  return (
    <div className={cn("space-y-0", isReplyList ? "pt-0" : "pt-2")}>
      {comments.map(comment => (
        <CommentCard key={comment.id} comment={comment} postId={postId} isReply={!!parentId || isReplyList} />
      ))}
    </div>
  );
}
