import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Input, inputVariants } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FormFieldProps = Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants> & {
  label: string;
  error?: string | null;
  wrapperClassName?: string;
}

export function FormField({ label, error, wrapperClassName, className, id, size = "lg", surface, ...props }: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      <Label htmlFor={fieldId} className="text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <Input
        id={fieldId}
        size={size}
        surface={surface}
        className={cn(error && "border-destructive", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
