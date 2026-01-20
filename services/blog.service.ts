import { apiClient } from '@/lib/api-client';
import { CreateBlogData, Blog, UpdateBlogData } from '@/types/blog.types';

export interface BlogsResponse {
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const blogService = {
  
  async getAllBlogs(filters: BlogFilters = {}): Promise<BlogsResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClient.get<BlogsResponse>(
      `/admin/blogs?${params.toString()}`
    );

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch blogs');
  },

  async getBlogById(id: string): Promise<Blog> {
    const response = await apiClient.get<Blog>(`/admin/blogs/view/${id}`);

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to fetch blog');
  },

  async createBlog(data: CreateBlogData): Promise<Blog> {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('slug', data.slug);
    formData.append('image', data.image);

    if (data.excerpt) formData.append('excerpt', data.excerpt);
    if (data.content) formData.append('content', data.content);
    if (data.author) formData.append('author', data.author);
    if (data.ctaText) formData.append('ctaText', data.ctaText);
    if (data.ctaLink) formData.append('ctaLink', data.ctaLink);
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
    if (data.isFeatured !== undefined) formData.append('isFeatured', data.isFeatured.toString());
    if (data.order !== undefined) formData.append('order', data.order.toString());
    if (data.publishedAt) formData.append('publishedAt', data.publishedAt);

    const response = await apiClient.post<Blog>('/admin/blogs/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to create blog');
  },

  async updateBlog(id: string, data: UpdateBlogData): Promise<Blog> {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.slug) formData.append('slug', data.slug);
    if (data.excerpt !== undefined) formData.append('excerpt', data.excerpt || '');
    if (data.content !== undefined) formData.append('content', data.content || '');
    if (data.author) formData.append('author', data.author);
    if (data.ctaText) formData.append('ctaText', data.ctaText);
    if (data.ctaLink !== undefined) formData.append('ctaLink', data.ctaLink || '');
    if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
    if (data.isFeatured !== undefined) formData.append('isFeatured', data.isFeatured.toString());
    if (data.order !== undefined) formData.append('order', data.order.toString());
    if (data.publishedAt) formData.append('publishedAt', data.publishedAt);
    if (data.image) formData.append('image', data.image);

    const response = await apiClient.put<Blog>(`/admin/blogs/edit/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to update blog');
  },

  async deleteBlog(id: string): Promise<void> {
    const response = await apiClient.delete(`/admin/blogs/delete/${id}`);

    if (!response.status) {
      throw new Error(response.message || 'Failed to delete blog');
    }
  },

  async reorderBlogs(blogs: Array<{ id: string; order: number }>): Promise<Blog[]> {
    const response = await apiClient.patch<Blog[]>('/admin/blogs/reorder', { blogs });

    if (response.status && response.payload) {
      return response.payload;
    }

    throw new Error(response.message || 'Failed to reorder blogs');
  },
};
