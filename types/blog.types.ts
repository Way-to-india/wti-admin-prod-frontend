export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author: string;
  imageKey: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string | null;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  order: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  publishedAt?: string;
  image: File;
}

export interface UpdateBlogData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  publishedAt?: string;
  image?: File;
}
