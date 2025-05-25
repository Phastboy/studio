
'use client';

import { useEffect, useState } from 'react';
import { usePostData } from '@/hooks/usePostData';
import { useEventData } from '@/hooks/useEventData';
import { CreatePostForm } from '@/components/social/CreatePostForm';
import { PostCard } from '@/components/social/PostCard';
import { EventsCarousel } from '@/components/event/EventsCarousel';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquareText, AlertTriangle } from 'lucide-react';

export default function FeedPage() {
  const { posts, addPost, deletePost, isLoading: isLoadingPosts } = usePostData();
  const { allEvents, isLoading: isLoadingEvents, isEventSaved, toggleSaveEvent } = useEventData();
  const { toast } = useToast();

  const handleCreatePost = async (data: { author: string; content: string }) => {
    try {
      addPost(data);
      toast({
        title: 'Post Created!',
        description: 'Your post has been added to the feed.',
      });
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
      toast({
        title: 'Post Deleted',
        description: 'The post has been removed from the feed.',
      });
    }
  };
  
  const handleToggleSaveEvent = (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    const nowSaved = toggleSaveEvent(eventId);
    toast({
      title: nowSaved ? 'Event Saved!' : 'Event Unsaved',
      description: `"${event.name}" has been ${nowSaved ? 'added to' : 'removed from'} your calendar.`,
    });
  };


  if (isLoadingPosts || isLoadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="my-6">
        <EventsCarousel events={allEvents} isEventSaved={isEventSaved} onToggleSave={handleToggleSaveEvent} />
      </div>
      
      <CreatePostForm onSubmit={handleCreatePost} />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
          <MessageSquareText className="mr-2 h-6 w-6 text-primary" />
          Timeline
        </h2>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-lg shadow p-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground">The Feed is Empty</h2>
            <p className="text-muted-foreground mt-2">
              Be the first to share something!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
