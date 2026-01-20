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
import { blogService } from '@/services/blog.service';
import { Blog } from '@/types/blog.types';
import { Edit, Eye, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { BlogDialog } from './blog-dialog';

interface BlogsTableProps {
  blogs: Blog[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export function BlogsTable({ blogs, onDelete, onUpdate }: BlogsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await blogService.deleteBlog(deleteId);
      onDelete(deleteId);
      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete blog');
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditBlog(blog);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No blog posts found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div className="relative h-16 w-24 rounded-md overflow-hidden">
                      <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{blog.title}</p>
                        {blog.isFeatured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      {blog.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell>{formatDate(blog.publishedAt)}</TableCell>
                  <TableCell>
                    <Badge variant={blog.isActive ? 'default' : 'secondary'}>
                      {blog.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{blog.viewCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(blog)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(blog.id)}>
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

      <BlogDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={onUpdate}
        blog={editBlog}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
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
