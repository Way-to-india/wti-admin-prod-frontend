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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { travelGuideService } from '@/services/travel-guide.service';
import { TravelGuideState } from '@/types/travel-guide.types';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { Edit, MapPin, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface StatesTableProps {
  states: TravelGuideState[];
  onDelete: (id: string) => void;
  onEdit: (state: TravelGuideState) => void;
}

export function StatesTable({ states, onDelete, onEdit }: StatesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await travelGuideService.deleteState(deleteId);
      toast.success('State deleted successfully');
      onDelete(deleteId);
      setDeleteId(null);
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to delete state');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">State Name</TableHead>
              <TableHead className="min-w-[150px]">Slug</TableHead>
              <TableHead className="w-[100px]">Cities</TableHead>
              <TableHead className="w-[120px]">Guide Entries</TableHead>
              <TableHead className="w-[150px]">Created</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {states.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No states found
                </TableCell>
              </TableRow>
            ) : (
              states.map((state) => (
                <TableRow key={state.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/travel-guide/cities?stateId=${state.id}`}
                      className="flex items-center gap-2 hover:underline cursor-pointer"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{state.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{state.slug || '-'}</code>
                  </TableCell>
                  <TableCell>
                    {state.citiesCount && state.citiesCount > 0 ? (
                      <Link href={`/dashboard/travel-guide/cities?stateId=${state.id}`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                          {state.citiesCount}
                        </Badge>
                      </Link>
                    ) : (
                      <Badge variant="secondary">0</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {state.dataCount && state.dataCount > 0 ? (
                      <Link href={`/dashboard/travel-guide/guide-data?stateId=${state.id}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                          {state.dataCount}
                        </Badge>
                      </Link>
                    ) : (
                      <Badge variant="outline">0</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(state.createdAt), 'MMM dd, yyyy')}
                    </span>
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
                        <DropdownMenuItem onClick={() => onEdit(state)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => setDeleteId(state.id)}
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
              This action cannot be undone. This will permanently delete the state and all its
              related cities and guide data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
