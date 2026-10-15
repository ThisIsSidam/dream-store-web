"use client";

import { advanceOrderTracking } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import type { TrackingStatus, TrackingTimelineEvent } from "@/lib/api/types";
import {
  Box,
  CheckCircle2,
  Package,
  Truck,
  UserCheck
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_FLOW: TrackingStatus[] = [
  "Ordered",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const STATUS_ICONS = {
  Ordered: CheckCircle2,
  Packed: Box,
  Shipped: Truck,
  "Out for Delivery": Package,
  Delivered: UserCheck,
};

interface OrderTrackingAdminControlsProps {
  orderId: string;
  currentStatus?: TrackingStatus;
  timeline?: TrackingTimelineEvent[];
}

export function OrderTrackingAdminControls({
  orderId,
  currentStatus = "Ordered",
  timeline = [],
}: OrderTrackingAdminControlsProps) {
  const [status, setStatus] = useState<TrackingStatus>(currentStatus);
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);

  const currentIndex = STATUS_FLOW.indexOf(status);

  async function handleAdvance(nextStatus: TrackingStatus) {
    setLoading(true);
    try {
      const res = await advanceOrderTracking(
        orderId,
        nextStatus,
        adminNote || undefined,
      );
      if (res.ok) {
        setStatus(nextStatus);
        setAdminNote("");
        toast.success(`Tracking advanced to "${nextStatus}"`);
      } else {
        toast.error(res.error || "Failed to update tracking");
      }
    } catch {
      toast.error("Network error while updating tracking status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FLOW.map((s, idx) => {
          const isDone = idx <= currentIndex;
          const isNext = idx === currentIndex + 1;
          const Icon = STATUS_ICONS[s];

          return (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={status === s ? "primary" : isDone ? "soft" : "outline"}
              disabled={loading || (!isNext && s !== status)}
              onClick={() => isNext && handleAdvance(s)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Icon className="size-3.5" />
              <span>{s}</span>
              {isNext && (
                <span className="ml-1 text-[10px] text-amber-500 font-bold">
                  Advance →
                </span>
              )}
            </Button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Optional tracking dispatch note..."
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          className="h-8 flex-1 rounded border border-outline-variant/50 bg-surface px-3 text-xs outline-none focus:border-primary"
        />
      </div>

      {timeline && timeline.length > 0 && (
        <div className="mt-4 border-t border-outline-variant/30 pt-3">
          <p className="text-xs font-bold text-on-surface-variant mb-2">
            Tracking Timeline
          </p>
          <div className="space-y-2">
            {timeline.map((evt, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="font-semibold text-primary shrink-0">
                  {evt.status}:
                </span>
                <span className="text-on-surface-variant flex-1">
                  {evt.desc}
                </span>
                <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                  {new Date(evt.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
