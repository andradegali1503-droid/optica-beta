"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Glasses,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { opticaStore } from "@/lib/store";
import { Customer, Prescription, Appointment } from "@/lib/types";
import { formatDate, formatDateTime, formatDiopter } from "@/lib/utils";

function ClientesContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // New Customer Modal
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [phone, setPhone] = useState("+34 ");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");

  useEffect(() => {
    const list = opticaStore.getCustomers();
    setCustomers(list);
    if (queryId) {
      const match = list.find((c) => c.id === queryId);
      if (match) {
        setSelectedCustomer(match);
        setIsDetailOpen(true);
      }
    }
    return opticaStore.subscribe(() => {
      setCustomers(opticaStore.getCustomers());
    });
  }, [queryId]);

  const filtered = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.taxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const created = opticaStore.addCustomer({
      firstName,
      lastName,
      taxId,
      birthDate,
      phone,
      email,
      address,
      medicalNotes,
    });
    setIsNewCustomerOpen(false);
    // Reset
    setFirstName("");
    setLastName("");
    setTaxId("");
    setPhone("+34 ");
    setEmail("");
    setMedicalNotes("");

    setSelectedCustomer(created);
    setIsDetailOpen(true);
  };

  const customerPrescriptions: Prescription[] = selectedCustomer
    ? opticaStore.getPrescriptionsByCustomerId(selectedCustomer.id)
    : [];

  const customerAppointments: Appointment[] = selectedCustomer
    ? opticaStore
        .getAppointments()
        .filter((a) => a.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-600" />
            <span>Pacientes y Expedientes Clínicos</span>
          </h1>
          <p className="text-xs text-slate-500">
            Fichero de clientes, historial de refracciones y citas asociadas
          </p>
        </div>

        <Button onClick={() => setIsNewCustomerOpen(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Registrar Nuevo Paciente</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, apellidos, DNI/NIE, teléfono o email..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 bg-slate-50 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer) => {
          const rxCount = opticaStore.getPrescriptionsByCustomerId(customer.id).length;

          return (
            <Card
              key={customer.id}
              className="hover:border-teal-300 dark:hover:border-teal-800 transition-colors shadow-sm cursor-pointer"
              onClick={() => handleOpenCustomer(customer)}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {customer.firstName} {customer.lastName}
                    </h2>
                    <p className="font-mono text-xs text-teal-700 dark:text-teal-400 font-semibold">
                      DNI: {customer.taxId}
                    </p>
                  </div>
                  <Badge variant="teal" className="text-[10px]">
                    {rxCount} {rxCount === 1 ? "Receta" : "Recetas"}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}
                </div>

                {customer.medicalNotes && (
                  <div className="p-2 rounded bg-amber-50/70 border border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 line-clamp-2">
                    <strong>Alerta médica:</strong> {customer.medicalNotes}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Alta: {formatDate(customer.createdAt)}
                  </span>
                  <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
                    Ver Expediente
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Customer Detail Drawer / Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedCustomer && (
            <div className="space-y-6">
              <DialogHeader className="border-b pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-lg font-bold">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </DialogTitle>
                    <p className="text-xs text-slate-500 mt-0.5">
                      DNI: <span className="font-mono">{selectedCustomer.taxId}</span> ·
                      Nacimiento: {selectedCustomer.birthDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/recetas/nueva?customerId=${selectedCustomer.id}`}
                      onClick={() => setIsDetailOpen(false)}
                    >
                      <Button size="sm" className="gap-1.5 text-xs">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Nueva Receta</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </DialogHeader>

              {/* Contact and Medical Warning */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contacto
                  </p>
                  <p>Teléfono: {selectedCustomer.phone}</p>
                  <p>Email: {selectedCustomer.email || "—"}</p>
                  <p>Dirección: {selectedCustomer.address || "—"}</p>
                </div>

                <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200">
                  <p className="font-semibold flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-400">
                    <ShieldAlert className="h-4 w-4" />
                    Antecedentes Médicos / Oculares
                  </p>
                  <p className="text-[11px]">
                    {selectedCustomer.medicalNotes ||
                      "Sin patologías ni advertencias oculares registradas."}
                  </p>
                </div>
              </div>

              {/* Prescriptions History Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                  <Glasses className="h-4 w-4" />
                  <span>Historial de Graduaciones ({customerPrescriptions.length})</span>
                </h3>

                {customerPrescriptions.length > 0 ? (
                  <div className="space-y-2">
                    {customerPrescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {formatDate(rx.examinationDate)} · {rx.optometristName}
                          </span>
                          <Badge variant="secondary" className="capitalize text-[10px]">
                            {rx.lensType.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-teal-900 dark:text-teal-300">
                          <div>
                            OD: Esf {formatDiopter(rx.rightEye.sphere)} / Cil{" "}
                            {formatDiopter(rx.rightEye.cylinder)} {rx.rightEye.axis}°
                          </div>
                          <div>
                            OI: Esf {formatDiopter(rx.leftEye.sphere)} / Cil{" "}
                            {formatDiopter(rx.leftEye.cylinder)} {rx.leftEye.axis}°
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Este paciente aún no tiene recetas registradas.
                  </p>
                )}
              </div>

              {/* Appointments History Section */}
              <div className="space-y-3 pt-2 border-t">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Historial de Citas ({customerAppointments.length})</span>
                </h3>

                {customerAppointments.length > 0 ? (
                  <div className="space-y-2">
                    {customerAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatDate(apt.startTime)} — {apt.serviceType.replace("_", " ")}
                          </p>
                          <p className="text-slate-500 text-[11px]">
                            {apt.professionalName} · Gabinete {apt.cabinetNumber}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Sin citas previas.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Registrar Nuevo Paciente */}
      <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-teal-600" />
              <span>Alta de Paciente en Clínica</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Laura"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Apellidos *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Gómez Sanz"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  DNI / NIE / CIF *
                </label>
                <input
                  type="text"
                  placeholder="Ej. 53819247R"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  placeholder="+34 600 000 000"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="paciente@correo.com"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Dirección Postal
              </label>
              <input
                type="text"
                placeholder="Calle, número, código postal, localidad..."
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Antecedentes Oculares y Alergias (Datos Sensibles RGPD)
              </label>
              <textarea
                rows={2}
                placeholder="Alergia a níquel, sospecha de glaucoma, antecedentes de desprendimiento de retina..."
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsNewCustomerOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                Guardar Paciente
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ClientesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-slate-500">
          Cargando listado de pacientes...
        </div>
      }
    >
      <ClientesContent />
    </Suspense>
  );
}
