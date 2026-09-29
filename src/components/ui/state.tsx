import { AlertCircle, Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StateProps = {
  title: string;
  message?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, message, icon: Icon = Inbox, action, className }: StateProps) {
  return (
    <div className={cn("grid place-items-center px-6 py-20 text-center", className)}>
      <div className="flex max-w-md flex-col items-center gap-2">
        <Icon className="mb-2 size-16 text-on-surface/20" aria-hidden />
        <h2 className="t-headline">{title}</h2>
        {message && <p className="t-body-md text-on-surface/60">{message}</p>}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  action,
  className,
}: Partial<StateProps>) {
  return (
    <EmptyState
      title={title}
      message={message}
      icon={AlertCircle}
      action={action}
      className={className}
    />
  );
}
