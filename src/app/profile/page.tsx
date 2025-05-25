
'use client';

import { mockUsers } from '@/lib/mockData';
import { usePostData } from '@/hooks/usePostData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PostCard } from '@/components/social/PostCard';
import { UserCircle, Mail, CalendarDays, Edit3, MessageSquareText, Loader2, AlertTriangle } from 'lucide-react';
import type { User } from '@/types/user';
import type { Post } from '@/types/post';

export default function UserProfilePage() {
  // For this placeholder, we'll display the first mock user.
  // In a real app, this would come from the authenticated user or a URL parameter.
  const user: User | undefined = mockUsers[0]; 
  const { posts, isLoading: isLoadingPosts, deletePost } = usePostData();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="ml-4 text-lg text-muted-foreground">User data not found.</p>
      </div>
    );
  }

  const userPosts = posts.filter(post => post.author === user.displayName);

  const handleDeletePost = (postId: string) => {
    // This delete function is available if posts are managed through usePostData
    // For a true user profile, we'd ensure only the post owner can delete.
    if (confirm('Are you sure you want to delete this post? This action is a placeholder.')) {
      deletePost(postId); 
      // Add toast notification if desired
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader className="flex flex-col items-center text-center space-y-4 p-6 bg-gradient-to-br from-primary/10 via-background to-background">
          <Avatar className="w-24 h-24 border-4 border-primary shadow-md">
            <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png?text=${user.displayName.substring(0,2)}`} alt={user.displayName} data-ai-hint="profile avatar" />
            <AvatarFallback className="text-3xl bg-primary/20 text-primary">
              {user.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || <UserCircle />}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-bold">{user.displayName}</CardTitle>
            {user.email && (
              <CardDescription className="text-md text-muted-foreground flex items-center justify-center mt-1">
                <Mail className="mr-2 h-4 w-4" /> {user.email}
              </CardDescription>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" /> Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
           {/* Placeholder for Edit Profile button - would require auth */}
          <button className="mt-4 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center opacity-50 cursor-not-allowed" disabled title="Profile editing requires authentication">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Auth Needed)
          </button>
        </CardHeader>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
          <MessageSquareText className="mr-2 h-6 w-6 text-primary" />
          Posts by {user.displayName}
        </h2>
        {isLoadingPosts ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Loading posts...</p>
          </div>
        ) : userPosts.length > 0 ? (
          userPosts.map(post => (
            <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
          ))
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Posts Yet</h3>
              <p className="text-muted-foreground mt-2">
                {user.displayName} hasn't shared any posts.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
