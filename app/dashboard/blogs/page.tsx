'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { BlogDialog } from '@/components/blogs/blog-dialog';
import { BlogsTable } from '@/components/blogs/blogs-table';
import { Button } from '@/components/ui/button';
import { blogService } from '@/services/blog.service';
import { Blog } from '@/types/blog.types';
import { BookOpen, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await blogService.getAllBlogs({
        page: 1,
        limit: 50,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      });
      setBlogs(response.blogs);
      setTotal(response.pagination.total);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (id: string) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
    setTotal((prev) => prev - 1);
  };

  return (
    <ProtectedRoute requiredModule="Dashboard" requiredAction="view">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="sticky top-0 z-50 bg-background border-b px-4 py-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-orange-600" />
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Blog Posts</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage blog posts displayed on the website ({total} total)
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} className="w-fit cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Blog Post
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchBlogs} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <BlogsTable blogs={blogs} onDelete={handleDelete} onUpdate={fetchBlogs} />
          </div>
        )}

        <BlogDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={fetchBlogs}
        />
      </div>
    </ProtectedRoute>
  );
}
