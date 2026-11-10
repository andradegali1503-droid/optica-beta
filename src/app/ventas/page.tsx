"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Receipt,
  Plus,
  Search,
  Printer,
  Glasses,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  CreditCard,
  Banknote,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { opticaStore } from "@/lib/store";
import { SaleOrder, Customer, Product, Prescription } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

function VentasContent() {
  const searchParams = useSearchParams();
  const queryRxId = searchParams.get("rxId");
  const queryCustomerId = searchParams.get("customerId");

  const [sales, setSales] = useState<SaleOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // New Order Modal
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(queryCustomerId || "");
  const [linkedPrescriptionId, setLinkedPrescriptionId] = useState(queryRxId || "");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [orderItems, setOrderItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "transfer">("card");
  const [orderNotes, setOrderNotes] = useState("");

  // Printable Receipt Modal
  const [selectedSale, setSelectedSale] = useState<SaleOrder | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    setSales(opticaStore.getSales());
    setCustomers(opticaStore.getCustomers());
    setProducts(opticaStore.getProducts());
    if (queryRxId || queryCustomerId) {
      setIsNewOrderOpen(true);
    }
    return opticaStore.subscribe(() => {
      setSales(opticaStore.getSales());
      setCustomers(opticaStore.getCustomers());
      setProducts(opticaStore.getProducts());
    });
  }, [queryRxId, queryCustomerId]);

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    setOrderItems((prev) => {
      const existing = prev.find((i) => i.product.id === prod.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === prod.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product: prod, quantity: 1 }];
    });
    setSelectedProductId("");
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems((prev) => prev.filter((i) => i.product.id !== id));
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.product.salePrice * item.quantity,
    0
  );
  const tax = Number((subtotal * 0.21).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer || orderItems.length === 0) return;

    const items = orderItems.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      sku: i.product.sku,
      quantity: i.quantity,
      unitPrice: i.product.salePrice,
      subtotal: i.product.salePrice * i.quantity,
    }));

    const created = opticaStore.addSale({
      customerId: selectedCustomerId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      prescriptionId: linkedPrescriptionId || undefined,
      items,
      subtotal,
      tax,
      total,
      status: "workshop",
      paymentStatus: "paid",
      paymentMethod,
      notes: orderNotes,
    });

    setIsNewOrderOpen(false);
    setOrderItems([]);
    setOrderNotes("");
    setSelectedSale(created);
    setIsReceiptModalOpen(true);
  };

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-teal-600" />
            <span>Ventas, Taller y Facturación</span>
          </h1>
          <p className="text-xs text-slate-500">
            Control de encargos ópticos, montaje en taller y emisión de tickets
          </p>
        </div>

        <Button onClick={() => setIsNewOrderOpen(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Nuevo Pedido / Venta</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por número de pedido o nombre de cliente..."
                className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 bg-slate-50 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-60">
              <select
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados de pedido</option>
                <option value="budget">Presupuesto</option>
                <option value="workshop">En taller de montaje</option>
                <option value="ready">Listo para entrega</option>
                <option value="delivered">Entregado al paciente</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredSales.map((sale) => (
          <Card
            key={sale.id}
            className="hover:border-teal-300 dark:hover:border-teal-800 transition-colors shadow-sm"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800 dark:text-teal-400">
                      {sale.orderNumber}
                    </span>
                    <span className="text-slate-300">·</span>
                    <Badge
                      variant={
                        sale.status === "delivered"
                          ? "success"
                          : sale.status === "workshop"
                          ? "warning"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {sale.status === "workshop"
                        ? "En Taller de Montaje"
                        : sale.status === "ready"
                        ? "Listo para Entrega"
                        : sale.status === "delivered"
                        ? "Entregado"
                        : "Presupuesto"}
                    </Badge>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      {formatDate(sale.createdAt)}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {sale.customerName}
                  </h2>

                  <div className="text-xs text-slate-500">
                    {sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(" + ")}
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <p className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100">
                      {formatCurrency(sale.total)}
                    </p>
                    <Badge variant="teal" className="text-[10px] capitalize">
                      {sale.paymentMethod} · Pagado
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-teal-700 dark:text-teal-300"
                    onClick={() => {
                      setSelectedSale(sale);
                      setIsReceiptModalOpen(true);
                    }}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Ticket</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Nuevo Pedido */}
      <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Receipt className="h-5 w-5 text-teal-600" />
              <span>Nuevo Pedido de Óptica / Encargo de Taller</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
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
                  Forma de Pago
                </label>
                <select
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  <option value="card">Tarjeta Bancaria</option>
                  <option value="cash">Efectivo en Caja</option>
                  <option value="transfer">Transferencia / Financiación</option>
                </select>
              </div>
            </div>

            {/* Item selector */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border space-y-2">
              <label className="font-medium text-slate-700 dark:text-slate-300 block">
                Añadir Producto o Lente al Pedido:
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <option value="">-- Seleccionar Artículo del Almacén --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — {formatCurrency(p.salePrice)} [Stock: {p.stockCurrent}]
                    </option>
                  ))}
                </select>
                <Button type="button" size="sm" onClick={handleAddItem} className="shrink-0">
                  Añadir
                </Button>
              </div>
            </div>

            {/* Added Items List */}
            {orderItems.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b">
                    <tr>
                      <th className="p-2 pl-3">Artículo</th>
                      <th className="p-2 text-center">Cant.</th>
                      <th className="p-2 text-right">PVP</th>
                      <th className="p-2 text-right">Total</th>
                      <th className="p-2 text-center w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orderItems.map((item) => (
                      <tr key={item.product.id}>
                        <td className="p-2 pl-3 font-medium">
                          {item.product.name}
                        </td>
                        <td className="p-2 text-center font-mono">
                          {item.quantity}
                        </td>
                        <td className="p-2 text-right font-mono">
                          {formatCurrency(item.product.salePrice)}
                        </td>
                        <td className="p-2 text-right font-mono font-bold">
                          {formatCurrency(item.product.salePrice * item.quantity)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Total calculation */}
            <div className="bg-teal-50/60 dark:bg-teal-950/30 p-3 rounded-lg border border-teal-200 dark:border-teal-900 text-xs flex justify-between items-center">
              <div>
                <p className="text-slate-500">
                  Base Imponible: {formatCurrency(subtotal)} · IVA (21%): {formatCurrency(tax)}
                </p>
                <p className="text-[11px] text-teal-800 dark:text-teal-400">
                  Descontará automáticamente el stock del inventario.
                </p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-xs">Total Factura:</span>
                <p className="text-xl font-bold font-mono text-teal-950 dark:text-teal-100">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Instrucciones para el Taller de Biselado / Montaje
              </label>
              <textarea
                rows={2}
                placeholder="Indicar si requiere ranurado, taladrado, bisel especial o reducción de espesor..."
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsNewOrderOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={orderItems.length === 0}>
                Emitir Encargo de Taller
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Ticket Imprimible */}
      <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="no-print">
            <DialogTitle className="text-base font-bold flex items-center justify-between">
              <span>Ticket / Justificante de Venta</span>
              <Button size="sm" onClick={() => window.print()} className="gap-1.5">
                <Printer className="h-4 w-4" />
                <span>Imprimir Ticket</span>
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <div className="p-4 bg-white text-slate-950 font-mono text-xs border border-dashed border-slate-300 rounded">
              <div className="text-center mb-4">
                <h3 className="font-bold text-sm">ÓPTICA MANAGEMENT PRO</h3>
                <p className="text-[11px]">CIF: B-88741256 · Tel: 91 555 43 21</p>
                <p className="text-[11px]">Calle Gran Vía 42, 28013 Madrid</p>
                <p className="text-[10px] mt-1 text-slate-500">
                  SIMPLIFICADA: {selectedSale.orderNumber}
                </p>
                <p className="text-[10px] text-slate-500">
                  Fecha: {formatDate(selectedSale.createdAt)}
                </p>
              </div>

              <div className="border-t border-b border-dashed py-2 my-2 space-y-1">
                <p>
                  <strong>Cliente:</strong> {selectedSale.customerName}
                </p>
                {selectedSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span>
                      {item.quantity}x {item.productName.substring(0, 24)}
                    </span>
                    <span>{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right pt-1 font-bold">
                <div className="flex justify-between">
                  <span>Base Imponible:</span>
                  <span>{formatCurrency(selectedSale.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-normal">
                  <span>IVA (21%):</span>
                  <span>{formatCurrency(selectedSale.tax)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-1 font-extrabold text-teal-900">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500 mt-4 pt-2 border-t border-dashed">
                <p>Garantía de adaptación de lentes progresivas: 30 días.</p>
                <p>¡Gracias por confiar en nuestra clínica visual!</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function VentasPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-slate-500">
          Cargando pedidos y facturación...
        </div>
      }
    >
      <VentasContent />
    </Suspense>
  );
}
