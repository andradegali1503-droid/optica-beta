import {
  transposeCylinder,
  calculateNearVisionSphere,
  isValidDiopterStep,
} from "./src/lib/optical-math";
import { prescriptionSchema } from "./src/lib/validators";
import { opticaStore } from "./src/lib/store";

console.log("=========================================");
console.log("OPTICA MANAGEMENT PRO — TEST VERIFICATION");
console.log("=========================================");

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean) {
  if (condition) {
    console.log(`✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${description}`);
    failed++;
  }
}

// 1. OPTICAL MATHEMATICS TESTS
console.log("\n[1] Tests de Matemáticas y Óptica Geométrica:");

const transposed = transposeCylinder({
  sphere: 1.0,
  cylinder: -0.5,
  axis: 90,
});
assert(
  "Transposición Esferocilíndrica: Nueva Esfera = +0.50",
  transposed.sphere === 0.5
);
assert(
  "Transposición Esferocilíndrica: Nuevo Cilindro = +0.50",
  transposed.cylinder === 0.5
);
assert(
  "Transposición Esferocilíndrica: Nuevo Eje = 180°",
  transposed.axis === 180
);

const nearSphere = calculateNearVisionSphere(1.25, 2.0);
assert(
  "Cálculo Refracción Cerca: Esf Lejos +1.25 + Add +2.00 = +3.25 D",
  nearSphere === 3.25
);

assert("Validación Paso Dióptrico: -2.25 D es válido", isValidDiopterStep(-2.25));
assert("Validación Paso Dióptrico: +1.50 D es válido", isValidDiopterStep(1.5));
assert("Validación Paso Dióptrico: +1.17 D es INVÁLIDO", !isValidDiopterStep(1.17));

// 2. CLINICAL ZOD VALIDATION TESTS
console.log("\n[2] Tests de Validación Clínica de Esquemas (Zod):");

const validRx = {
  customerId: "cust-1",
  optometristId: "usr-1",
  optometristName: "Dra. Elena Ramos Gómez",
  examinationDate: "2026-11-03",
  rightEye: {
    sphere: -2.5,
    cylinder: -0.75,
    axis: 90,
    pupillaryDistance: 31.5,
  },
  leftEye: {
    sphere: -2.25,
    cylinder: -0.5,
    axis: 85,
    pupillaryDistance: 32.0,
  },
  lensType: "monofocal_far",
  treatments: ["antireflejante_premium"],
};

const validResult = prescriptionSchema.safeParse(validRx);
assert("Receta con parámetros clínicos estándar valida con éxito", validResult.success);

const invalidAxisRx = {
  ...validRx,
  rightEye: {
    ...validRx.rightEye,
    axis: 210, // Inválido (máximo 180°)
  },
};
const invalidAxisResult = prescriptionSchema.safeParse(invalidAxisRx);
assert(
  "Receta con eje fuera de rango (210°) es rechazada",
  !invalidAxisResult.success
);

const invalidStepRx = {
  ...validRx,
  rightEye: {
    ...validRx.rightEye,
    sphere: -2.13, // Inválido (no múltiplo de 0.25 D)
  },
};
const invalidStepResult = prescriptionSchema.safeParse(invalidStepRx);
assert(
  "Receta con esfera con paso no estándar (-2.13 D) es rechazada",
  !invalidStepResult.success
);

// 3. APPOINTMENT OVERLAP PREVENTION TESTS
console.log("\n[3] Tests de Prevención de Solapamiento de Citas:");

// Existing apt-1 is today 10:00 - 10:45 local time with usr-1
const dStartOverlap = new Date();
dStartOverlap.setHours(10, 15, 0, 0);
const dEndOverlap = new Date();
dEndOverlap.setHours(10, 45, 0, 0);

const overlapAttempt = opticaStore.addAppointment({
  customerId: "cust-2",
  customerName: "Beatriz Navarro Gil",
  customerPhone: "+34 622 345 678",
  professionalId: "usr-1", // Same professional
  professionalName: "Dra. Elena Ramos Gómez",
  serviceType: "graduacion_completa",
  startTime: dStartOverlap.toISOString(),
  endTime: dEndOverlap.toISOString(),
  status: "scheduled",
});

assert(
  "Solapamiento detectado y bloqueado para el mismo optometrista en el mismo horario",
  !overlapAttempt.success
);

const dStartFree = new Date();
dStartFree.setHours(14, 0, 0, 0);
const dEndFree = new Date();
dEndFree.setHours(14, 45, 0, 0);

const nonOverlapAttempt = opticaStore.addAppointment({
  customerId: "cust-2",
  customerName: "Beatriz Navarro Gil",
  customerPhone: "+34 622 345 678",
  professionalId: "usr-1",
  professionalName: "Dra. Elena Ramos Gómez",
  serviceType: "graduacion_completa",
  startTime: dStartFree.toISOString(),
  endTime: dEndFree.toISOString(),
  status: "scheduled",
});

assert(
  "Cita sin solapamiento horario es agendada exitosamente",
  nonOverlapAttempt.success
);

console.log("\n=========================================");
console.log(`RESUMEN: ${passed} Pasados, ${failed} Fallidos`);
console.log("=========================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
