import { ReadMoreContainer } from '@/components/common/read-more-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tour } from '@/types/tour.types';
import Image from 'next/image';

interface ItineraryTabProps {
  tour: Tour;
}

interface ItineraryDayProps {
  day: {
    id?: string;
    day: number;
    title: string;
    description: string;
    imageUrl?: string;
  };
  isLast: boolean;
}

function ItineraryDay({ day, isLast }: ItineraryDayProps) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          {day.day}
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-bold">{day.title}</h3>
          <ReadMoreContainer maxHeight={150}>
            <div
              className="prose prose-sm max-w-none prose-p:mb-4 prose-p:min-h-[1.5em] prose-p:leading-7 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-blockquote:text-foreground prose-li:text-foreground [&_p:empty]:min-h-[1.5em] [&_p:empty]:mb-4"
              dangerouslySetInnerHTML={{ __html: day.description }}
            />
          </ReadMoreContainer>
          {day.imageUrl && (
            <div className="relative mt-4 h-64 w-full overflow-hidden rounded-lg border">
              <Image src={day.imageUrl} alt={day.title} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
      {!isLast && <Separator className="my-6" />}
    </div>
  );
}

export function ItineraryTab({ tour }: ItineraryTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Day-wise Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        {tour.itinerary && tour.itinerary.length > 0 ? (
          <div className="space-y-6">
            {tour.itinerary.map((day, idx) => (
              <ItineraryDay
                key={day.id || idx}
                day={day}
                isLast={idx === tour.itinerary!.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No itinerary available for this tour
          </div>
        )}
      </CardContent>
    </Card>
  );
}
