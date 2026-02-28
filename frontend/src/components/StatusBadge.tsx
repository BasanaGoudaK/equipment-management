import { Badge } from "@/components/ui/badge";
import type { EquipmentStatus } from "@/types/equipment";

const statusConfig: Record<EquipmentStatus, string> = {
  Active: "status-badge-active",
  Inactive: "status-badge-inactive",
  "Under Maintenance": "status-badge-maintenance",
};

interface StatusBadgeProps {
  status: EquipmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={`${statusConfig[status]} text-xs font-medium`}>
      {status}
    </Badge>
  );
}
