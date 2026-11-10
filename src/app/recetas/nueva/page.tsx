"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Printer,
  Save,
  ArrowLeft,
  User,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { opticaStore } from "@/lib/store";
import { transposeCylinder } from "@/lib/optical-math";
import { prescriptionSchema } from "@/lib/validators";
import { LensType, Customer } from "@/lib/types";
import Link from "next/link";
import { PrescriptionPrintModal } from "@/components/recetas/PrescriptionPrintModal";

function NuevaRecetaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(preselectedCustomerId || "");
  const [examinationDate, setExaminationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [optometristName, setOptometristName] = useState("Dra. Elena Ramos Gómez");
  const [licenseNumber, setLicenseNumber] = useState("COL-OPT-2849");

  // Right Eye (OD)
  const [odSphere, setOdSphere] = useState<number>(-2.00);
  const [odCylinder, setOdCylinder] = useState<number>(-0.50);
  const [odAxis, setOdAxis] = useState<number>(90);
  const [odAddition, setOdAddition] = useState<number | undefined>(undefined);
  const [odPd, setOdPd] = useState<number>(31.5);
  const [odVa, setOdVa] = useState<string>("1.0");

  // Left Eye (OI)
  const [oiSphere, setOiSphere] = useState<number>(-2.25);
  const [oiCylinder, setOiCylinder] = useState<number>(-0.50);
  const [oiAxis, setOiAxis] = useState<number>(85);
  const [oiAddition, setOiAddition] = useState<number | undefined>(undefined);
  const [oiPd, setOiPd] = useState<number>(32.0);
  const [oiVa, setOiVa] = useState<string>("1.0");

  const [lensType, setLensType] = useState<LensType>("monofocal_far");
  const [treatments, setTreatments] = useState<string[]>([
    "antireflejante_premium",
    "filtro_azul",
  ]);
  const [clinicalObservations, setClinicalObservations] = useState("");
  const [nextCheckupMonths, setNextCheckupMonths] = useState(12);

  // Errors & Feedback
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [savedPrescription, setSavedPrescription] = useState<any | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    setCustomers(opticaStore.getCustomers());
  }, []);

  // Handle Transposition for Right Eye
  const handleTransposeOD = () => {
    const result = transposeCylinder({
      sphere: odSphere,
      cylinder: odCylinder,
      axis: odAxis,
      addition: odAddition,
    });
    setOdSphere(result.sphere);
    setOdCylinder(result.cylinder || 0);
    setOdAxis(result.axis || 0);
  };

  // Handle Transposition for Left Eye
  const handleTransposeOI = () => {
    const result = transposeCylinder({
      sphere: oiSphere,
      cylinder: oiCylinder,
      axis: oiAxis,
      addition: oiAddition,
    });
    setOiSphere(result.sphere);
    setOiCylinder(result.cylinder || 0);
    setOiAxis(result.axis || 0);
  };

  const handleToggleTreatment = (treatment: string) => {
    setTreatments((prev) =>
      prev.includes(treatment)
        ? prev.filter((t) => t !== treatment)
        : [...prev, treatment]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const payload = {
      customerId: selectedCustomerId,
      optometristId: "usr-1",
      optometristName,
      licenseNumber,
      examinationDate,
      rightEye: {
        sphere: odSphere,
        cylinder: odCylinder || undefined,
        axis: odAxis !== undefined ? odAxis : undefined,
        addition: odAddition || undefined,
        visualAcuity: odVa,
        pupillaryDistance: odPd,
      },
      leftEye: {
        sphere: oiSphere,
        cylinder: oiCylinder || undefined,
        axis: oiAxis !== undefined ? oiAxis : undefined,
        addition: oiAddition || undefined,
        visualAcuity: oiVa,
        pupillaryDistance: oiPd,
      },
      pupillaryDistanceBinocular: Number((odPd + oiPd).toFixed(1)),
      lensType,
      treatments,
      clinicalObservations,
      nextCheckupMonths,
    };

    const validation = prescriptionSchema.safeParse(payload);
    if (!validation.success) {
      const errMsgs = validation.error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      setFormErrors(errMsgs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const created = opticaStore.addPrescription(validation.data as any);
    setSavedPrescription(created);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/recetas">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Eye className="h-5 w-5 text-teal-600" />
              <span>Nueva Exploración Optométrica</span>
            </h1>
            <p className="text-xs text-slate-500">
              Formulario clínico de prescripción refractiva con validación dióptrica estricta
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal" className="gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Paso 0.25 D Estándar</span>
          </Badge>
        </div>
      </div>

      {/* Validation Errors Notice */}
      {formErrors.length > 0 && (
        <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>Por favor, corrige los siguientes errores de validación:</span>
          </div>
          <ul className="list-disc pl-5 text-xs space-y-0.5">
            {formErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient and Optometrist Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-teal-600" />
              <span>Datos de la Consulta y Paciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Paciente / Cliente *
                </label>
                <select
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar Paciente --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.taxId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Fecha de Exploración *
                </label>
                <input
                  type="date"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={examinationDate}
                  onChange={(e) => setExaminationDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Optometrista Responsable
                </label>
                <input
                  type="text"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={optometristName}
                  onChange={(e) => setOptometristName(e.target.value)}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refractive Formula Grid (OD / OI Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OJO DERECHO (OD) */}
          <Card className="border-teal-200 dark:border-teal-900/60 shadow-sm">
            <CardHeader className="bg-teal-50/60 dark:bg-teal-950/30 pb-3 border-b border-teal-100 dark:border-teal-900/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-teal-950 dark:text-teal-200">
                  Ojo Derecho (OD)
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Fórmula refracción Lejos & Cerca
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[11px] gap-1 border-teal-300 text-teal-800 dark:border-teal-800 dark:text-teal-300"
                onClick={handleTransposeOD}
                title="Transponer Cilindro automáticamente"
              >
                <RotateCw className="h-3 w-3" />
                <span>Transponer</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Esfera (SPH)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    className="w-full h-9 font-mono font-bold text-center rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    value={odSphere}
                    onChange={(e) => setOdSphere(parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Dioptrías (D)
                  </span>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Cilindro (CYL)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    className="w-full h-9 font-mono font-bold text-center rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    value={odCylinder}
                    onChange={(e) => setOdCylinder(parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Astigmatismo
                  </span>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Eje (AXIS)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    className="w-full h-9 font-mono font-bold text-center rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    value={odAxis}
                    onChange={(e) => setOdAxis(parseInt(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    0° a 180°
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Adición (ADD)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.75"
                    max="4.00"
                    placeholder="Ej. +2.00"
                    className="w-full h-9 font-mono text-center rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                    value={odAddition !== undefined ? odAddition : ""}
                    onChange={(e) =>
                      setOdAddition(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Presbicia
                  </span>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    DP Mono (mm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="20"
                    max="45"
                    className="w-full h-9 font-mono text-center rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                    value={odPd}
                    onChange={(e) => setOdPd(parseFloat(e.target.value) || 31.5)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Milímetros
                  </span>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Agudeza (AV)
                  </label>
                  <input
                    type="text"
                    className="w-full h-9 text-center rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                    value={odVa}
                    onChange={(e) => setOdVa(e.target.value)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Escala Snellen
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OJO IZQUIERDO (OI) */}
          <Card className="border-teal-200 dark:border-teal-900/60 shadow-sm">
            <CardHeader className="bg-teal-50/60 dark:bg-teal-950/30 pb-3 border-b border-teal-100 dark:border-teal-900/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-teal-950 dark:text-teal-200">
                  Ojo Izquierdo (OI)
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Fórmula refracción Lejos & Cerca
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[11px] gap-1 border-teal-300 text-teal-800 dark:border-teal-800 dark:text-teal-300"
                onClick={handleTransposeOI}
                title="Transponer Cilindro automáticamente"
              >
                <RotateCw className="h-3 w-3" />
                <span>Transponer</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Esfera (SPH)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    className="w-full h-9 font-mono font-bold text-center rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    value={oiSphere}
                    onChange={(e) => setOiSphere(parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Dioptrías (D)
                  </span>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Cilindro (CYL)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    className="w-full h-9 font-mono font-bold text-center rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    value={oiCylinder}
                    onChange={(e) => setOiCylinder(parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Astigmatismo
                  </span>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Eje (AXIS)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    className="w-full h-9 font-mono font-bold text-center rounded-md border border-slate-300 bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    value={oiAxis}
                    onChange={(e) => setOiAxis(parseInt(e.target.value) || 0)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    0° a 180°
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Adición (ADD)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.75"
                    max="4.00"
                    placeholder="Ej. +2.00"
                    className="w-full h-9 font-mono text-center rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                    value={oiAddition !== undefined ? oiAddition : ""}
                    onChange={(e) =>
                      setOiAddition(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Presbicia
                  </span>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    DP Mono (mm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="20"
                    max="45"
                    className="w-full h-9 font-mono text-center rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                    value={oiPd}
                    onChange={(e) => setOiPd(parseFloat(e.target.value) || 32.0)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Milímetros
                  </span>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                    Agudeza (AV)
                  </label>
                  <input
                    type="text"
                    className="w-full h-9 text-center rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                    value={oiVa}
                    onChange={(e) => setOiVa(e.target.value)}
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-0.5">
                    Escala Snellen
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Optical Lens & Treatments Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Especificaciones de Lente y Tratamientos Sugeridos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Geometría de Lente Oftálmica
                </label>
                <select
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={lensType}
                  onChange={(e) => setLensType(e.target.value as LensType)}
                >
                  <option value="monofocal_far">Monofocal Visión Lejana</option>
                  <option value="monofocal_near">Monofocal Visión Próxima (Lectura)</option>
                  <option value="progressive">Progresivo / Multifocal Ergonómico</option>
                  <option value="occupational">Ocupacional / Ofimático (Intermedia y Cerca)</option>
                  <option value="bifocal">Bifocal con Segmento</option>
                  <option value="contact_soft">Lente de Contacto Blanda</option>
                  <option value="contact_rigid">Lente RGP Permeable al Gas</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Revisión Sugerida
                </label>
                <select
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={nextCheckupMonths}
                  onChange={(e) => setNextCheckupMonths(parseInt(e.target.value))}
                >
                  <option value={6}>A los 6 meses (Control estrecho)</option>
                  <option value={12}>A los 12 meses (Revisión anual estándar)</option>
                  <option value={24}>A los 24 meses (Revisión bianual)</option>
                </select>
              </div>
            </div>

            {/* Treatments Checkboxes */}
            <div className="pt-2">
              <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-2">
                Tratamientos Ópticos Recomendados:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: "antireflejante_premium", label: "Antirreflejante HD Premium" },
                  { id: "filtro_azul", label: "Filtro Blue-Blocker (Pantallas)" },
                  { id: "fotocromatico", label: "Fotocromático Transitions" },
                  { id: "endurecido", label: "Capa Dura Anti-Rayado" },
                  { id: "hidrofobico", label: "Superhidrofóbico / Oleofóbico" },
                  { id: "polarizado", label: "Tratamiento Polarizado" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer dark:border-slate-800 dark:bg-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={treatments.includes(item.id)}
                      onChange={() => handleToggleTreatment(item.id)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-800 dark:text-slate-200 text-xs">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Observations */}
            <div className="pt-2">
              <label className="font-medium text-slate-700 dark:text-slate-300 text-xs block mb-1">
                Observaciones Clínicas y Anamnesis
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-slate-300 bg-white p-2.5 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900"
                placeholder="Indicar síntomas, confort con prueba ambulatoria, alineación pupilar o antecedentes corneales..."
                value={clinicalObservations}
                onChange={(e) => setClinicalObservations(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link href="/recetas">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="gap-2 shadow-md">
            <Save className="h-4 w-4" />
            <span>Guardar y Emitir Prescripción</span>
          </Button>
        </div>
      </form>

      {/* Official Print Modal */}
      <PrescriptionPrintModal
        prescription={savedPrescription}
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          router.push("/recetas");
        }}
      />
    </div>
  );
}

export default function NuevaRecetaPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-slate-500">
          Cargando gabinete de refracción...
        </div>
      }
    >
      <NuevaRecetaContent />
    </Suspense>
  );
}
