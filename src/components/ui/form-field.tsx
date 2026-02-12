import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormFieldProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string | null;
  wrapperClassName?: string;
}

export function FormField({ label, error, wrapperClassName, className, id, ...props }: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      <Label htmlFor={fieldId} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={fieldId}
        className={cn(error && "border-destructive", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
