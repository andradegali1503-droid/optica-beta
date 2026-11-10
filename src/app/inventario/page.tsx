"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  ArrowUpDown,
  Download,
  Barcode,
  Package,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { opticaStore } from "@/lib/store";
import { Product, ProductCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");

  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(1);
  const [adjustType, setAdjustType] = useState<"in" | "out">("in");
  const [adjustReason, setAdjustReason] = useState("Entrada de albarán proveedor");

  // Create Product Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSku, setNewSku] = useState("");
  const [newBarcode, setNewBarcode] = useState("");
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState<ProductCategory>("frame");
  const [newCostPrice, setNewCostPrice] = useState(45);
  const [newSalePrice, setNewSalePrice] = useState(120);
  const [newStock, setNewStock] = useState(5);
  const [newStockMin, setNewStockMin] = useState(2);

  useEffect(() => {
    setProducts(opticaStore.getProducts());
    return opticaStore.subscribe(() => {
      setProducts(opticaStore.getProducts());
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);

    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;

    let matchesStock = true;
    if (stockStatusFilter === "low") {
      matchesStock = p.stockCurrent <= p.stockMin;
    } else if (stockStatusFilter === "out") {
      matchesStock = p.stockCurrent === 0;
    } else if (stockStatusFilter === "ok") {
      matchesStock = p.stockCurrent > p.stockMin;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAdjust = (product: Product) => {
    setSelectedProduct(product);
    setAdjustQuantity(1);
    setIsAdjustModalOpen(true);
  };

  const handleConfirmAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const delta = adjustType === "in" ? adjustQuantity : -adjustQuantity;
    opticaStore.adjustStock(selectedProduct.id, delta, adjustReason);
    setIsAdjustModalOpen(false);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    opticaStore.addProduct({
      sku: newSku,
      barcode: newBarcode,
      name: newName,
      brand: newBrand,
      category: newCategory,
      costPrice: newCostPrice,
      salePrice: newSalePrice,
      stockCurrent: newStock,
      stockMin: newStockMin,
      supplierId: "sup-1",
      supplierName: "Luxottica España",
      specifications: {},
    });

    setIsCreateModalOpen(false);
    // Reset
    setNewSku("");
    setNewBarcode("");
    setNewName("");
    setNewBrand("");
  };

  const exportCSV = () => {
    const headers = "SKU,CodigoBarras,Nombre,Marca,Categoria,Coste,PVP,Stock,StockMin\n";
    const rows = products
      .map(
        (p) =>
          `"${p.sku}","${p.barcode}","${p.name}","${p.brand}","${p.category}",${p.costPrice},${p.salePrice},${p.stockCurrent},${p.stockMin}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventario_optica_${new Date().toISOString().split("T")[0]}.csv`);
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Boxes className="h-5 w-5 text-teal-600" />
            <span>Inventario de Óptica y Almacén</span>
          </h1>
          <p className="text-xs text-slate-500">
            Control de monturas, lentes oftálmicas, contactología y trazabilidad de movimientos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Exportar CSV</span>
          </Button>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, SKU, marca o código..."
                className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 bg-slate-50 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <select
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-900"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                <option value="frame">Monturas Graduado</option>
                <option value="ophthalmic_lens">Lentes Oftálmicas</option>
                <option value="contact_lens">Lentes de Contacto</option>
                <option value="sunglasses">Gafas de Sol</option>
                <option value="solution">Soluciones y Líquidos</option>
              </select>
            </div>

            <div>
              <select
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-900"
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value)}
              >
                <option value="all">Todos los niveles de stock</option>
                <option value="low">En alerta (Stock bajo)</option>
                <option value="out">Sin stock (Agotados)</option>
                <option value="ok">Stock adecuado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                <th className="p-3 pl-4">Artículo & Marca</th>
                <th className="p-3">SKU / Código</th>
                <th className="p-3">Categoría</th>
                <th className="p-3 text-right">Coste / PVP</th>
                <th className="p-3 text-center">Stock Actual</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-right pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const isLow = p.stockCurrent <= p.stockMin && p.stockCurrent > 0;
                  const isOut = p.stockCurrent === 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="p-3 pl-4">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {p.brand} {p.model ? `· ${p.model}` : ""}
                        </p>
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                        <p className="font-semibold text-teal-800 dark:text-teal-300">
                          {p.sku}
                        </p>
                        <p className="text-[10px] text-slate-400">{p.barcode}</p>
                      </td>
                      <td className="p-3 capitalize">
                        <Badge variant="secondary" className="text-[10px]">
                          {p.category.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(p.salePrice)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Coste: {formatCurrency(p.costPrice)}
                        </p>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-sm">
                        <span
                          className={
                            isOut
                              ? "text-rose-600"
                              : isLow
                              ? "text-amber-600"
                              : "text-emerald-700 dark:text-emerald-400"
                          }
                        >
                          {p.stockCurrent}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          Mín: {p.stockMin}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {isOut ? (
                          <Badge variant="destructive" className="text-[10px]">
                            Agotado
                          </Badge>
                        ) : isLow ? (
                          <Badge variant="warning" className="text-[10px]">
                            Stock Bajo
                          </Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px]">
                            Óptimo
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-right pr-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300"
                          onClick={() => handleOpenAdjust(p)}
                        >
                          <ArrowUpDown className="h-3 w-3" />
                          <span>Ajustar</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No se encontraron productos con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Ajustar Stock */}
      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-teal-600" />
              <span>Ajuste de Stock y Movimiento</span>
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <form onSubmit={handleConfirmAdjust} className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedProduct.name}
                </p>
                <p className="text-slate-500 font-mono text-[11px]">
                  SKU: {selectedProduct.sku} · Stock Actual:{" "}
                  <strong className="text-teal-700 dark:text-teal-400">
                    {selectedProduct.stockCurrent} unidades
                  </strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Tipo de Movimiento:
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as "in" | "out")}
                  >
                    <option value="in">Entrada (+ Sumar Stock)</option>
                    <option value="out">Salida (- Restar Stock)</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 font-mono font-bold text-xs dark:border-slate-700 dark:bg-slate-900"
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Motivo del Movimiento:
                </label>
                <select
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                >
                  <option value="Entrada de albarán proveedor">
                    Entrada por compra / Albarán proveedor
                  </option>
                  <option value="Salida directa venta tienda">
                    Salida por venta a cliente
                  </option>
                  <option value="Rotura en taller de biselado">
                    Baja por rotura en taller / montaje
                  </option>
                  <option value="Ajuste regularización inventario">
                    Ajuste regularización de inventario físico
                  </option>
                  <option value="Devolución al proveedor">
                    Devolución o tara al proveedor
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAdjustModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm">
                  Registrar Movimiento
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Alta Producto */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-600" />
              <span>Alta de Nuevo Producto Óptico</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  SKU (Identificador) *
                </label>
                <input
                  type="text"
                  placeholder="Ej. MON-SIL-5515"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Código de Barras EAN *
                </label>
                <input
                  type="text"
                  placeholder="Ej. 8412345678901"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={newBarcode}
                  onChange={(e) => setNewBarcode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                placeholder="Ej. Silhouette Titan Minimal Art The Icon"
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Marca *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Silhouette"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Categoría
                </label>
                <select
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                >
                  <option value="frame">Montura de Graduado</option>
                  <option value="ophthalmic_lens">Lente Oftálmica</option>
                  <option value="contact_lens">Lente de Contacto</option>
                  <option value="sunglasses">Gafa de Sol</option>
                  <option value="solution">Solución / Líquido</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Coste (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={newCostPrice}
                  onChange={(e) => setNewCostPrice(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  PVP (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={newSalePrice}
                  onChange={(e) => setNewSalePrice(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Stock Inicial
                </label>
                <input
                  type="number"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-900"
                  value={newStockMin}
                  onChange={(e) => setNewStockMin(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                Guardar Producto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
