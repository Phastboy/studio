import type { Event } from '@/types/event';

const EVENTS_STORAGE_KEY = 'eventide_events';
const SAVED_EVENTS_STORAGE_KEY = 'eventide_saved_event_ids';

export const getEventsFromStorage = (): Event[] => {
  if (typeof window === 'undefined') return [];
  const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
  return storedEvents ? JSON.parse(storedEvents) : [];
};

export const saveEventsToStorage = (events: Event[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
};

export const addEventToStorage = (event: Event): Event[] => {
  const events = getEventsFromStorage();
  const updatedEvents = [event, ...events];
  saveEventsToStorage(updatedEvents);
  return updatedEvents;
};

export const updateEventInStorage = (updatedEvent: Event): Event[] => {
  let events = getEventsFromStorage();
  events = events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
  saveEventsToStorage(events);
  return events;
};

export const deleteEventFromStorage = (eventId: string): Event[] => {
  let events = getEventsFromStorage();
  events = events.filter(event => event.id !== eventId);
  saveEventsToStorage(events);
  return events;
};


export const getSavedEventIdsFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  const storedIds = localStorage.getItem(SAVED_EVENTS_STORAGE_KEY);
  return storedIds ? JSON.parse(storedIds) : [];
};

export const saveSavedEventIdsToStorage = (ids: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SAVED_EVENTS_STORAGE_KEY, JSON.stringify(ids));
};

export const addSavedEventIdToStorage = (eventId: string): string[] => {
  const ids = getSavedEventIdsFromStorage();
  if (!ids.includes(eventId)) {
    const updatedIds = [...ids, eventId];
    saveSavedEventIdsToStorage(updatedIds);
    return updatedIds;
  }
  return ids;
};

export const removeSavedEventIdFromStorage = (eventId: string): string[] => {
  let ids = getSavedEventIdsFromStorage();
  ids = ids.filter(id => id !== eventId);
  saveSavedEventIdsToStorage(ids);
  return ids;
};
