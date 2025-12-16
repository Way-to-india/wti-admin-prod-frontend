'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface ToursFilterProps {
  search: string;
  isActive: string;
  isFeatured: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onActiveChange: (value: string) => void;
  onFeaturedChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export function ToursFilter({
  search,
  isActive,
  isFeatured,
  sortBy,
  onSearchChange,
  onActiveChange,
  onFeaturedChange,
  onSortChange,
  onReset,
}: ToursFilterProps) {
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search with prop when reset is triggered
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-2">
      <div className="relative flex-1 md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tours..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={isActive} onValueChange={onActiveChange}>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={isFeatured} onValueChange={onFeaturedChange}>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tours</SelectItem>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Not Featured</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
            <SelectItem value="price-asc">Price Low-High</SelectItem>
            <SelectItem value="price-desc">Price High-Low</SelectItem>
            <SelectItem value="rating-desc">Top Rated</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={onReset}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
