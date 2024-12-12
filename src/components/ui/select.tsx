import * as React from 'react'

import { cn } from '@/utils/utils'

export interface SelectProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-10 w-full appearance-none rounded-md border border-input bg-background bg-[url(/images/select-arrow.svg)] bg-no-repeat px-3 py-2 pr-8 text-sm ring-offset-background [background-position:calc(100%-8px)_center] [background-size:16px_16px] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </select>
    )
  },
)
Select.displayName = 'Select'

export { Select }
