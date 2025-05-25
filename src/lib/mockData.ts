
import type { Event, EventLink } from '@/types/event';
import type { Post } from '@/types/post';
import type { User } from '@/types/user';
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
  },
  {
    id: 'post-2',
    author: mockUsers[1].displayName, // Bob The Builder
    content: 'The Tech Innovators Summit looks amazing. The speaker lineup is incredible. Definitely registering for this one. #Tech #Innovation',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: 'post-3',
    author: mockUsers[2].displayName, // Charlie Brown
    content: 'Just visited the new cafe downtown. Great coffee and pastries! Perfect spot for a weekend brunch. ☕️🥐',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
  },
  {
    id: 'post-4',
    author: 'Guest User',
    content: 'Anyone know if the Food Truck Rally is pet-friendly? Thinking of bringing my dog. 🐕',
    createdAt: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
  },
];
