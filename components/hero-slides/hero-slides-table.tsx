'use client';

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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { heroSlideService } from '@/services/hero-slide.service';
import { HeroSlide } from '@/types/hero-slide.types';
import { Edit, GripVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { HeroSlideDialog } from './hero-slide-dialog';

interface HeroSlidesTableProps {
  slides: HeroSlide[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export function HeroSlidesTable({ slides, onDelete, onUpdate }: HeroSlidesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await heroSlideService.deleteHeroSlide(deleteId);
      onDelete(deleteId);
      toast.success('Hero slide deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete hero slide');
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditSlide(slide);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-24">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No hero slides found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              slides.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  </TableCell>
                  <TableCell>
                    <div className="relative h-16 w-24 rounded-md overflow-hidden">
                      <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{slide.title}</p>
                      {slide.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {slide.location || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={slide.isActive ? 'default' : 'secondary'}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{slide.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(slide)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(slide.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <HeroSlideDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={onUpdate}
        slide={editSlide}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the hero slide.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
