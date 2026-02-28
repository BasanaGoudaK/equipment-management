import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Equipment, EquipmentFormData, EquipmentType, EquipmentStatus } from "@/types/equipment";

interface EquipmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment?: Equipment | null;
  equipmentTypes: EquipmentType[];
  onSubmit: (data: EquipmentFormData) => Promise<void>;
}

const statuses: EquipmentStatus[] = ["Active", "Inactive", "Under Maintenance"];

export function EquipmentFormDialog({
  open,
  onOpenChange,
  equipment,
  equipmentTypes,
  onSubmit,
}: EquipmentFormDialogProps) {
  const isEdit = !!equipment;

  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState<string>("");
  const [status, setStatus] = useState<EquipmentStatus>("Inactive");
  const [lastCleanedDate, setLastCleanedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (equipment) {
        setName(equipment.name);
        setTypeId(String(equipment.type.id));
        setStatus(equipment.status);
        setLastCleanedDate(equipment.lastCleanedDate || "");
      } else {
        setName("");
        setTypeId(equipmentTypes[0] ? String(equipmentTypes[0].id) : "");
        setStatus("Inactive");
        setLastCleanedDate("");
      }
      setError("");
    }
  }, [open, equipment, equipmentTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!typeId) {
      setError("Equipment type is required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onSubmit({
        name: name.trim(),
        typeId: Number(typeId),
        status,
        lastCleanedDate: lastCleanedDate || null,
      });
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
          <DialogTitle>{isEdit ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the equipment details below." : "Fill in the details to add new equipment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eq-name">Name</Label>
            <Input
              id="eq-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hydraulic Pump A1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eq-type">Type</Label>
            <Select value={typeId} onValueChange={setTypeId}>
              <SelectTrigger id="eq-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eq-status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as EquipmentStatus)}>
              <SelectTrigger id="eq-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eq-date">Last Cleaned Date</Label>
            <Input
              id="eq-date"
              type="date"
              value={lastCleanedDate}
              onChange={(e) => setLastCleanedDate(e.target.value)}
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
              {loading ? "Saving..." : isEdit ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
