"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Plus,
  Search,
  Printer,
  Calendar,
  User,
  Filter,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { opticaStore } from "@/lib/store";
import { Prescription } from "@/lib/types";
import { formatDate, formatDiopter } from "@/lib/utils";
import { PrescriptionPrintModal } from "@/components/recetas/PrescriptionPrintModal";

export default function RecetasPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lensFilter, setLensFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    setPrescriptions(opticaStore.getPrescriptions());
    return opticaStore.subscribe(() => {
      setPrescriptions(opticaStore.getPrescriptions());
    });
  }, []);

  const filtered = prescriptions.filter((rx) => {
    const matchesSearch =
      (rx.customerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.optometristName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLens = lensFilter === "all" || rx.lensType === lensFilter;

    return matchesSearch && matchesLens;
  });

  const handlePrint = (rx: Prescription) => {
    setSelectedPrescription(rx);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Eye className="h-5 w-5 text-teal-600" />
            <span>Recetas y Prescripciones Clínicas</span>
          </h1>
          <p className="text-xs text-slate-500">
            Historial de refracción optométrica, agudeza visual y especificación de lentes
          </p>
        </div>

        <Link href="/recetas/nueva">
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Nueva Prescripción</span>
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por paciente, optometrista o ID de receta..."
                className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 bg-slate-50 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                value={lensFilter}
                onChange={(e) => setLensFilter(e.target.value)}
              >
                <option value="all">Todas las geometrías</option>
                <option value="monofocal_far">Monofocal Lejos</option>
                <option value="monofocal_near">Monofocal Cerca</option>
                <option value="progressive">Progresivo</option>
                <option value="contact_soft">Lentillas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List / Cards */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((rx) => (
            <Card
              key={rx.id}
              className="hover:border-teal-300 dark:hover:border-teal-800 transition-colors shadow-sm"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Patient & Meta */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                        {rx.id.toUpperCase()}
                      </span>
                      <span className="text-slate-300">·</span>
                      <Badge variant="secondary" className="capitalize text-[11px]">
                        {rx.lensType.replace("_", " ")}
                      </Badge>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(rx.examinationDate)}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {rx.customerName}
                    </h2>

                    <p className="text-xs text-slate-500">
                      Optometrista: {rx.optometristName} ({rx.licenseNumber || "Col. 2849"})
                    </p>
                  </div>

                  {/* Middle: Optical Summary Pill */}
                  <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs">
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                        Ojo Derecho (OD):
                      </p>
                      <p className="font-mono text-teal-900 dark:text-teal-300 font-bold">
                        Esf: {formatDiopter(rx.rightEye.sphere)}
                        {rx.rightEye.cylinder !== undefined && (
                          <span>
                            {" "}
                            / Cil: {formatDiopter(rx.rightEye.cylinder)} {rx.rightEye.axis}°
                          </span>
                        )}
                        {rx.rightEye.addition !== undefined && (
                          <span className="text-teal-600 font-semibold">
                            {" "}
                            / Add: +{rx.rightEye.addition.toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                        Ojo Izquierdo (OI):
                      </p>
                      <p className="font-mono text-teal-900 dark:text-teal-300 font-bold">
                        Esf: {formatDiopter(rx.leftEye.sphere)}
                        {rx.leftEye.cylinder !== undefined && (
                          <span>
                            {" "}
                            / Cil: {formatDiopter(rx.leftEye.cylinder)} {rx.leftEye.axis}°
                          </span>
                        )}
                        {rx.leftEye.addition !== undefined && (
                          <span className="text-teal-600 font-semibold">
                            {" "}
                            / Add: +{rx.leftEye.addition.toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs text-teal-700 dark:text-teal-300"
                      onClick={() => handlePrint(rx)}
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Imprimir / PDF</span>
                    </Button>

                    <Link href={`/ventas?rxId=${rx.id}&customerId=${rx.customerId}`}>
                      <Button size="sm" variant="secondary" className="text-xs">
                        Crear Pedido
                      </Button>
                    </Link>
                  </div>
                </div>

                {rx.clinicalObservations && (
                  <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 italic">
                    «{rx.clinicalObservations}»
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-slate-500 text-sm">
              No se encontraron prescripciones ópticas con esos filtros.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Official Print Modal */}
      <PrescriptionPrintModal
        prescription={selectedPrescription}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
}
