"use client";

import { useState } from "react";
import {
  Search,
  Moon,
  Sun,
  Plus,
  Eye,
  Calendar,
  UserPlus,
  Bell,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { opticaStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const customers = opticaStore.getCustomers();
  const products = opticaStore.getProducts();

  const filteredCustomers = searchQuery.trim()
    ? customers.filter(
        (c) =>
          c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.taxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery)
      )
    : [];

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 dark:border-slate-800 dark:bg-slate-950">
      {/* Global Quick Search */}
      <div className="relative w-80">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar paciente, DNI, montura o SKU..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.length > 0) setIsSearchOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.length > 0) setIsSearchOpen(true);
            }}
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 mt-2 w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Pacientes ({filteredCustomers.length})
            </div>
            {filteredCustomers.length > 0 ? (
              <div className="space-y-1 mb-3">
                {filteredCustomers.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      router.push(`/clientes?id=${c.id}`);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        DNI: {c.taxId} · Tel: {c.phone}
                      </p>
                    </div>
                    <span className="text-[10px] text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                      Ver Ficha
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mb-3">Sin pacientes coincidentes.</p>
            )}

            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 border-t pt-2 dark:border-slate-800">
              Productos ({filteredProducts.length})
            </div>
            {filteredProducts.length > 0 ? (
              <div className="space-y-1">
                {filteredProducts.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      router.push(`/inventario?sku=${p.sku}`);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        SKU: {p.sku} · Stock: {p.stockCurrent} uds
                      </p>
                    </div>
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                      {p.salePrice}€
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Sin productos coincidentes.</p>
            )}
          </div>
        )}
      </div>

      {/* Quick Action Tools & Status */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <Link href="/recetas/nueva">
          <Button size="sm" className="gap-1.5 shadow-sm">
            <Eye className="h-4 w-4" />
            <span>Nueva Receta</span>
          </Button>
        </Link>

        <Link href="/citas">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>Agendar Cita</span>
          </Button>
        </Link>

        {/* Dark/Light mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          title="Alternar Modo Oscuro"
          className="text-slate-600 dark:text-slate-300"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* User Identity Chip */}
        <div className="h-9 pl-3 pr-4 rounded-full border border-slate-200 bg-slate-50 flex items-center gap-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-6 w-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-semibold">
            ER
          </div>
          <div className="text-left leading-none">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Dra. E. Ramos
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Optometrista
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
