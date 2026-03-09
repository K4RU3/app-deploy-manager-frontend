import * as React from "react";
import { cn } from "../../utils/cn";

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden",
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn("p-6 border-b border-zinc-800", className)}>
    {children}
  </div>
);

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <h3 className={cn("text-lg font-semibold text-white", className)}>
    {children}
  </h3>
);

export const CardContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={cn("p-6", className)}>{children}</div>;

export const CardFooter = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn("p-6 border-t border-zinc-800 bg-zinc-900/50", className)}>
    {children}
  </div>
);
