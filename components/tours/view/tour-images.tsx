import { Tour } from '@/services/tour.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';

interface TourImagesProps {
  tour: Tour;
}

export function TourImages({ tour }: TourImagesProps) {
  if (!tour.images || tour.images.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Tour Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {tour.images.map((img, idx) => (
            <div key={idx} className="relative h-48 overflow-hidden rounded-lg border">
              <Image
                src={img}
                alt={`${tour.title} - Image ${idx + 1}`}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
