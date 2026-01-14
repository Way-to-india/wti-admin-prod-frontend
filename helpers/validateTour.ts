import { TourFormData } from '@/hooks/useTourFrom';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateTourForm(formData: TourFormData): ValidationResult {
  const errors: string[] = [];

  // Basic Info validation
  if (!formData.title.trim()) errors.push('Tour title is required');
  if (!formData.slug.trim()) errors.push('URL slug is required');
  if (!formData.startCityId) errors.push('Starting city is required');
  if (formData.durationDays < 1) errors.push('Duration must be at least 1 day');

  // Content validation
  if (!formData.overview.trim()) errors.push('Tour overview is required');
  if (!formData.description.trim()) errors.push('Tour description is required');
  if (formData.highlights.length === 0) errors.push('Add at least one highlight');
  if (formData.highlights.some((h) => !h.trim())) {
    errors.push('All highlights must have content');
  }

  // Itinerary validation
  if (formData.itinerary.length === 0) {
    errors.push('Add at least one day to the itinerary');
  } else {
    formData.itinerary.forEach((day, index) => {
      if (!day.title.trim()) errors.push(`Day ${index + 1}: Title is required`);
      if (!day.description.trim()) {
        errors.push(`Day ${index + 1}: Description is required`);
      }
    });
  }

  // Images validation
  if (!formData.coverImage) errors.push('Cover image is required');

  // FAQs validation
  if (formData.faqs.length > 0) {
    formData.faqs.forEach((faq, index) => {
      if (!faq.question.trim()) errors.push(`FAQ ${index + 1}: Question is required`);
      if (!faq.answer.trim()) errors.push(`FAQ ${index + 1}: Answer is required`);
    });
  }

  // Pricing validation
  if (formData.price <= 0) errors.push('Price must be greater than 0');
  if (formData.discountPrice > 0 && formData.discountPrice >= formData.price) {
    errors.push('Discount price must be less than regular price');
  }
  if (formData.minGroupSize < 1) errors.push('Minimum group size must be at least 1');
  if (formData.maxGroupSize < formData.minGroupSize) {
    errors.push('Maximum group size must be greater than minimum group size');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export type TabStatus = 'complete' | 'incomplete' | 'empty';

export function getTabStatus(tab: string, formData: TourFormData): TabStatus {
  switch (tab) {
    case 'basic':
      if (formData.title && formData.slug && formData.startCityId) return 'complete';
      if (formData.title || formData.slug || formData.startCityId) return 'incomplete';
      return 'empty';

    case 'content':
      if (formData.overview && formData.description && formData.highlights.length > 0) {
        return 'complete';
      }
      if (formData.overview || formData.description || formData.highlights.length > 0) {
        return 'incomplete';
      }
      return 'empty';

    case 'itinerary':
      if (formData.itinerary.length > 0) return 'complete';
      return 'empty';

    case 'images':
      if (formData.coverImage) return 'complete';
      if (formData.images.length > 0) return 'incomplete';
      return 'empty';

    case 'details':
      if (formData.inclusions.length > 0 || formData.exclusions.length > 0) {
        return 'incomplete';
      }
      return 'empty';

    case 'faqs':
      if (
        formData.faqs.length > 0 &&
        formData.faqs.every((f) => f.question.trim() && f.answer.trim())
      ) {
        return 'complete';
      }
      if (formData.faqs.length > 0) return 'incomplete';
      return 'empty';

    case 'pricing':
      if (formData.price > 0) return 'complete';
      return 'empty';

    case 'settings':
      return 'empty';

    default:
      return 'empty';
  }
}
