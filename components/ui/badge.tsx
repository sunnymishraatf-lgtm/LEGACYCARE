import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-paper",
        secondary: "border-transparent bg-paper-soft text-ink",
        outline: "border-ink text-ink",
        success: "border-transparent bg-action/20 text-action",
        warning: "border-transparent bg-alert/20 text-alert",
        destructive: "border-transparent bg-editorial-red/20 text-editorial-red",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { Badge, badgeVariants };
