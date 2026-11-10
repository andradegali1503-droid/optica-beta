"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  AlertTriangle,
  Database,
  History,
  KeyRound,
  Download,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { opticaStore } from "@/lib/store";
import { AuditLog } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setLogs(opticaStore.getAuditLogs());
    return opticaStore.subscribe(() => {
      setLogs(opticaStore.getAuditLogs());
    });
  }, []);

  const handleExportAudit = () => {
    const json = JSON.stringify(logs, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria_clinica_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const handleResetData = () => {
    if (confirm("¿Deseas reiniciar los datos a la configuración inicial de fábrica?")) {
      opticaStore.resetToFactoryDefaults();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            <span>Auditoría de Seguridad y Cumplimiento RGPD</span>
          </h1>
          <p className="text-xs text-slate-500">
            Trazabilidad de accesos, modificaciones de recetas ópticas y control de datos sanitarios
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportAudit} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Descargar Pista de Auditoría</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetData}
            className="text-xs text-slate-500 hover:text-rose-600"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Restablecer Demo
          </Button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-teal-200 dark:border-teal-900/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-teal-900 dark:text-teal-300 flex items-center gap-2 uppercase tracking-wider">
              <Lock className="h-4 w-4 text-teal-600" />
              <span>Protección Datos Médicos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Cifrado y Segregación Activa
            </p>
            <p className="text-slate-500 text-[11px]">
              Las recetas y notas clínicas están protegidas como datos de categoría especial (Art. 9 RGPD).
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <KeyRound className="h-4 w-4 text-indigo-600" />
              <span>Matriz RBAC Vigente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              4 Roles Configurados
            </p>
            <p className="text-slate-500 text-[11px]">
              Admin, Optometrista (Firma Clínica), Asesor de Ventas, Recepción.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <Database className="h-4 w-4 text-emerald-600" />
              <span>Persistencia y Resiliencia</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Local Engine + PostgreSQL Ready
            </p>
            <p className="text-slate-500 text-[11px]">
              Sincronización en tiempo real y fallback offline para estaciones de gabinete.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RBAC Permissions Matrix Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Matriz de Control de Acceso por Roles (RBAC)
          </CardTitle>
          <CardDescription>
            Permisos autorizados según función clínica y comercial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b font-semibold text-slate-700 dark:text-slate-300">
                  <th className="p-3 pl-4">Área del Sistema</th>
                  <th className="p-3 text-center">Administrador</th>
                  <th className="p-3 text-center">Optometrista</th>
                  <th className="p-3 text-center">Asesor Ventas</th>
                  <th className="p-3 text-center pr-4">Recepción</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="p-3 pl-4 font-semibold">Prescripciones Ópticas (Emitir/Firmar)</td>
                  <td className="p-3 text-center text-slate-400">Supervisión</td>
                  <td className="p-3 text-center">
                    <Badge variant="success" className="text-[10px]">Total (Firma)</Badge>
                  </td>
                  <td className="p-3 text-center text-slate-400">Solo Lectura</td>
                  <td className="p-3 text-center pr-4 text-rose-500">Sin Acceso</td>
                </tr>
                <tr>
                  <td className="p-3 pl-4 font-semibold">Historial Clínico y Antecedentes</td>
                  <td className="p-3 text-center text-slate-400">Auditoría</td>
                  <td className="p-3 text-center">
                    <Badge variant="success" className="text-[10px]">Total</Badge>
                  </td>
                  <td className="p-3 text-center text-rose-500">Restringido</td>
                  <td className="p-3 text-center pr-4 text-rose-500">Sin Acceso</td>
                </tr>
                <tr>
                  <td className="p-3 pl-4 font-semibold">Agenda de Citas y Turnos</td>
                  <td className="p-3 text-center">
                    <Badge variant="secondary" className="text-[10px]">Gestión</Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="teal" className="text-[10px]">Propias + Estado</Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="secondary" className="text-[10px]">Ver / Asignar</Badge>
                  </td>
                  <td className="p-3 text-center pr-4">
                    <Badge variant="success" className="text-[10px]">Gestión Total</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 pl-4 font-semibold">Inventario, Ajustes y Costes</td>
                  <td className="p-3 text-center">
                    <Badge variant="success" className="text-[10px]">Total + Costes</Badge>
                  </td>
                  <td className="p-3 text-center">Solo Catálogo</td>
                  <td className="p-3 text-center">
                    <Badge variant="teal" className="text-[10px]">Ventas y Stock</Badge>
                  </td>
                  <td className="p-3 text-center pr-4">Consulta Stock</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <History className="h-4 w-4 text-teal-600" />
              <span>Registro de Eventos y Auditoría Inmutable</span>
            </CardTitle>
            <CardDescription>
              {logs.length} acciones registradas con sellado temporal
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b font-semibold text-slate-700 dark:text-slate-300">
                  <th className="p-3 pl-4">Fecha y Hora</th>
                  <th className="p-3">Usuario Responsable</th>
                  <th className="p-3">Acción</th>
                  <th className="p-3">Entidad</th>
                  <th className="p-3 pr-4">Detalles del Evento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="p-3 pl-4 font-mono text-slate-500">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                      {log.userName}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          log.action.includes("PRESCRIPTION")
                            ? "teal"
                            : log.action.includes("STOCK")
                            ? "warning"
                            : "secondary"
                        }
                        className="font-mono text-[10px]"
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                      {log.entityName}
                    </td>
                    <td className="p-3 pr-4 text-slate-600 dark:text-slate-300">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
