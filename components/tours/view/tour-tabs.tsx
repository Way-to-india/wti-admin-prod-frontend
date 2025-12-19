import { Tour } from '@/services/tour.service';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './tabs/overview-tab';
import { DetailsTab } from './tabs/details-tab';
import { ItineraryTab } from './tabs/itinerary-tab';
import { InclusionsTab } from './tabs/inclusions-tab';
import { SeoTab } from './tabs/seo-tab';
import { LocationsTab } from './tabs/locations-tab';

interface TourTabsProps {
  tour: Tour;
}

export function TourTabs({ tour }: TourTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-2 lg:grid-cols-6">
        <TabsTrigger className="cursor-pointer" value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="details">
          Details
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="itinerary">
          Itinerary
          {tour.itinerary && tour.itinerary.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {tour.itinerary.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="inclusions">
          Inclusions
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="seo">
          SEO
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="locations">
          Locations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab tour={tour} />
      </TabsContent>

      <TabsContent value="details">
        <DetailsTab tour={tour} />
      </TabsContent>

      <TabsContent value="itinerary">
        <ItineraryTab tour={tour} />
      </TabsContent>

      <TabsContent value="inclusions">
        <InclusionsTab tour={tour} />
      </TabsContent>

      <TabsContent value="seo">
        <SeoTab tour={tour} />
      </TabsContent>

      <TabsContent value="locations">
        <LocationsTab tour={tour} />
      </TabsContent>
    </Tabs>
  );
}
