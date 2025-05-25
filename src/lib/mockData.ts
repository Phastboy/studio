
import type { Event, EventLink } from '@/types/event';
import type { Post } from '@/types/post';
import type { User } from '@/types/user';
import type { Comment } from '@/types/comment';
import type { ChatMessage, ChatConversation } from '@/types/chat'; // New import
import { format, subDays, addDays } from 'date-fns';

// --- Mock Users (Conceptual) ---
export const mockUsers: User[] = [
  {
    id: 'user-1',
    displayName: 'Alice Wonderland',
    email: 'alice@example.com',
    avatarUrl: 'https://placehold.co/100x100.png?text=AW',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
  },
  {
    id: 'user-2',
    displayName: 'Bob The Builder',
    email: 'bob@example.com',
    avatarUrl: 'https://placehold.co/100x100.png?text=BB',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
  },
  {
    id: 'user-3',
    displayName: 'Charlie Brown',
    email: 'charlie@example.com',
    avatarUrl: 'https://placehold.co/100x100.png?text=CB',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
  },
];


// --- Mock Events ---
const today = new Date();
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    name: 'Indie Music Fest',
    date: format(addDays(today, 7), 'yyyy-MM-dd'),
    time: '18:00',
    location: 'Downtown Park Amphitheater',
    category: 'Music',
    description: 'Join us for a fantastic evening of live indie music from local bands. Food trucks and craft beer available. A perfect summer night out!',
    links: [
      { label: 'Buy Tickets', url: 'https://example.com/tickets/imf' },
      { label: 'Artist Lineup', url: 'https://example.com/lineup/imf' },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
  },
  {
    id: 'event-2',
    name: 'Tech Innovators Summit',
    date: format(addDays(today, 30), 'yyyy-MM-dd'),
    time: '09:00',
    location: 'Grand Convention Center',
    category: 'Tech',
    description: 'A two-day summit featuring keynote speakers, workshops, and networking opportunities for tech professionals and enthusiasts. Explore the future of technology.',
    links: [
      { label: 'Register Now', url: 'https://example.com/register/techsummit' },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'event-3',
    name: 'Local Art Fair',
    date: format(addDays(today, 14), 'yyyy-MM-dd'),
    time: '10:00',
    location: 'Community Art Gallery',
    category: 'Art & Culture',
    description: 'Discover unique artworks from talented local artists. Paintings, sculptures, photography, and more. Free admission for all.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'event-4',
    name: 'Gourmet Food Truck Rally',
    date: format(addDays(today, 3), 'yyyy-MM-dd'),
    time: '12:00',
    location: 'City Square',
    category: 'Food & Drink',
    description: 'A delicious gathering of the best gourmet food trucks in the city. From tacos to crepes, there\'s something for everyone!',
    links: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
  {
    id: 'event-5',
    name: 'Introduction to Pottery Workshop',
    date: format(addDays(today, 21), 'yyyy-MM-dd'),
    time: '14:00',
    location: 'The Craft Studio',
    category: 'Workshop',
    description: 'Learn the basics of pottery in this hands-on workshop. All materials provided. Suitable for beginners. Limited spots available.',
    links: [{ label: 'Book Your Spot', url: 'https://example.com/pottery-workshop' }],
    createdAt: Date.now(),
  },
   {
    id: 'event-6',
    name: 'Community Charity Run',
    date: format(subDays(today, 2), 'yyyy-MM-dd'), // Past event
    time: '08:00',
    location: 'Riverfront Trail',
    category: 'Charity & Causes',
    description: 'Join our annual 5K charity run to support local causes. A fun event for the whole family. Thank you to all participants!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
];

// --- Mock Posts ---
export const mockPosts: Post[] = [
  {
    id: 'post-1',
    author: mockUsers[0].displayName, // Alice Wonderland
    content: 'So excited for the Indie Music Fest next week! Grabbed my tickets. Who else is going? 🎶 #IndieMusic #LiveConcert',
    createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    likeCount: 15,
  },
  {
    id: 'post-2',
    author: mockUsers[1].displayName, // Bob The Builder
    content: 'The Tech Innovators Summit looks amazing. The speaker lineup is incredible. Definitely registering for this one. #Tech #Innovation',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    likeCount: 8,
  },
  {
    id: 'post-3',
    author: mockUsers[2].displayName, // Charlie Brown
    content: 'Just visited the new cafe downtown. Great coffee and pastries! Perfect spot for a weekend brunch. ☕️🥐',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
    likeCount: 22,
  },
  {
    id: 'post-4',
    author: 'Guest User',
    content: 'Anyone know if the Food Truck Rally is pet-friendly? Thinking of bringing my dog. 🐕',
    createdAt: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    likeCount: 3,
  },
];

// --- Mock Comments ---
export const mockComments: Comment[] = [
  {
    id: 'comment-1-1',
    postId: 'post-1', // Belongs to Alice's Indie Music Fest post
    parentId: null,
    author: mockUsers[1].displayName, // Bob
    content: 'I\'m going! Heard the lineup is sick this year.',
    createdAt: Date.now() - 1000 * 60 * 25, // 25 minutes ago
  },
  {
    id: 'comment-1-2',
    postId: 'post-1',
    parentId: 'comment-1-1', // Reply to Bob's comment
    author: mockUsers[0].displayName, // Alice
    content: 'Awesome! We should meet up.',
    createdAt: Date.now() - 1000 * 60 * 20, // 20 minutes ago
  },
  {
    id: 'comment-1-3',
    postId: 'post-1',
    parentId: null,
    author: mockUsers[2].displayName, // Charlie
    content: 'Wish I could make it, sounds fun!',
    createdAt: Date.now() - 1000 * 60 * 15, // 15 minutes ago
  },
  {
    id: 'comment-1-4',
    postId: 'post-1',
    parentId: 'comment-1-2', // Reply to Alice's reply
    author: mockUsers[1].displayName, // Bob
    content: 'For sure! I\'ll be near the main stage around 7pm.',
    createdAt: Date.now() - 1000 * 60 * 10, // 10 minutes ago
  },
  {
    id: 'comment-2-1',
    postId: 'post-2', // Belongs to Bob's Tech Summit post
    parentId: null,
    author: mockUsers[0].displayName, // Alice
    content: 'Which workshop are you most excited about?',
    createdAt: Date.now() - 1000 * 60 * 60 * 1, // 1 hour ago
  },
];

// --- Mock Chat Data ---
const now = Date.now();
const user1 = mockUsers[0]; // Alice
const user2 = mockUsers[1]; // Bob
const user3 = mockUsers[2]; // Charlie

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'chatmsg-1',
    conversationId: 'convo-1-2', // Alice and Bob
    senderId: user1.id,
    text: 'Hey Bob, are you going to the Indie Music Fest?',
    timestamp: now - 1000 * 60 * 10, // 10 mins ago
  },
  {
    id: 'chatmsg-2',
    conversationId: 'convo-1-2',
    senderId: user2.id,
    text: 'Hey Alice! Yeah, definitely. Already got my ticket!',
    timestamp: now - 1000 * 60 * 9, // 9 mins ago
  },
  {
    id: 'chatmsg-3',
    conversationId: 'convo-1-2',
    senderId: user1.id,
    text: 'Sweet! We should try to meet up.',
    timestamp: now - 1000 * 60 * 8, // 8 mins ago
  },
  {
    id: 'chatmsg-4',
    conversationId: 'convo-1-3', // Alice and Charlie
    senderId: user1.id,
    text: 'Hi Charlie, how\'s it going?',
    timestamp: now - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: 'chatmsg-5',
    conversationId: 'convo-1-3',
    senderId: user3.id,
    text: 'Hey Alice! Doing well, just busy with work. You?',
    timestamp: now - 1000 * 60 * 60 * 1.5, // 1.5 hours ago
  },
  {
    id: 'chatmsg-6',
    conversationId: 'convo-2-3', // Bob and Charlie
    senderId: user2.id,
    text: 'Charlie, did you see the new tools at the hardware store?',
    timestamp: now - 1000 * 60 * 30, // 30 mins ago
  },
];

export const mockChatConversations: ChatConversation[] = [
  {
    id: 'convo-1-2', // Between Alice (user-1) and Bob (user-2)
    participantIds: [user1.id, user2.id],
    participants: [
      { id: user1.id, displayName: user1.displayName, avatarUrl: user1.avatarUrl },
      { id: user2.id, displayName: user2.displayName, avatarUrl: user2.avatarUrl },
    ],
    lastMessage: mockChatMessages[2], // "Sweet! We should try to meet up."
    lastMessageAt: mockChatMessages[2].timestamp,
    createdAt: now - 1000 * 60 * 15, // 15 mins ago
  },
  {
    id: 'convo-1-3', // Between Alice (user-1) and Charlie (user-3)
    participantIds: [user1.id, user3.id],
    participants: [
      { id: user1.id, displayName: user1.displayName, avatarUrl: user1.avatarUrl },
      { id: user3.id, displayName: user3.displayName, avatarUrl: user3.avatarUrl },
    ],
    lastMessage: mockChatMessages[4], // "Hey Alice! Doing well, just busy with work. You?"
    lastMessageAt: mockChatMessages[4].timestamp,
    createdAt: now - 1000 * 60 * 60 * 3, // 3 hours ago
  },
  {
    id: 'convo-2-3', // Between Bob (user-2) and Charlie (user-3)
    participantIds: [user2.id, user3.id],
    participants: [
      { id: user2.id, displayName: user2.displayName, avatarUrl: user2.avatarUrl },
      { id: user3.id, displayName: user3.displayName, avatarUrl: user3.avatarUrl },
    ],
    lastMessage: mockChatMessages[5],
    lastMessageAt: mockChatMessages[5].timestamp,
    createdAt: now - 1000 * 60 * 45, // 45 mins ago
  },
];
