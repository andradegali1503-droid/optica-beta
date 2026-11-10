import { z } from "zod";

const diopterStepRefinement = (val: number | undefined) => {
  if (val === undefined || val === null) return true;
  const rem = Math.abs(val * 100) % 25;
  return rem < 0.01 || rem > 24.99;
};

export const eyeFormulaSchema = z.object({
  sphere: z
    .number({ invalid_type_error: "La esfera debe ser un número" })
    .min(-30.0, "La esfera mínima es -30.00 D")
    .max(30.0, "La esfera máxima es +30.00 D")
    .refine(diopterStepRefinement, "Debe ser múltiplo de 0.25 D"),
  cylinder: z
    .number({ invalid_type_error: "El cilindro debe ser un número" })
    .min(-12.0, "El cilindro mínimo es -12.00 D")
    .max(12.0, "El cilindro máximo es +12.00 D")
    .refine(diopterStepRefinement, "Debe ser múltiplo de 0.25 D")
    .optional(),
  axis: z
    .number({ invalid_type_error: "El eje debe ser un número entero" })
    .int("El eje debe ser un número entero de 0° a 180°")
    .min(0, "El eje mínimo es 0°")
    .max(180, "El eje máximo es 180°")
    .optional(),
  addition: z
    .number()
    .min(0.75, "La adición mínima es +0.75 D")
    .max(4.0, "La adición máxima es +4.00 D")
    .refine(diopterStepRefinement, "Debe ser múltiplo de 0.25 D")
    .optional(),
  visualAcuity: z.string().max(10).optional(),
  pupillaryDistance: z
    .number()
    .min(20.0, "DP monocular mínima 20 mm")
    .max(45.0, "DP monocular máxima 45 mm")
    .optional(),
  heightPupil: z.number().min(10).max(40).optional(),
  prism: z.number().min(0).max(10).optional(),
  prismBase: z.enum(["up", "down", "in", "out"]).optional(),
});

export const prescriptionSchema = z.object({
  customerId: z.string().min(1, "Debe seleccionar un cliente"),
  optometristId: z.string().min(1, "Debe seleccionar un optometrista"),
  optometristName: z.string().min(1, "Nombre de profesional requerido"),
  licenseNumber: z.string().optional(),
  examinationDate: z.string().min(1, "Fecha de exploración requerida"),
  rightEye: eyeFormulaSchema,
  leftEye: eyeFormulaSchema,
  pupillaryDistanceBinocular: z
    .number()
    .min(45.0, "DP binocular mínima 45 mm")
    .max(80.0, "DP binocular máxima 80 mm")
    .optional(),
  pupillaryDistanceNear: z.number().min(40).max(75).optional(),
  lensType: z.enum([
    "monofocal_far",
    "monofocal_near",
    "progressive",
    "occupational",
    "bifocal",
    "contact_soft",
    "contact_rigid",
  ]),
  treatments: z.array(z.string()).default([]),
  clinicalObservations: z.string().max(1000).optional(),
  nextCheckupMonths: z.number().min(1).max(36).optional(),
});

export const customerSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
  taxId: z.string().min(5, "DNI/NIE/CIF válido requerido"),
  birthDate: z.string().min(1, "Fecha de nacimiento requerida"),
  phone: z.string().min(9, "Número de teléfono válido requerido"),
  email: z.string().email("Correo electrónico inválido").or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  medicalNotes: z.string().optional(),
});

export const appointmentSchema = z
  .object({
    customerId: z.string().min(1, "Debe seleccionar un cliente"),
    customerName: z.string().min(1, "Nombre del cliente requerido"),
    customerPhone: z.string().min(9, "Teléfono de contacto requerido"),
    professionalId: z.string().min(1, "Debe asignar un profesional"),
    professionalName: z.string().min(1, "Nombre del profesional requerido"),
    serviceType: z.enum([
      "graduacion_completa",
      "adaptacion_lentillas",
      "revision_tension_ocular",
      "control_infantil",
      "entrega_ajuste",
    ]),
    startTime: z.string().min(1, "Hora de inicio requerida"),
    endTime: z.string().min(1, "Hora de fin requerida"),
    status: z.enum([
      "scheduled",
      "confirmed",
      "in_consultation",
      "completed",
      "cancelled",
      "no_show",
    ]),
    notes: z.string().optional(),
    cabinetNumber: z.number().min(1).max(5).default(1),
  })
  .refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    {
      message: "La hora de finalización debe ser posterior a la de inicio",
      path: ["endTime"],
    }
  );

export const productSchema = z.object({
  sku: z.string().min(3, "SKU requerido (mínimo 3 caracteres)"),
  barcode: z.string().min(4, "Código de barras requerido"),
  name: z.string().min(3, "Nombre del producto requerido"),
  brand: z.string().min(2, "Marca requerida"),
  model: z.string().optional(),
  category: z.enum([
    "frame",
    "ophthalmic_lens",
    "contact_lens",
    "sunglasses",
    "solution",
    "accessory",
  ]),
  costPrice: z.number().min(0, "El coste debe ser mayor o igual a 0"),
  salePrice: z.number().min(0, "El precio de venta debe ser positivo"),
  stockCurrent: z.number().int().min(0, "El stock no puede ser negativo"),
  stockMin: z.number().int().min(1, "El stock mínimo debe ser al menos 1"),
  supplierId: z.string().default("sup-1"),
  supplierName: z.string().default("Luxottica España"),
  specifications: z.record(z.any()).default({}),
});
