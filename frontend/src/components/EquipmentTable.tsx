import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Wrench, History } from "lucide-react";
import type { Equipment } from "@/types/equipment";

interface EquipmentTableProps {
  data: Equipment[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (equipment: Equipment) => void;
  onDelete: (equipment: Equipment) => void;
  onMaintenance: (equipment: Equipment) => void;
  onHistory: (equipment: Equipment) => void;
}

function SortableHead({
  children,
  field,
  currentField,
  direction,
  onSort,
}: {
  children: React.ReactNode;
  field: string;
  currentField: string;
  direction: "asc" | "desc";
  onSort: (field: string) => void;
}) {
  const isActive = currentField === field;
  return (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1 font-semibold"
        onClick={() => onSort(field)}
      >
        {children}
        <ArrowUpDown className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
      </Button>
    </TableHead>
  );
}

export function EquipmentTable({
  data,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onMaintenance,
  onHistory,
}: EquipmentTableProps) {
  if (data.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No equipment found matching your criteria.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead field="name" currentField={sortField} direction={sortDirection} onSort={onSort}>
              Name
            </SortableHead>
            <SortableHead field="type" currentField={sortField} direction={sortDirection} onSort={onSort}>
              Type
            </SortableHead>
            <SortableHead field="status" currentField={sortField} direction={sortDirection} onSort={onSort}>
              Status
            </SortableHead>
            <SortableHead field="lastCleanedDate" currentField={sortField} direction={sortDirection} onSort={onSort}>
              Last Cleaned
            </SortableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((eq) => (
            <TableRow key={eq.id} className="animate-fade-in">
              <TableCell className="font-medium">{eq.name}</TableCell>
              <TableCell>{eq.type.name}</TableCell>
              <TableCell>
                <StatusBadge status={eq.status} />
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {eq.lastCleanedDate || "—"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(eq)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMaintenance(eq)}>
                      <Wrench className="mr-2 h-4 w-4" /> Log Maintenance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onHistory(eq)}>
                      <History className="mr-2 h-4 w-4" /> View History
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(eq)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
