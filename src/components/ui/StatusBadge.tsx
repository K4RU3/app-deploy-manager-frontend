import { cn } from "../../utils/cn";

export const StatusBadge = ({
  status,
  className,
}: {
  status: "Running" | "Stopped" | "Error" | "Success" | "Pending";
  className?: string;
}) => {
  const styles = {
    Running: "bg-green-500/10 text-green-500 border-green-500/20",
    Success: "bg-green-500/10 text-green-500 border-green-500/20",
    Stopped: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    Error: "bg-red-500/10 text-red-500 border-red-500/20",
    Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[status] || styles.Stopped,
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full mr-1.5",
          status === "Running" || status === "Success" ? "bg-green-500" :
          status === "Stopped" ? "bg-zinc-500" :
          status === "Error" ? "bg-red-500" : "bg-yellow-500"
        )}
      />
      {status}
    </span>
  );
};
