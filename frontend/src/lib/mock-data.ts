import type { Equipment, EquipmentType, MaintenanceLog } from "@/types/equipment";

export const equipmentTypes: EquipmentType[] = [
  { id: 1, name: "Pump" },
  { id: 2, name: "Compressor" },
  { id: 3, name: "Generator" },
  { id: 4, name: "Conveyor" },
  { id: 5, name: "Mixer" },
  { id: 6, name: "Valve" },
];

let nextEquipmentId = 11;
let nextMaintenanceId = 6;

export const equipmentData: Equipment[] = [
  { id: 1, name: "Hydraulic Pump A1", type: equipmentTypes[0], status: "Active", lastCleanedDate: "2026-02-20" },
  { id: 2, name: "Air Compressor B2", type: equipmentTypes[1], status: "Active", lastCleanedDate: "2026-02-15" },
  { id: 3, name: "Diesel Generator C3", type: equipmentTypes[2], status: "Under Maintenance", lastCleanedDate: "2026-01-10" },
  { id: 4, name: "Belt Conveyor D4", type: equipmentTypes[3], status: "Inactive", lastCleanedDate: "2025-12-01" },
  { id: 5, name: "Industrial Mixer E5", type: equipmentTypes[4], status: "Active", lastCleanedDate: "2026-02-25" },
  { id: 6, name: "Control Valve F6", type: equipmentTypes[5], status: "Active", lastCleanedDate: "2026-02-18" },
  { id: 7, name: "Centrifugal Pump A7", type: equipmentTypes[0], status: "Inactive", lastCleanedDate: "2025-11-20" },
  { id: 8, name: "Screw Compressor B8", type: equipmentTypes[1], status: "Under Maintenance", lastCleanedDate: "2026-01-25" },
  { id: 9, name: "Portable Generator C9", type: equipmentTypes[2], status: "Active", lastCleanedDate: "2026-02-22" },
  { id: 10, name: "Ribbon Mixer E10", type: equipmentTypes[4], status: "Active", lastCleanedDate: "2026-02-27" },
];

export const maintenanceLogs: MaintenanceLog[] = [
  { id: 1, equipmentId: 1, maintenanceDate: "2026-02-20", notes: "Routine cleaning and lubrication", performedBy: "John Smith" },
  { id: 2, equipmentId: 2, maintenanceDate: "2026-02-15", notes: "Filter replacement and cleaning", performedBy: "Jane Doe" },
  { id: 3, equipmentId: 5, maintenanceDate: "2026-02-25", notes: "Blade inspection and cleaning", performedBy: "Mike Johnson" },
  { id: 4, equipmentId: 3, maintenanceDate: "2026-01-10", notes: "Oil change and general maintenance", performedBy: "Sarah Williams" },
  { id: 5, equipmentId: 6, maintenanceDate: "2026-02-18", notes: "Seal replacement and cleaning", performedBy: "Tom Brown" },
];

export function getNextEquipmentId() {
  return nextEquipmentId++;
}

export function getNextMaintenanceId() {
  return nextMaintenanceId++;
}
