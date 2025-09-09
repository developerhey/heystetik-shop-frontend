import * as React from "react"
import { cn } from "~/lib/utils"
import type { ComponentPropsWithoutRef, ElementType } from "react"

// Input component with optional icon
type InputWithIconProps = {
  icon: ElementType,
  sizeIcon?: number,
  iconPosition?: "left" | "right"
} & ComponentPropsWithoutRef<typeof Input>

function InputWithIcon({
  icon: Icon,
  sizeIcon = 30,
  iconPosition = "left",
  className,
  ...props
}: InputWithIconProps) {
  return (
    <div className="relative w-full">
      {iconPosition === "left" && (
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2"
          size={sizeIcon}
        />
      )}
      {iconPosition === "right" && (
        <Icon
          className="absolute right-3 top-1/2 -translate-y-1/2"
          sizeIcon={sizeIcon}
        />
      )}
      <Input
        {...props}
        className={cn(
          iconPosition === "left" && "pl-10",
          iconPosition === "right" && "pr-10",
          className
        )}
      />
    </div>
  )
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input, InputWithIcon }
