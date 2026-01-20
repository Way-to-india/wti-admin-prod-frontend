'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { blogService } from '@/services/blog.service';
import { CreateBlogData, Blog, UpdateBlogData } from '@/types/blog.types';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  blog?: Blog | null;
}

export function BlogDialog({ open, onOpenChange, onSuccess, blog }: BlogDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Way to India',
    ctaText: 'Read More',
    ctaLink: '',
    isActive: true,
    isFeatured: false,
    order: 0,
    publishedAt: new Date().toISOString().split('T')[0],
    image: null as File | null,
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        author: blog.author,
        ctaText: blog.ctaText,
        ctaLink: blog.ctaLink || '',
        isActive: blog.isActive,
        isFeatured: blog.isFeatured,
        order: blog.order,
        publishedAt: new Date(blog.publishedAt).toISOString().split('T')[0],
        image: null,
      });
      setImagePreview(blog.imageUrl);
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: 'Way to India',
        ctaText: 'Read More',
        ctaLink: '',
        isActive: true,
        isFeatured: false,
        order: 0,
        publishedAt: new Date().toISOString().split('T')[0],
        image: null,
      });
      setImagePreview(null);
    }
  }, [blog, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blog && !formData.image) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      if (blog) {
        const updateData: UpdateBlogData = {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          ctaText: formData.ctaText,
          ctaLink: formData.ctaLink,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          order: formData.order,
          publishedAt: formData.publishedAt,
        };
        if (formData.image) {
          updateData.image = formData.image;
        }
        await blogService.updateBlog(blog.id, updateData);
        toast.success('Blog updated successfully');
      } else {
        const createData: CreateBlogData = {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          author: formData.author,
          ctaText: formData.ctaText,
          ctaLink: formData.ctaLink,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          order: formData.order,
          publishedAt: formData.publishedAt,
          image: formData.image!,
        };
        await blogService.createBlog(createData);
        toast.success('Blog created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error((error as Error).message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{blog ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
          <DialogDescription>
            {blog ? 'Update the blog post details' : 'Add a new blog post to display on the website'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Featured Image *</Label>
            <div className="flex flex-col gap-2">
              {imagePreview && (
                <div className="relative h-48 w-full rounded-md overflow-hidden border">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="10 Must-Visit Places in India"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="10-must-visit-places-in-india"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the blog post..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full blog content (HTML supported)..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Way to India"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date</Label>
              <Input
                id="publishedAt"
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Button Text</Label>
              <Input
                id="ctaText"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="Read More"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaLink">Button Link</Label>
              <Input
                id="ctaLink"
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                placeholder="/blog/your-blog-slug"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">
                Featured
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {blog ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
