'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tourService, Tour } from '@/services/tour.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Calendar,
  Users,
  Star,
  IndianRupee,
  Loader2,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Globe,
  FileText,
  Info,
  Image as ImageIcon,
} from 'lucide-react';
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="w-fit">
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

          {/* Title Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold md:text-3xl">{tour.title}</h1>
                    <Badge variant={tour.isActive ? 'default' : 'secondary'}>
                      {tour.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {tour.isFeatured && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Slug: {tour.slug}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <div className="flex items-center gap-2 rounded-lg p-3">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold text-sm">
                      {tour.durationDays}D/{tour.durationNights}N
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg p-3">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-semibold text-sm">₹{tour.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg p-3">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="font-semibold text-sm">{Number(tour.rating).toFixed(1)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg p-3">
                  <Users className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Group Size</p>
                    <p className="font-semibold text-sm">
                      {tour.minGroupSize}-{tour.maxGroupSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg p-3">
                  <Eye className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Views</p>
                    <p className="font-semibold text-sm">{tour.viewCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg p-3">
                  <ShoppingCart className="h-4 w-4 text-pink-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                    <p className="font-semibold text-sm">{tour.bookingCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Gallery */}
          {tour.images && tour.images.length > 0 && (
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
          )}

          {/* Main Tabs */}
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

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 cursor-pointer">
              {tour.overview && (
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose max-w-none prose-headings:text-foreground prose-p:text-foreground"
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
                      className="prose max-w-none prose-headings:text-foreground prose-p:text-foreground"
                      dangerouslySetInnerHTML={{ __html: tour.description }}
                    />
                  </CardContent>
                </Card>
              )}

              {tour.highlights && tour.highlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Tour Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      {tour.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                          <span className="text-sm">{h}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Tour Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Best Time to Visit
                          </p>
                          <p className="mt-1 font-medium">{tour.bestTime || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="mt-1 h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Ideal For</p>
                          <p className="mt-1 font-medium">{tour.idealFor || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <TrendingUp className="mt-1 h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Difficulty Level
                          </p>
                          <p className="mt-1 font-medium">{tour.difficulty || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Start City</p>
                          <p className="mt-1 font-medium">
                            {tour.startCity?.name || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <IndianRupee className="mt-1 h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">Currency</p>
                          <p className="mt-1 font-medium">{tour.currency}</p>
                        </div>
                      </div>

                      {tour.discountPrice && tour.discountPrice > 0 && (
                        <div className="flex items-start gap-3">
                          <IndianRupee className="mt-1 h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              Discount Price
                            </p>
                            <p className="mt-1 font-medium">
                              ₹{tour.discountPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
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
                      className="prose max-w-none prose-headings:text-foreground prose-p:text-foreground"
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

            {/* Itinerary Tab */}
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
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                              {day.day}
                            </div>
                            <div className="flex-1">
                              <h3 className="mb-2 text-lg font-bold">{day.title}</h3>
                              <div
                                className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-p:text-foreground"
                                dangerouslySetInnerHTML={{ __html: day.description }}
                              />
                              {day.imageUrl && (
                                <div className="relative mt-4 h-64 w-full overflow-hidden rounded-lg border">
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
                          {idx < tour.itinerary!.length - 1 && <Separator className="my-6" />}
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

            {/* Inclusions Tab */}
            <TabsContent value="inclusions" className="space-y-4">
              {tour.inclusions && tour.inclusions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      What&apos;s Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tour.inclusions.map((inc, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-lg border border-green-100 p-3"
                        >
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                          <span className="text-sm">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {tour.exclusions && tour.exclusions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      What&apos;s Not Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tour.exclusions.map((exc, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-lg border border-red-100 p-3"
                        >
                          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                          <span className="text-sm">{exc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Meta Title</p>
                    <p className="mt-1 rounded-lg border bg-muted p-3">
                      {tour.metatitle || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Meta Description</p>
                    <p className="mt-1 rounded-lg border bg-muted p-3">
                      {tour.metadesc || 'Not set'}
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Review Count</p>
                      <p className="mt-1 rounded-lg border bg-muted p-3">{tour.reviewCount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">View Count</p>
                      <p className="mt-1 rounded-lg border bg-muted p-3">{tour.viewCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-4">
              {tour.themes && tour.themes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Tour Themes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tour.themes.map((t, i) => (
                        <Badge key={i} variant="outline" className="px-3 py-1">
                          {t.theme.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {tour.cities && tour.cities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Cities Covered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {tour.cities.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg border p-3">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{c.city.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {tour.startCity && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Starting Point
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <MapPin className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-semibold">{tour.startCity.name}</p>
                        <p className="text-sm text-muted-foreground">Tour starts from here</p>
                      </div>
                    </div>
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
