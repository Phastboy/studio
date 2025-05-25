'use client';

import type { Event } from '@/types/event';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPinIcon, ClockIcon, TagIcon, LinkIcon, BookmarkPlus, BookmarkCheck, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
  isSaved?: boolean;
  onToggleSave?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  showDelete?: boolean; // To show delete button on calendar page
}

export function EventCard({ event, isSaved, onToggleSave, onDelete, showDelete = false }: EventCardProps) {
  const { name, date, time, location, category, description, links, id } = event;

  const formattedDate = format(parseISO(date), 'EEE, MMM d, yyyy');

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative w-full h-48">
        <Image 
          src={`https://placehold.co/600x400.png?text=${encodeURIComponent(name)}`} 
          alt={name} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint="event concert"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground pt-1">
          <TagIcon className="mr-1.5 h-4 w-4" />
          <span>{category}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-start text-sm">
          <CalendarIcon className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-start text-sm">
          <ClockIcon className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
          <span>{time}</span>
        </div>
        <div className="flex items-start text-sm">
          <MapPinIcon className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
          <span>{location}</span>
        </div>
        <CardDescription className="text-sm line-clamp-3">{description}</CardDescription>
        {links && links.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Links:</h4>
            <ul className="space-y-1">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline flex items-center"
                  >
                    <LinkIcon className="mr-1.5 h-4 w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        {onToggleSave && (
          <Button variant={isSaved ? "secondary" : "default"} onClick={() => onToggleSave(id)} className="w-full">
            {isSaved ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <BookmarkPlus className="mr-2 h-4 w-4" />}
            {isSaved ? 'Saved to Calendar' : 'Save to Calendar'}
          </Button>
        )}
         {showDelete && onDelete && (
          <Button variant="destructive" onClick={() => onDelete(id)} size="sm" className="ml-2">
            <Trash2 className="mr-2 h-4 w-4" /> Remove
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
