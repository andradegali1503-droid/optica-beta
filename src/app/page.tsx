"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  Boxes,
  TrendingUp,
  AlertTriangle,
  Eye,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  FileText,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "@/components/ui/number-ticker";
import { opticaStore } from "@/lib/store";
import { Appointment, Product, Prescription } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [kpis, setKpis] = useState(opticaStore.getDashboardKPIs());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    setMounted(true);
    const refreshData = () => {
      setKpis(opticaStore.getDashboardKPIs());
      setAppointments(opticaStore.getAppointments());
      setLowStockProducts(
        opticaStore.getProducts().filter((p) => p.stockCurrent <= p.stockMin)
      );
      setRecentPrescriptions(opticaStore.getPrescriptions().slice(0, 4));
    };

    refreshData();
    return opticaStore.subscribe(refreshData);
  }, []);

  if (!mounted) return null;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) =>
    a.startTime.startsWith(todayStr)
  );

  // Chart Data
  const weeklyActivityData = [
    { day: "Lun", graduaciones: 8, lentillas: 4, revisiones: 3 },
    { day: "Mar", graduaciones: 11, lentillas: 6, revisiones: 4 },
    { day: "Mié", graduaciones: 9, lentillas: 5, revisiones: 2 },
    { day: "Jue", graduaciones: 14, lentillas: 7, revisiones: 5 },
    { day: "Vie", graduaciones: 12, lentillas: 8, revisiones: 6 },
    { day: "Sáb", graduaciones: 6, lentillas: 3, revisiones: 2 },
  ];

  const categoryDistributionData = [
    { name: "Monturas", value: 42, color: "#0d9488" },
    { name: "Lentes Oftálmicas", value: 35, color: "#14b8a6" },
    { name: "Lentillas", value: 15, color: "#06b6d4" },
    { name: "Sol y Accesorios", value: 8, color: "#64748b" },
  ];

  const handleUpdateStatus = (id: string, status: Appointment["status"]) => {
    opticaStore.updateAppointmentStatus(id, status);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-medium mb-2 border border-teal-400/30">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>Sistema Clínico Operativo</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Panel de Control Óptico
          </h1>
          <p className="text-sm text-teal-100/80 mt-1">
            Gabinete activo: Dra. Elena Ramos Gómez · Gabinete 1 y 2 en funcionamiento.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/recetas/nueva">
            <Button className="bg-white text-teal-900 hover:bg-teal-50 font-semibold gap-1.5 shadow-sm">
              <Eye className="h-4 w-4 text-teal-700" />
              <span>Nueva Exploración</span>
            </Button>
          </Link>
          <Link href="/citas">
            <Button
              variant="outline"
              className="bg-teal-950/40 border-teal-400/30 text-white hover:bg-teal-900/60 gap-1.5"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Ver Agenda</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid with GSAP Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Citas de Hoy
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 flex items-center justify-center">
              <CalendarDays className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100">
              <NumberTicker value={kpis.todayAppointmentsCount} />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-teal-600 font-semibold">
                {kpis.confirmedAppointmentsCount} confirmadas
              </span>{" "}
              para hoy
            </p>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Recetas Emitidas
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100">
              <NumberTicker value={kpis.totalPrescriptionsCount} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Prescripciones clínicas históricas
            </p>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Pacientes Activos
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100">
              <NumberTicker value={kpis.totalCustomersCount} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Historiales clínicos registrados
            </p>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card
          className={`border-slate-200/80 shadow-sm ${
            kpis.lowStockCount > 0
              ? "border-amber-300/80 bg-amber-50/20 dark:bg-amber-950/10"
              : ""
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Alertas de Stock
            </CardTitle>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                kpis.lowStockCount > 0
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100">
              <NumberTicker value={kpis.lowStockCount} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {kpis.lowStockCount > 0 ? (
                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                  Requiere reposición urgente
                </span>
              ) : (
                <span className="text-emerald-600">Stock en niveles óptimos</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Charts & Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Actividad Clínica Semanal
                </CardTitle>
                <CardDescription>
                  Distribución de consultas por tipo de atención
                </CardDescription>
              </div>
              <Badge variant="teal">Semana en Curso</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivityData}>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#1e293b",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="graduaciones"
                      name="Graduaciones"
                      fill="#0d9488"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="lentillas"
                      name="Contactología"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="revisiones"
                      name="Revisiones"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stock Alarms Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Artículos con Stock Bajo o Crítico</span>
                </CardTitle>
                <CardDescription>
                  Materiales bajo el umbral de reposición mínima del almacén
                </CardDescription>
              </div>
              <Link href="/inventario">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <span>Gestionar Almacén</span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="py-3 flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {p.name}
                        </p>
                        <p className="text-slate-500">
                          SKU: <span className="font-mono">{p.sku}</span> · Proveedor:{" "}
                          {p.supplierName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="font-mono font-bold text-amber-600 dark:text-amber-400">
                            {p.stockCurrent} uds restantes
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Mínimo: {p.stockMin} uds
                          </p>
                        </div>
                        <Link href="/inventario">
                          <Button size="sm" variant="secondary" className="h-7 text-xs">
                            Reponer
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 py-4 text-center">
                  Todos los artículos están por encima del stock mínimo.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Today's Appointments & Recent Prescriptions */}
        <div className="space-y-6">
          {/* Today's Appointments Agenda */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  Agenda de Hoy
                </CardTitle>
                <CardDescription>
                  {todayAppointments.length} consultas previstas
                </CardDescription>
              </div>
              <Link href="/citas">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <span>Ver Todas</span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => {
                    const startHour = new Date(apt.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={apt.id}
                        className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {startHour}
                          </span>
                          <Badge
                            variant={
                              apt.status === "in_consultation"
                                ? "warning"
                                : apt.status === "confirmed"
                                ? "teal"
                                : apt.status === "completed"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {apt.status === "in_consultation"
                              ? "En Consulta"
                              : apt.status === "confirmed"
                              ? "Confirmada"
                              : apt.status === "completed"
                              ? "Completada"
                              : "Programada"}
                          </Badge>
                        </div>

                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {apt.customerName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {apt.serviceType === "graduacion_completa"
                              ? "Graduación Completa"
                              : apt.serviceType === "revision_tension_ocular"
                              ? "Tensión Ocular"
                              : apt.serviceType === "adaptacion_lentillas"
                              ? "Adaptación Lentillas"
                              : "Control / Entrega"}{" "}
                            · Gab. {apt.cabinetNumber}
                          </p>
                        </div>

                        {/* Action buttons for appointment */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                          {apt.status !== "in_consultation" &&
                            apt.status !== "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs flex-1 text-teal-700 hover:bg-teal-50 dark:text-teal-400"
                                onClick={() =>
                                  handleUpdateStatus(apt.id, "in_consultation")
                                }
                              >
                                <PlayCircle className="h-3.5 w-3.5 mr-1" />
                                Iniciar
                              </Button>
                            )}

                          {apt.status === "in_consultation" && (
                            <Button
                              size="sm"
                              className="h-7 text-xs flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() =>
                                handleUpdateStatus(apt.id, "completed")
                              }
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Finalizar
                            </Button>
                          )}

                          <Link
                            href={`/recetas/nueva?customerId=${apt.customerId}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-7 text-xs w-full"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Receta
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No hay citas programadas para el día de hoy.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Prescriptions Mini Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  Últimas Prescripciones
                </CardTitle>
                <CardDescription>Exploraciones recientes</CardDescription>
              </div>
              <Link href="/recetas">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <span>Ver Histórico</span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {rx.customerName}
                      </p>
                      <p className="text-slate-500 font-mono text-[11px]">
                        OD: {rx.rightEye.sphere > 0 ? "+" : ""}
                        {rx.rightEye.sphere.toFixed(2)} / OI:{" "}
                        {rx.leftEye.sphere > 0 ? "+" : ""}
                        {rx.leftEye.sphere.toFixed(2)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize text-[10px]">
                      {rx.lensType.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
