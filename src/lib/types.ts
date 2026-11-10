export type UserRole = "admin" | "optometrist" | "sales" | "receptionist";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  licenseNumber?: string; // Número de colegiado óptico-optometrista
  avatarUrl?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  taxId: string; // DNI/NIE/CIF
  birthDate: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  postalCode?: string;
  medicalNotes?: string; // Antecedentes oculares (glaucoma, cataratas, ojo seco, diabetes)
  createdAt: string;
  updatedAt: string;
}

export type LensType =
  | "monofocal_far"
  | "monofocal_near"
  | "progressive"
  | "occupational"
  | "bifocal"
  | "contact_soft"
  | "contact_rigid";

export interface OpticalEyeFormula {
  sphere: number; // Esfera (-30.00 a +30.00)
  cylinder?: number; // Cilindro (-12.00 a +12.00)
  axis?: number; // Eje (0 a 180 grados)
  addition?: number; // Adición (+0.75 a +4.00)
  visualAcuity?: string; // e.g. "1.0", "0.8", "20/20"
  pupillaryDistance?: number; // Distancia pupilar monocular (20 a 45 mm)
  heightPupil?: number; // Altura pupilar en mm
  prism?: number; // Prisma dioptrías (0 a 10)
  prismBase?: "up" | "down" | "in" | "out";
}

export interface ContactLensDetails {
  baseCurve?: number; // Radio base (8.3 - 9.0 mm)
  diameter?: number; // Diámetro (13.8 - 14.5 mm)
  material?: string;
  brand?: string;
  replacementSchedule?: "daily" | "biweekly" | "monthly" | "yearly";
}

export interface Prescription {
  id: string;
  customerId: string;
  customerName?: string;
  optometristId: string;
  optometristName: string;
  licenseNumber?: string;
  examinationDate: string;
  rightEye: OpticalEyeFormula; // OD
  leftEye: OpticalEyeFormula; // OI
  pupillaryDistanceBinocular?: number; // DP Lejos (48 - 76 mm)
  pupillaryDistanceNear?: number; // DP Cerca
  lensType: LensType;
  treatments: string[]; // ['antireflejante_premium', 'filtro_azul', 'fotocromatico', 'endurecido', 'hidrofobico']
  contactLens?: ContactLensDetails;
  clinicalObservations?: string;
  nextCheckupMonths?: number; // Próxima revisión sugerida (6, 12, 24 meses)
  createdAt: string;
}

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_consultation"
  | "completed"
  | "cancelled"
  | "no_show";

export type ServiceType =
  | "graduacion_completa"
  | "adaptacion_lentillas"
  | "revision_tension_ocular"
  | "control_infantil"
  | "entrega_ajuste";

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  professionalId: string;
  professionalName: string;
  serviceType: ServiceType;
  startTime: string; // ISO String
  endTime: string; // ISO String
  status: AppointmentStatus;
  notes?: string;
  cabinetNumber?: number; // Gabinete 1, Gabinete 2
}

export type ProductCategory =
  | "frame"
  | "ophthalmic_lens"
  | "contact_lens"
  | "sunglasses"
  | "solution"
  | "accessory";

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  brand: string;
  model?: string;
  category: ProductCategory;
  costPrice: number;
  salePrice: number;
  stockCurrent: number;
  stockMin: number;
  supplierId: string;
  supplierName: string;
  specifications: {
    color?: string;
    caliber?: number; // Calibre montura mm (ej. 52)
    bridge?: number; // Puente mm (ej. 18)
    rod?: number; // Varilla mm (ej. 140)
    material?: string; // Acetato, Titanio, Metal, TR90
    index?: number; // 1.50, 1.56, 1.60, 1.67, 1.74
    geometry?: string; // Esférico, Asférico, Freeform
    packSize?: number; // e.g. Pack 30 lentillas
    volume?: string; // e.g. "300 ml"
    [key: string]: any;
  };
  isActive: boolean;
  createdAt: string;
}

export type MovementType =
  | "in_purchase"
  | "out_sale"
  | "in_return"
  | "out_damaged"
  | "stock_adjustment";

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: MovementType;
  quantity: number;
  reason: string;
  performedBy: string;
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  taxId: string;
  contactName: string;
  phone: string;
  email: string;
  brands: string[];
  leadTimeDays: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  prescriptionId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "budget" | "workshop" | "ready" | "delivered" | "cancelled";
  paymentStatus: "pending" | "partial" | "paid";
  paymentMethod: "card" | "cash" | "transfer" | "finance";
  notes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityName: string;
  entityId: string;
  timestamp: string;
  details: string;
}
