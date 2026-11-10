"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Plus,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  PlayCircle,
  AlertTriangle,
  Filter,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { opticaStore } from "@/lib/store";
import { Appointment, ServiceType, Customer } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function CitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [professionalFilter, setProfessionalFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State for New Appointment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [professionalId, setProfessionalId] = useState("usr-1");
  const [serviceType, setServiceType] = useState<ServiceType>("graduacion_completa");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [cabinetNumber, setCabinetNumber] = useState(1);
  const [notes, setNotes] = useState("");
  const [conflictError, setConflictError] = useState<string | null>(null);

  useEffect(() => {
    setAppointments(opticaStore.getAppointments());
    setCustomers(opticaStore.getCustomers());
    return opticaStore.subscribe(() => {
      setAppointments(opticaStore.getAppointments());
      setCustomers(opticaStore.getCustomers());
    });
  }, []);

  const handleUpdateStatus = (id: string, status: Appointment["status"]) => {
    opticaStore.updateAppointmentStatus(id, status);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const customer = customers.find((c) => c.id === customerId);
    if (!customer) {
      setConflictError("Selecciona un cliente válido");
      return;
    }

    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);

    const professionalName =
      professionalId === "usr-1"
        ? "Dra. Elena Ramos Gómez"
        : "Dr. Carlos Mendizábal";

    const result = opticaStore.addAppointment({
      customerId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerPhone: customer.phone,
      professionalId,
      professionalName,
      serviceType,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      status: "scheduled",
      cabinetNumber,
      notes,
    });

    if (!result.success) {
      setConflictError(result.error || "Solapamiento de horario detectado.");
      return;
    }

    // Reset & close
    setIsModalOpen(false);
    setCustomerId("");
    setNotes("");
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesProf =
      professionalFilter === "all" || apt.professionalId === professionalFilter;
    const matchesService =
      serviceFilter === "all" || apt.serviceType === serviceFilter;
    const matchesStatus =
      statusFilter === "all" || apt.status === statusFilter;

    return matchesProf && matchesService && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-teal-600" />
            <span>Agenda de Citas y Gabinete</span>
          </h1>
          <p className="text-xs text-slate-500">
            Control de citas clínicas, prevención de solapamientos y turnos de optometría
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Agendar Nueva Cita</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Professional filter */}
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Optometrista / Profesional:
              </label>
              <select
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-900"
                value={professionalFilter}
                onChange={(e) => setProfessionalFilter(e.target.value)}
              >
                <option value="all">Todos los profesionales</option>
                <option value="usr-1">Dra. Elena Ramos Gómez</option>
                <option value="usr-2">Dr. Carlos Mendizábal</option>
              </select>
            </div>

            {/* Service filter */}
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tipo de Servicio:
              </label>
              <select
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-900"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="all">Todos los servicios</option>
                <option value="graduacion_completa">Graduación Completa</option>
                <option value="adaptacion_lentillas">Adaptación Lentillas</option>
                <option value="revision_tension_ocular">Tensión Ocular</option>
                <option value="control_infantil">Control Infantil</option>
                <option value="entrega_ajuste">Entrega y Ajuste</option>
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Estado:
              </label>
              <select
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="scheduled">Programadas</option>
                <option value="confirmed">Confirmadas</option>
                <option value="in_consultation">En Consulta</option>
                <option value="completed">Completadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List / Grid */}
      <div className="space-y-3">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => {
            const startDate = new Date(apt.startTime);
            const endDate = new Date(apt.endTime);
            const timeRange = `${startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${endDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`;

            return (
              <Card
                key={apt.id}
                className="hover:border-teal-300 dark:hover:border-teal-800 transition-colors shadow-sm"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Time & Cabinet Badge */}
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-20 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/60 dark:border-teal-800 flex flex-col items-center justify-center shrink-0">
                        <span className="font-mono text-xs font-bold text-teal-800 dark:text-teal-300">
                          {startDate.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <span className="font-mono text-sm font-extrabold text-teal-950 dark:text-teal-100">
                          {startDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 font-semibold">
                            {timeRange}
                          </span>
                          <span className="text-slate-300">·</span>
                          <Badge variant="outline" className="text-[10px]">
                            Gabinete {apt.cabinetNumber}
                          </Badge>
                          <span className="text-slate-300">·</span>
                          <Badge
                            variant={
                              apt.status === "in_consultation"
                                ? "warning"
                                : apt.status === "confirmed"
                                ? "teal"
                                : apt.status === "completed"
                                ? "success"
                                : apt.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {apt.status === "in_consultation"
                              ? "En Consulta"
                              : apt.status === "confirmed"
                              ? "Confirmada"
                              : apt.status === "completed"
                              ? "Completada"
                              : apt.status === "cancelled"
                              ? "Cancelada"
                              : "Programada"}
                          </Badge>
                        </div>

                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {apt.customerName}
                        </h2>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {apt.customerPhone}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="h-3 w-3 text-teal-600" />
                            {apt.professionalName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {apt.status !== "in_consultation" &&
                        apt.status !== "completed" &&
                        apt.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs text-teal-700 hover:bg-teal-50 dark:text-teal-300"
                            onClick={() =>
                              handleUpdateStatus(apt.id, "in_consultation")
                            }
                          >
                            <PlayCircle className="h-3.5 w-3.5 mr-1" />
                            Iniciar Consulta
                          </Button>
                        )}

                      {apt.status === "in_consultation" && (
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleUpdateStatus(apt.id, "completed")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Finalizar Consulta
                        </Button>
                      )}

                      {apt.status !== "completed" &&
                        apt.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            onClick={() =>
                              handleUpdateStatus(apt.id, "cancelled")
                            }
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Cancelar
                          </Button>
                        )}
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Notas clínicas:
                      </span>{" "}
                      {apt.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-slate-500 text-sm">
              No hay citas programadas con los filtros seleccionados.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal Nueva Cita */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-teal-600" />
              <span>Programar Cita en Gabinete</span>
            </DialogTitle>
          </DialogHeader>

          {conflictError && (
            <div className="p-3 rounded-lg border border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{conflictError}</span>
            </div>
          )}

          <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Paciente / Cliente *
              </label>
              <select
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              >
                <option value="">-- Seleccionar Paciente --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Optometrista Asignado *
                </label>
                <select
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                >
                  <option value="usr-1">Dra. Elena Ramos Gómez</option>
                  <option value="usr-2">Dr. Carlos Mendizábal</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Gabinete
                </label>
                <select
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={cabinetNumber}
                  onChange={(e) => setCabinetNumber(parseInt(e.target.value))}
                >
                  <option value={1}>Gabinete 1 (Refracción Principal)</option>
                  <option value={2}>Gabinete 2 (Contactología y Lámpara)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Hora Inicio *
                </label>
                <input
                  type="time"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Duración
                </label>
                <select
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                >
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tipo de Servicio
              </label>
              <select
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
              >
                <option value="graduacion_completa">Graduación Completa (Subjetiva + Objetiva)</option>
                <option value="adaptacion_lentillas">Adaptación y Control de Lentillas</option>
                <option value="revision_tension_ocular">Tonometría / Tensión Ocular</option>
                <option value="control_infantil">Optometría Infantil / Terapia Visual</option>
                <option value="entrega_ajuste">Entrega y Ajuste Anatómico</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Motivo de Consulta / Observaciones
              </label>
              <textarea
                rows={2}
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                placeholder="Indicar síntomas, motivo de cita..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                Confirmar y Agendar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
