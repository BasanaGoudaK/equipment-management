export type EquipmentStatus = "Active" | "Inactive" | "Under Maintenance";

export interface EquipmentType {
  id: number;
  name: string;
}

export interface Equipment {
  id: number;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  lastCleanedDate: string | null;
}

export interface MaintenanceLog {
  id: number;
  equipmentId: number;
  maintenanceDate: string;
  notes: string;
  performedBy: string;
}

export interface EquipmentFormData {
  name: string;
  typeId: number;
  status: EquipmentStatus;
  lastCleanedDate: string | null;
}

export interface MaintenanceFormData {
  equipmentId: number;
  maintenanceDate: string;
  notes: string;
  performedBy: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface EquipmentFilters {
  status?: EquipmentStatus | "all";
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  page: number;
  size: number;
}
