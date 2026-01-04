'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Eye, Edit, Trash2, Star, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tourService } from '@/services/tour.service';
import { toast } from 'sonner';
import Image from 'next/image';
import { Tour } from '@/types/tour.types';

interface ToursTableProps {
  tours: Tour[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export function ToursTable({ tours, onDelete, onUpdate }: ToursTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await tourService.deleteTour(deleteId);
      toast.success('Tour deleted successfully');
      onDelete(deleteId);
      setDeleteId(null);
    } catch (error) {
      if (isAxiosError(error)) toast.error(error.response?.data.message || 'Failed to delete tour');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await tourService.toggleTourStatus(id, !currentStatus);
      toast.success(`Tour ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      onUpdate();
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to update tour status');
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-15">Image</TableHead>
              <TableHead className="min-w-50">Title</TableHead>
              <TableHead className="w-25">Duration</TableHead>
              <TableHead className="w-30">Price</TableHead>
              <TableHead className="w-25">Rating</TableHead>
              <TableHead className="w-30">Location</TableHead>
              <TableHead className="w-25">Status</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No tours found
                </TableCell>
              </TableRow>
            ) : (
              tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>
                    {tour.images[0] ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-md">
                        <Image
                          src={tour.images[0]}
                          alt={tour.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium line-clamp-1">{tour.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {tour.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap text-sm">
                      {tour.durationDays}D / {tour.durationNights}N
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-sm whitespace-nowrap">
                        {formatCurrency(tour.price, tour.currency)}
                      </span>
                      {tour.discountPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(tour.discountPrice, tour.currency)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{tour.rating}</span>
                      <span className="text-xs text-muted-foreground">({tour.reviewCount})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tour.startCity ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm line-clamp-1">{tour.startCity.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={tour.isActive ? 'default' : 'secondary'} className="w-fit">
                        {tour.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {tour.isFeatured && (
                        <Badge variant="outline" className="w-fit text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/tours/${tour.id}`)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/tours/${tour.id}/edit`)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(tour.id, tour.isActive)}
                          className="cursor-pointer"
                        >
                          {tour.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => setDeleteId(tour.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tour and all its
              related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
