import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper border-2 border-ink hover:bg-editorial-red hover:border-editorial-red",
        secondary: "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-paper",
        ghost: "bg-transparent text-ink hover:text-editorial-red border-none",
        destructive: "bg-editorial-red text-paper border-2 border-editorial-red hover:bg-ink hover:border-ink",
        outline: "bg-transparent border-2 border-paper-raised text-ink hover:border-ink",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
