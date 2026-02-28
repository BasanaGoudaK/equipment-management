import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { EquipmentStatus } from "@/types/equipment";

interface EquipmentFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: EquipmentStatus | "all";
  onStatusFilterChange: (value: EquipmentStatus | "all") => void;
}

export function EquipmentFiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: EquipmentFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(v) => onStatusFilterChange(v as EquipmentStatus | "all")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
          <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
