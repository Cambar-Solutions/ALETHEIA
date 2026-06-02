'use client';

import { cn } from '@aletheia/frontend-commons';
import * as React from 'react';

/** Label con estética del design system, local al firmas-mf. */
const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<'label'>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-xs font-heading uppercase tracking-widest text-foreground/70',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className,
        )}
        {...props}
      />
    );
  },
);
Label.displayName = 'Label';

export { Label };
