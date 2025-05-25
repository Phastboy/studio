'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, FilterX } from 'lucide-react';
import { format } from 'date-fns';
import { EventCategories, type EventCategory } from '@/types/event';

export interface Filters {
  keyword: string;
  date: Date | undefined;
  category: EventCategory | 'all';
}

interface EventFiltersProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

export function EventFilters({ filters, setFilters }: EventFiltersProps) {
  
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, keyword: e.target.value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFilters(prev => ({ ...prev, date }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: category as EventCategory | 'all' }));
  };

  const clearFilters = () => {
    setFilters({ keyword: '', date: undefined, category: 'all' });
  };

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Keyword Search */}
        <div className="space-y-1">
          <label htmlFor="keyword-search" className="text-sm font-medium text-muted-foreground">Search Events</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="keyword-search"
              type="text"
              placeholder="Enter keyword..."
              value={filters.keyword}
              onChange={handleKeywordChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date Picker */}
         <div className="space-y-1">
          <label htmlFor="date-filter" className="text-sm font-medium text-muted-foreground">Filter by Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-filter"
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!filters.date ? "text-muted-foreground" : ""}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>


        {/* Category Select */}
        <div className="space-y-1">
          <label htmlFor="category-filter" className="text-sm font-medium text-muted-foreground">Filter by Category</label>
          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EventCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Clear Filters Button */}
        <Button onClick={clearFilters} variant="outline" className="w-full md:w-auto">
          <FilterX className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      </div>
    </div>
  );
}
