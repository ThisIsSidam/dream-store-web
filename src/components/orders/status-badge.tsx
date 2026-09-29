import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/api/types";

const config: Record<OrderStatus, { label: string; tone: "success" | "warning" | "danger" | "neutral" }> = {
  confirmed: { label: "Confirmed", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export const orderStatuses = Object.keys(config) as OrderStatus[];
export const orderStatusLabel = (status: OrderStatus) => config[status].label;

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const { label, tone } = config[status] ?? { label: status, tone: "neutral" as const };
  return (
    <Badge tone={tone} className={className}>
      {label}
    </Badge>
  );
}
