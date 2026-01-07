export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  location: string | null;
  duration: string | null;
  imageKey: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHeroSlideData {
  title: string;
  subtitle?: string;
  location?: string;
  duration?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
  order?: number;
  image: File;
}

export interface UpdateHeroSlideData {
  title?: string;
  subtitle?: string;
  location?: string;
  duration?: string;
  ctaText?: string;
  ctaLink?: string;
  isActive?: boolean;
  order?: number;
  image?: File;
}
