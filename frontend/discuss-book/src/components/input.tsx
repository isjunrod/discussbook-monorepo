import * as React from "react"

import { cn } from "@/src/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[3rem] text-[1.4rem] w-full rounded-md border border-input bg-transparent px-3 py-1  shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )} /*  md:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground text-base*/
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
