'use client';

import { cn } from '@aletheia/frontend-commons';
import * as React from 'react';

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-xs font-heading uppercase tracking-widest text-foreground/70', className)}
      {...props}
    />
  ),
);
Label.displayName = 'Label';

export { Label };
