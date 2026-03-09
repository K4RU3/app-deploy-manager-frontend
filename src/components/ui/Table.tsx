import * as React from "react";
import { cn } from "../../utils/cn";

export const Table = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className="w-full overflow-auto">
    <table className={cn("w-full text-sm text-left text-zinc-400", className)}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <thead
    className={cn(
      "text-xs text-zinc-500 uppercase bg-zinc-900/50 border-y border-zinc-800",
      className
    )}
  >
    {children}
  </thead>
);

export const TableBody = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <tbody className={cn("divide-y divide-zinc-800", className)}>{children}</tbody>;

export const TableRow = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <tr
    className={cn(
      "bg-transparent hover:bg-zinc-900/50 transition-colors",
      className
    )}
  >
    {children}
  </tr>
);

export const TableHead = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <th className={cn("px-6 py-4 font-medium", className)}>{children}</th>;

export const TableCell = ({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-6 py-4 whitespace-nowrap", className)} {...props}>
    {children}
  </td>
);
