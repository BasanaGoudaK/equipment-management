import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchMaintenanceLogs } from "@/lib/api";
import type { MaintenanceLog } from "@/types/equipment";

interface MaintenanceHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId: number;
  equipmentName: string;
}

export function MaintenanceHistoryDialog({
  open,
  onOpenChange,
  equipmentId,
  equipmentName,
}: MaintenanceHistoryDialogProps) {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchMaintenanceLogs(equipmentId)
        .then(setLogs)
        .finally(() => setLoading(false));
    }
  }, [open, equipmentId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Maintenance History</DialogTitle>
          <DialogDescription>
            Records for <span className="font-medium text-foreground">{equipmentName}</span>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No maintenance records found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm whitespace-nowrap">
                    {log.maintenanceDate}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{log.performedBy}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {log.notes || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
