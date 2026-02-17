import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm font-button text-sm font-medium hover:bg-secondary hover:text-secondary-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-highlight/12 data-[state=on]:text-highlight [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-secondary hover:text-secondary-foreground",
        calc: "bg-transparent rounded-sm border border-t-[#555] border-l-[#555] border-b-[#222] border-r-[#222] shadow-[1px_1px_0px_#111,inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-75 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] active:translate-y-px",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
