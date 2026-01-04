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
import { TravelGuideData } from '@/types/travel-guide.types';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { Edit, Eye, MapPin, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface GuideDataTableProps {
  guideData: TravelGuideData[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
  onEdit?: (data: TravelGuideData) => void;
}

export function GuideDataTable({ guideData, onDelete, onUpdate, onEdit }: GuideDataTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await travelGuideService.deleteGuideData(deleteId);
      toast.success('Guide data deleted successfully');
      onDelete(deleteId);
      setDeleteId(null);
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to delete guide data');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await travelGuideService.toggleGuideDataStatus(id, !currentStatus);
      toast.success(`Guide data ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      onUpdate();
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || 'Failed to update guide data status');
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">City</TableHead>
              <TableHead className="min-w-[150px]">State</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[150px]">Updated</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guideData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No guide data found
                </TableCell>
              </TableRow>
            ) : (
              guideData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{data.city?.name || 'Unknown City'}</span>
                      {data.citySlug && (
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded w-fit">
                          {data.citySlug}
                        </code>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{data.state?.name || 'Unknown State'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={data.isActive ? 'default' : 'secondary'}>
                      {data.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(data.updatedAt), 'MMM dd, yyyy')}
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
                        {onEdit ? (
                          <DropdownMenuItem onClick={() => onEdit(data)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/travel-guide/guide-data/${data.id}`)
                              }
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/travel-guide/guide-data/${data.id}/edit`)
                              }
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(data.id, data.isActive)}
                          className="cursor-pointer"
                        >
                          {data.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => setDeleteId(data.id)}
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
              This action cannot be undone. This will permanently delete the guide data.
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
