'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TravelGuideCity, TravelGuideState } from '@/types/travel-guide.types';
import { ArrowUpDown, Search, X } from 'lucide-react';

interface GuideDataFilterProps {
  search: string;
  stateId: string;
  cityId: string;
  isActive: string;
  sortBy: string;
  states: TravelGuideState[];
  cities: TravelGuideCity[];
  onSearchChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onActiveChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export function GuideDataFilter({
  search,
  stateId,
  cityId,
  isActive,
  sortBy,
  states,
  cities,
  onSearchChange,
  onStateChange,
  onCityChange,
  onActiveChange,
  onSortChange,
  onReset,
}: GuideDataFilterProps) {
  const filteredCities =
    stateId !== 'all' ? cities.filter((city) => city.stateId === stateId) : cities;

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex flex-1 gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={stateId} onValueChange={onStateChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={cityId} onValueChange={onCityChange} disabled={stateId === 'all'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {filteredCities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={isActive} onValueChange={onActiveChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onReset} className="w-fit">
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
