'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tourService, Tour } from '@/services/tour.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Calendar, Users, Star, IndianRupee, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';

export default function TourViewPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchTour(params.id as string);
    }
  }, [params.id]);

  const fetchTour = async (id: string) => {
    try {
      const data = await tourService.getTourById(id, true);
      console.log('Tour data:', data); // Debug log
      setTour(data);
    } catch (error) {
      console.error('Error fetching tour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Tour not found</h2>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = hasPermission('Tours', 'edit');

  return (
    <ProtectedRoute requiredModule="Tours" requiredAction="view">
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {canEdit && (
              <Button onClick={() => router.push(`/dashboard/tours/${tour.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Tour
              </Button>
            )}
          </div>

          {/* Title & Status */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{tour.title}</h1>
              <Badge variant={tour.isActive ? 'default' : 'secondary'}>
                {tour.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {tour.isFeatured && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{tour.slug}</p>
          </div>

          {/* Quick Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">
                      {tour.durationDays}D/{tour.durationNights}N
                    </p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">₹{tour.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Price</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold">{Number(tour.rating).toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">{tour.reviewCount} Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">
                      {tour.minGroupSize}-{tour.maxGroupSize}
                    </p>
                    <p className="text-sm text-muted-foreground">Group Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Images */}
          {tour.images && tour.images.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {tour.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative h-48 overflow-hidden rounded-lg">
                  <Image
                    src={img}
                    alt={`${tour.title} - Image ${idx + 1}`}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">
                Itinerary
                {tour.itinerary && tour.itinerary.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {tour.itinerary.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {tour.overview && (
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: tour.overview }}
                    />
                  </CardContent>
                </Card>
              )}

              {tour.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: tour.description }}
                    />
                  </CardContent>
                </Card>
              )}

              {tour.highlights && tour.highlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="itinerary">
              <Card>
                <CardHeader>
                  <CardTitle>Day-wise Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  {tour.itinerary && tour.itinerary.length > 0 ? (
                    <div className="space-y-6">
                      {tour.itinerary.map((day, idx) => (
                        <div key={day.id || idx}>
                          <div className="mb-3 flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                              {day.day}
                            </div>
                            <div className="flex-1">
                              <h3 className="mb-1 text-lg font-bold">{day.title}</h3>
                              <div
                                className="prose prose-sm max-w-none text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: day.description }}
                              />
                              {day.imageUrl && (
                                <div className="relative mt-3 h-48 w-full overflow-hidden rounded-lg">
                                  <Image
                                    src={day.imageUrl}
                                    alt={day.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          {idx < tour!.itinerary!.length - 1 && <Separator className="my-6" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted-foreground">
                      No itinerary available for this tour
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inclusions" className="space-y-4">
              {tour.inclusions && tour.inclusions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">✓ Inclusions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 text-green-600">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {tour.exclusions && tour.exclusions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">✗ Exclusions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.exclusions.map((exc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 text-red-600">✗</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tour Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Best Time</p>
                      <p className="mt-1 font-medium">{tour.bestTime || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ideal For</p>
                      <p className="mt-1 font-medium">{tour.idealFor || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                      <p className="mt-1 font-medium">{tour.difficulty || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Start City</p>
                      <p className="mt-1 font-medium">{tour.startCity?.name || '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {tour.travelTips && (
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: tour.travelTips }}
                    />
                  </CardContent>
                </Card>
              )}

              {tour.cancellationPolicy && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cancellation Policy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{tour.cancellationPolicy}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
