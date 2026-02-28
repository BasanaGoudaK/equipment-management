import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MaintenanceFormData } from "@/types/equipment";

interface MaintenanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId: number;
  equipmentName: string;
  onSubmit: (data: MaintenanceFormData) => Promise<void>;
}

export function MaintenanceFormDialog({
  open,
  onOpenChange,
  equipmentId,
  equipmentName,
  onSubmit,
}: MaintenanceFormDialogProps) {
  const [maintenanceDate, setMaintenanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceDate) {
      setError("Maintenance date is required.");
      return;
    }
    if (!performedBy.trim()) {
      setError("Performed by is required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onSubmit({
        equipmentId,
        maintenanceDate,
        notes: notes.trim(),
        performedBy: performedBy.trim(),
      });
      setNotes("");
      setPerformedBy("");
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Log Maintenance</DialogTitle>
          <DialogDescription>
            Record maintenance for <span className="font-medium text-foreground">{equipmentName}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mt-date">Maintenance Date</Label>
            <Input
              id="mt-date"
              type="date"
              value={maintenanceDate}
              onChange={(e) => setMaintenanceDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mt-by">Performed By</Label>
            <Input
              id="mt-by"
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
              placeholder="e.g. John Smith"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mt-notes">Notes</Label>
            <Textarea
              id="mt-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the work performed..."
              rows={3}
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Log Maintenance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
