'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ReadMoreContainerProps {
  children: React.ReactNode;
  maxHeight?: number; 
  className?: string;
  expandText?: string;
  collapseText?: string;
}

export function ReadMoreContainer({
  children,
  maxHeight = 200,
  className,
  expandText = 'Read More',
  collapseText = 'Show Less',
}: ReadMoreContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Check if content height exceeds maxHeight
      if (contentRef.current.scrollHeight > maxHeight) {
        setShouldShowButton(true);
      } else {
        setShouldShowButton(false);
      }
    }
  }, [children, maxHeight]);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={contentRef}
        className={cn('transition-all duration-300 ease-in-out', !isExpanded && 'overflow-hidden')}
        style={{
          maxHeight: isExpanded ? undefined : `${maxHeight}px`,
        }}
      >
        {children}
      </div>

      {!isExpanded && shouldShowButton && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent" />
      )}

      {shouldShowButton && (
        <div className="mt-2 text-center">
          {/* Using a simple text/link style or button as per design preference. 
                Button variant="link" or "ghost" is usually good. */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 h-auto py-1 font-semibold"
          >
            {isExpanded ? (
              <>
                {collapseText} <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                {expandText} <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
