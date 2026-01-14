import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileText, X } from 'lucide-react';

/**
 * Format timestamp to relative time string
 */
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

interface DraftNotificationProps {
  timestamp: string;
  onRestore: () => void;
  onDiscard: () => void;
}

/**
 * Notification component for draft restoration
 * Displays when a saved draft is detected on page load
 */
export function DraftNotification({ timestamp, onRestore, onDiscard }: DraftNotificationProps) {
  const timeAgo = getTimeAgo(timestamp);


  return (
    <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-900 dark:text-blue-100">Draft Found</AlertTitle>
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">
            A draft was saved <strong>{timeAgo}</strong>. Would you like to restore it?
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onRestore}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700"
            >
              Restore Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDiscard}
              className="cursor-pointer border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900"
            >
              <X className="mr-1 h-3 w-3" />
              Discard
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
