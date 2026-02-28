import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentTable } from "@/components/EquipmentTable";
import { EquipmentFormDialog } from "@/components/EquipmentFormDialog";
import { MaintenanceFormDialog } from "@/components/MaintenanceFormDialog";
import { MaintenanceHistoryDialog } from "@/components/MaintenanceHistoryDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { EquipmentFiltersBar } from "@/components/EquipmentFiltersBar";
import { PaginationBar } from "@/components/PaginationBar";
import {
  fetchEquipment,
  fetchEquipmentTypes,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  createMaintenance,
} from "@/lib/api";
import type {
  Equipment,
  EquipmentType,
  EquipmentFormData,
  MaintenanceFormData,
  EquipmentStatus,
  PaginatedResponse,
} from "@/types/equipment";
import { Plus, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [types, setTypes] = useState<EquipmentType[]>([]);
  const [result, setResult] = useState<PaginatedResponse<Equipment>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | "all">("all");
  const [sort, setSort] = useState("name");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // Dialogs
  const [formOpen, setFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [maintenanceTarget, setMaintenanceTarget] = useState<Equipment | null>(null);
  const [historyTarget, setHistoryTarget] = useState<Equipment | null>(null);

  const loadData = useCallback(async () => {
    const data = await fetchEquipment({
      status: statusFilter,
      search,
      sort,
      direction,
      page,
      size,
    });
    setResult(data);
  }, [statusFilter, search, sort, direction, page, size]);

  useEffect(() => {
    fetchEquipmentTypes().then(setTypes);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter]);

  const handleSort = (field: string) => {
    if (sort === field) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setDirection("asc");
    }
  };

  const handleAddSubmit = async (data: EquipmentFormData) => {
    await createEquipment(data);
    toast({ title: "Equipment added", description: `${data.name} has been created.` });
    await loadData();
  };

  const handleEditSubmit = async (data: EquipmentFormData) => {
    if (!editingEquipment) return;
    await updateEquipment(editingEquipment.id, data);
    toast({ title: "Equipment updated", description: `${data.name} has been updated.` });
    await loadData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEquipment(deleteTarget.id);
      toast({ title: "Equipment deleted", description: `${deleteTarget.name} has been removed.` });
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleMaintenanceSubmit = async (data: MaintenanceFormData) => {
    await createMaintenance(data);
    toast({
      title: "Maintenance logged",
      description: "Status updated to Active and last cleaned date updated.",
    });
    await loadData();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none">Equipment Manager</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Track, maintain, and manage equipment</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{result.totalElements}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">
                {result.content.filter((e) => e.status === "Active").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Under Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">
                {result.content.filter((e) => e.status === "Under Maintenance").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <EquipmentFiltersBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <Button onClick={() => { setEditingEquipment(null); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Equipment
          </Button>
        </div>

        {/* Table */}
        <EquipmentTable
          data={result.content}
          sortField={sort}
          sortDirection={direction}
          onSort={handleSort}
          onEdit={(eq) => { setEditingEquipment(eq); setFormOpen(true); }}
          onDelete={setDeleteTarget}
          onMaintenance={setMaintenanceTarget}
          onHistory={setHistoryTarget}
        />

        {/* Pagination */}
        <PaginationBar
          page={result.page}
          totalPages={result.totalPages}
          totalElements={result.totalElements}
          size={size}
          onPageChange={setPage}
          onSizeChange={(s) => { setSize(s); setPage(0); }}
        />
      </main>

      {/* Dialogs */}
      <EquipmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        equipment={editingEquipment}
        equipmentTypes={types}
        onSubmit={editingEquipment ? handleEditSubmit : handleAddSubmit}
      />

      {deleteTarget && (
        <DeleteConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          name={deleteTarget.name}
          onConfirm={handleDelete}
        />
      )}

      {maintenanceTarget && (
        <MaintenanceFormDialog
          open={!!maintenanceTarget}
          onOpenChange={(open) => !open && setMaintenanceTarget(null)}
          equipmentId={maintenanceTarget.id}
          equipmentName={maintenanceTarget.name}
          onSubmit={handleMaintenanceSubmit}
        />
      )}

      {historyTarget && (
        <MaintenanceHistoryDialog
          open={!!historyTarget}
          onOpenChange={(open) => !open && setHistoryTarget(null)}
          equipmentId={historyTarget.id}
          equipmentName={historyTarget.name}
        />
      )}
    </div>
  );
};

export default Index;
