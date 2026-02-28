import type {
  Equipment,
  EquipmentType,
  EquipmentFormData,
  MaintenanceLog,
  MaintenanceFormData,
  PaginatedResponse,
  EquipmentFilters,
  EquipmentStatus,
} from "@/types/equipment";
import {
  equipmentData,
  equipmentTypes,
  maintenanceLogs,
  getNextEquipmentId,
  getNextMaintenanceId,
} from "@/lib/mock-data";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

function isLastCleanedWithin30Days(date: string | null): boolean {
  if (!date) return false;
  const cleaned = new Date(date);
  const now = new Date("2026-02-28");
  const diff = (now.getTime() - cleaned.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 30;
}

// Equipment Types
export async function fetchEquipmentTypes(): Promise<EquipmentType[]> {
  await delay();
  return [...equipmentTypes];
}

// Equipment CRUD
export async function fetchEquipment(
  filters: EquipmentFilters
): Promise<PaginatedResponse<Equipment>> {
  await delay();

  let result = [...equipmentData];

  // Filter by status
  if (filters.status && filters.status !== "all") {
    result = result.filter((e) => e.status === filters.status);
  }

  // Search by name
  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(s));
  }

  // Sort
  const sortField = filters.sort || "name";
  const dir = filters.direction || "asc";
  result.sort((a, b) => {
    let valA: string | number = "";
    let valB: string | number = "";
    if (sortField === "name") {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sortField === "type") {
      valA = a.type.name.toLowerCase();
      valB = b.type.name.toLowerCase();
    } else if (sortField === "status") {
      valA = a.status;
      valB = b.status;
    } else if (sortField === "lastCleanedDate") {
      valA = a.lastCleanedDate || "";
      valB = b.lastCleanedDate || "";
    }
    if (valA < valB) return dir === "asc" ? -1 : 1;
    if (valA > valB) return dir === "asc" ? 1 : -1;
    return 0;
  });

  const totalElements = result.length;
  const totalPages = Math.ceil(totalElements / filters.size);
  const start = filters.page * filters.size;
  const content = result.slice(start, start + filters.size);

  return { content, totalElements, totalPages, page: filters.page, size: filters.size };
}

export async function createEquipment(data: EquipmentFormData): Promise<Equipment> {
  await delay();

  if (data.status === "Active" && !isLastCleanedWithin30Days(data.lastCleanedDate)) {
    throw new Error("Equipment cannot be marked as Active if last cleaned date is older than 30 days.");
  }

  const type = equipmentTypes.find((t) => t.id === data.typeId);
  if (!type) throw new Error("Invalid equipment type.");

  const equipment: Equipment = {
    id: getNextEquipmentId(),
    name: data.name,
    type,
    status: data.status,
    lastCleanedDate: data.lastCleanedDate,
  };

  equipmentData.push(equipment);
  return equipment;
}

export async function updateEquipment(
  id: number,
  data: EquipmentFormData
): Promise<Equipment> {
  await delay();

  if (data.status === "Active" && !isLastCleanedWithin30Days(data.lastCleanedDate)) {
    throw new Error("Equipment cannot be marked as Active if last cleaned date is older than 30 days.");
  }

  const idx = equipmentData.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Equipment not found.");

  const type = equipmentTypes.find((t) => t.id === data.typeId);
  if (!type) throw new Error("Invalid equipment type.");

  equipmentData[idx] = {
    ...equipmentData[idx],
    name: data.name,
    type,
    status: data.status,
    lastCleanedDate: data.lastCleanedDate,
  };

  return equipmentData[idx];
}

export async function deleteEquipment(id: number): Promise<void> {
  await delay();
  const idx = equipmentData.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Equipment not found.");
  equipmentData.splice(idx, 1);
  // Remove related maintenance logs
  const toRemove = maintenanceLogs
    .map((l, i) => (l.equipmentId === id ? i : -1))
    .filter((i) => i !== -1)
    .reverse();
  toRemove.forEach((i) => maintenanceLogs.splice(i, 1));
}

// Maintenance
export async function createMaintenance(
  data: MaintenanceFormData
): Promise<MaintenanceLog> {
  await delay();

  const equipment = equipmentData.find((e) => e.id === data.equipmentId);
  if (!equipment) throw new Error("Equipment not found.");

  const log: MaintenanceLog = {
    id: getNextMaintenanceId(),
    equipmentId: data.equipmentId,
    maintenanceDate: data.maintenanceDate,
    notes: data.notes,
    performedBy: data.performedBy,
  };

  maintenanceLogs.push(log);

  // Business rule: update equipment status to Active and lastCleanedDate
  equipment.status = "Active";
  equipment.lastCleanedDate = data.maintenanceDate;

  return log;
}

export async function fetchMaintenanceLogs(
  equipmentId: number
): Promise<MaintenanceLog[]> {
  await delay();
  return maintenanceLogs
    .filter((l) => l.equipmentId === equipmentId)
    .sort((a, b) => b.maintenanceDate.localeCompare(a.maintenanceDate));
}
