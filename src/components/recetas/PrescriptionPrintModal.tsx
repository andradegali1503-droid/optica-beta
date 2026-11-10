"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Prescription } from "@/lib/types";
import { formatDiopter, formatDate } from "@/lib/utils";
import { Printer, Glasses, ShieldCheck, Check } from "lucide-react";

interface PrescriptionPrintModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrescriptionPrintModal({
  prescription,
  isOpen,
  onClose,
}: PrescriptionPrintModalProps) {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="no-print flex flex-row items-center justify-between pb-2 border-b">
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Printer className="h-4 w-4 text-teal-600" />
            <span>Prescripción Óptica Oficial</span>
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handlePrint} className="gap-1.5 shadow-sm">
              <Printer className="h-4 w-4" />
              <span>Imprimir / Guardar PDF</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Official Document */}
        <div className="p-6 bg-white text-slate-950 font-sans print:p-0 print:m-0" id="printable-rx">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-teal-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-teal-700 flex items-center justify-center text-white">
                <Glasses className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-teal-950">
                  CENTRO ÓPTICO CLÍNICO ÓPTICAPRO
                </h2>
                <p className="text-xs text-slate-600">
                  Gabinete de Optometría y Contactología Avanzada · CIF: B-88741256
                </p>
                <p className="text-xs text-slate-500">
                  Calle Gran Vía 42, Madrid · Tel: 91 555 43 21 · www.opticapro.com
                </p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className="font-semibold text-slate-700">DOCUMENTO SANITARIO</p>
              <p className="font-mono text-teal-800 font-bold text-sm">
                Nº: {prescription.id.toUpperCase()}
              </p>
              <p className="text-slate-500">
                Fecha: {formatDate(prescription.examinationDate)}
              </p>
            </div>
          </div>

          {/* Patient & Optometrist Information */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-xs">
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                Datos del Paciente
              </p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {prescription.customerName}
              </p>
              <p className="text-slate-600">ID Paciente: {prescription.customerId}</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                Optometrista Responsable
              </p>
              <p className="text-sm font-bold text-teal-900 mt-0.5">
                {prescription.optometristName}
              </p>
              <p className="text-slate-600 font-mono">
                {prescription.licenseNumber || "Nº Col: 2849"}
              </p>
            </div>
          </div>

          {/* Standard Optical Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-2">
              Fórmula de Refracción Subjetiva
            </h3>
            <table className="w-full text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-teal-50 text-teal-950 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 p-2 text-left w-16">Ojo</th>
                  <th className="border border-slate-300 p-2 text-center">Esfera (SPH)</th>
                  <th className="border border-slate-300 p-2 text-center">Cilindro (CYL)</th>
                  <th className="border border-slate-300 p-2 text-center">Eje (AXIS)</th>
                  <th className="border border-slate-300 p-2 text-center">Adición (ADD)</th>
                  <th className="border border-slate-300 p-2 text-center">DP Mono (mm)</th>
                  <th className="border border-slate-300 p-2 text-center">AV (Snellen)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-center">
                {/* Ojo Derecho */}
                <tr className="border-b border-slate-200">
                  <td className="border border-slate-300 p-2 text-left font-sans font-bold bg-slate-50 text-slate-800">
                    OD (Derecho)
                  </td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-900">
                    {formatDiopter(prescription.rightEye.sphere)} D
                  </td>
                  <td className="border border-slate-300 p-2">
                    {prescription.rightEye.cylinder
                      ? `${formatDiopter(prescription.rightEye.cylinder)} D`
                      : "—"}
                  </td>
                  <td className="border border-slate-300 p-2">
                    {prescription.rightEye.axis !== undefined
                      ? `${prescription.rightEye.axis}°`
                      : "—"}
                  </td>
                  <td className="border border-slate-300 p-2 text-teal-800 font-semibold">
                    {prescription.rightEye.addition
                      ? `+${prescription.rightEye.addition.toFixed(2)} D`
                      : "—"}
                  </td>
                  <td className="border border-slate-300 p-2">
                    {prescription.rightEye.pupillaryDistance
                      ? `${prescription.rightEye.pupillaryDistance} mm`
                      : "—"}
                  </td>
                  <td className="border border-slate-300 p-2 font-sans">
                    {prescription.rightEye.visualAcuity || "1.0"}
                  </td>
                </tr>

                {/* Ojo Izquierdo */}
                <tr>
                  <td className="border border-slate-300 p-2 text-left font-sans font-bold bg-slate-50 text-slate-800">
                    OI (Izquierdo)
                  </td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-900">
                    {formatDiopter(prescription.leftEye.sphere)} D
                  </td>
                  <td className="border border-slate-300 p-2">
                    {prescription.leftEye.cylinder
                      ? `${formatDiopter(prescription.leftEye.cylinder)} D`
                      : "—"}
                  </td>
                  <td className="border border-slate-300 p-2">
                    {prescription.leftEye.axis !== undefined
                      ? `${prescription.leftEye.axis}°`
                      : "—"}
                  </td>
                  <td className="border border-slate-300 p-2 text-teal-800 font-semibold">
                    {prescription.leftEye.addition
                      ? `+${prescription.leftEye.addition.toFixed(2)} D`
                      : "—"}
                  </td>
                  <td className="border border-slate-300 p-2">
                    {prescription.leftEye.pupillaryDistance
                      ? `${prescription.leftEye.pupillaryDistance} mm`
                      : "—"}
                  </td>
                  <td className="border border-slate-300 p-2 font-sans">
                    {prescription.leftEye.visualAcuity || "1.0"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Additional Lens & Contactology details */}
          <div className="grid grid-cols-2 gap-4 border border-slate-200 p-3 rounded-lg mb-6 text-xs">
            <div>
              <p className="font-bold text-slate-800 mb-1">
                Tipo de Geometría Prescrita:
              </p>
              <p className="text-teal-900 font-semibold capitalize">
                {prescription.lensType.replace("_", " ")}
              </p>
              {prescription.pupillaryDistanceBinocular && (
                <p className="text-slate-600 mt-1">
                  DP Binocular Lejos: {prescription.pupillaryDistanceBinocular} mm
                </p>
              )}
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1">
                Tratamientos Ópticos Recomendados:
              </p>
              {prescription.treatments && prescription.treatments.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {prescription.treatments.map((t) => (
                    <span
                      key={t}
                      className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px]"
                    >
                      {t.replace("_", " ")}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">Sin tratamientos especiales prescritos.</p>
              )}
            </div>
          </div>

          {/* Observations */}
          {prescription.clinicalObservations && (
            <div className="bg-slate-50 p-3 rounded border border-slate-200 mb-6 text-xs">
              <p className="font-bold text-slate-800 mb-1">Observaciones Clínicas:</p>
              <p className="text-slate-700">{prescription.clinicalObservations}</p>
            </div>
          )}

          {/* Signature and Legal Notice */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="max-w-xs text-[10px] text-slate-500">
              <p className="flex items-center gap-1 font-semibold text-slate-700 mb-0.5">
                <ShieldCheck className="h-3 w-3 text-teal-600" />
                Validez Clínica Sanitaria
              </p>
              <p>
                Esta prescripción tiene una vigencia recomendada de 12 meses.
                Conforme a la normativa RGPD/LOPD, estos datos médicos son confidenciales.
              </p>
            </div>
            <div className="text-center w-48 border-t border-slate-400 pt-2">
              <p className="text-[11px] font-bold text-slate-900">
                Firma y Sello del Óptico
              </p>
              <p className="text-[10px] text-slate-500">
                {prescription.optometristName}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
