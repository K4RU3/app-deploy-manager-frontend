import * as React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
      secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-600",
      danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
      ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs font-medium",
      md: "px-4 py-2 text-sm font-medium",
      lg: "px-6 py-3 text-base font-medium",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
