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
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      <Label htmlFor={fieldId} className="text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <Input
        id={fieldId}
        className={cn("h-11 text-base", error && "border-destructive", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
