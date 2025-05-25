export interface EventLink {
  label: string;
  url: string;
}

export interface Event {
  id: string;
  name: string;
  date: string; // Store as ISO string (YYYY-MM-DD)
  time: string; // Store as HH:MM
  location: string;
  category: string;
  description: string;
  links?: EventLink[];
  createdAt: number; // Timestamp for sorting
}

export const EventCategories = [
  "Music",
  "Art & Culture",
  "Tech",
  "Food & Drink",
  "Workshop",
  "Community",
  "Sports & Fitness",
  "Networking",
  "Charity & Causes",
  "Other",
] as const;

export type EventCategory = (typeof EventCategories)[number];
