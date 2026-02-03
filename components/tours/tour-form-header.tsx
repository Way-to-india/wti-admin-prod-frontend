import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TourFormHeaderProps {
  title: string;
  subtitle?: string;
  isSubmitting: boolean;
  isSavingDraft?: boolean;
  onSaveDraft?: () => void;
  submitButtonText?: string;
  showDraftButton?: boolean;
}

export function TourFormHeader({
  title,
  subtitle,
  isSubmitting,
  isSavingDraft = false,
  onSaveDraft,
  submitButtonText = 'Save Changes',
  showDraftButton = false,
}: TourFormHeaderProps) {
    
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            className="cursor-pointer"
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        <div className="flex gap-2">
          {showDraftButton && onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSubmitting || isSavingDraft}
              size="lg"
              className="cursor-pointer"
            >
              {isSavingDraft ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </>
              )}
            </Button>
          )}

          <Button className="cursor-pointer" type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {submitButtonText === 'Create Tour' ? 'Creating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {submitButtonText}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
