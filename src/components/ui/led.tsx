import { cn } from "@/lib/utils"

function Led({
  color,
  on = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  color: string;
  on?: boolean;
}) {
  return (
    <div
      className={cn(
        "size-2 rounded-[1px] transition-opacity duration-75",
        on ? "opacity-100" : "opacity-20",
        className,
      )}
      style={{
        backgroundColor: color,
        backgroundImage: [
          // radial hotspot — bright center fading to edges
          `radial-gradient(ellipse at 40% 38%, rgba(255,255,255,0.45) 0%, transparent 55%)`,
          // dither grid — horizontal + vertical 1px lines
          `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.25) 1px, rgba(0,0,0,0.25) 2px)`,
          `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.18) 1px, rgba(0,0,0,0.18) 2px)`,
        ].join(', '),
        boxShadow: [
          // outer glow when on
          on ? `0 0 6px ${color}` : '',
          // inset bezel — dark rim + slight inner highlight
          `inset 0 0 0 0.5px rgba(0,0,0,0.6)`,
          `inset 0 0.5px 0 rgba(255,255,255,0.1)`,
        ].filter(Boolean).join(', '),
      }}
      {...props}
    />
  )
}

export { Led }
