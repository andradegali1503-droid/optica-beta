"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Glasses,
  Users,
  Boxes,
  FileSpreadsheet,
  Receipt,
  ShieldCheck,
  LayoutDashboard,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { opticaStore } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const [kpis, setKpis] = useState({
    todayAppointmentsCount: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const update = () => {
      const stats = opticaStore.getDashboardKPIs();
      setKpis({
        todayAppointmentsCount: stats.todayAppointmentsCount,
        lowStockCount: stats.lowStockCount,
      });
    };
    update();
    return opticaStore.subscribe(update);
  }, []);

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Agenda de Citas",
      href: "/citas",
      icon: CalendarDays,
      badge: kpis.todayAppointmentsCount > 0 ? `${kpis.todayAppointmentsCount} hoy` : undefined,
      badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
    },
    {
      title: "Recetas Ópticas",
      href: "/recetas",
      icon: Eye,
    },
    {
      title: "Clientes / Pacientes",
      href: "/clientes",
      icon: Users,
    },
    {
      title: "Inventario",
      href: "/inventario",
      icon: Boxes,
      badge: kpis.lowStockCount > 0 ? `${kpis.lowStockCount} alertas` : undefined,
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    },
    {
      title: "Ventas y Pedidos",
      href: "/ventas",
      icon: Receipt,
    },
    {
      title: "Auditoría RGPD",
      href: "/auditoria",
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 dark:border-slate-800 dark:bg-slate-950">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="h-9 w-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <Glasses className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
              ÓpticaPro
            </h1>
            <p className="text-[11px] font-medium text-teal-600 dark:text-teal-400">
              CLINICAL MANAGEMENT
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-50 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      isActive
                        ? "text-teal-600 dark:text-teal-400"
                        : "text-slate-400 dark:text-slate-500"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                      item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Clinical Workspace Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
            <span>Gabinete 1 Activo</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            Dra. Elena Ramos Gómez
          </p>
          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-mono mt-0.5">
            Col. Opt. #2849
          </p>
        </div>
      </div>
    </aside>
  );
}
