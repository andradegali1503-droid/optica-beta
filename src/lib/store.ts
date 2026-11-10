import {
  Customer,
  Prescription,
  Appointment,
  Product,
  InventoryMovement,
  SaleOrder,
  AuditLog,
  User,
} from "./types";

const INITIAL_USERS: User[] = [
  {
    id: "usr-1",
    name: "Dra. Elena Ramos Gómez",
    email: "elena.ramos@opticapro.com",
    role: "optometrist",
    licenseNumber: "COL-OPT-2849",
  },
  {
    id: "usr-2",
    name: "Dr. Carlos Mendizábal",
    email: "carlos.m@opticapro.com",
    role: "optometrist",
    licenseNumber: "COL-OPT-3105",
  },
  {
    id: "usr-3",
    name: "Marina Ortiz Sanz",
    email: "marina.ortiz@opticapro.com",
    role: "sales",
  },
  {
    id: "usr-4",
    name: "Javier Solís",
    email: "javier.solis@opticapro.com",
    role: "admin",
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    firstName: "Alejandro",
    lastName: "Vega Serrano",
    taxId: "48712394K",
    birthDate: "1984-05-14",
    phone: "+34 611 234 567",
    email: "alejandro.vega@email.com",
    address: "Calle Gran Vía 42, 3ºB",
    city: "Madrid",
    postalCode: "28013",
    medicalNotes: "Ojo seco moderado por uso continuado de pantallas. Sensibilidad a reflejos nocturnos.",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-03-15T12:00:00Z",
  },
  {
    id: "cust-2",
    firstName: "Beatriz",
    lastName: "Navarro Gil",
    taxId: "51928472M",
    birthDate: "1972-11-28",
    phone: "+34 622 345 678",
    email: "beatriz.navarro@email.com",
    address: "Paseo de la Castellana 110",
    city: "Madrid",
    postalCode: "28046",
    medicalNotes: "Presbicia incipiente. Antecedentes familiares de glaucoma.",
    createdAt: "2024-02-12T11:30:00Z",
    updatedAt: "2024-04-02T09:15:00Z",
  },
  {
    id: "cust-3",
    firstName: "Gonzalo",
    lastName: "Fernández Pardo",
    taxId: "03847562X",
    birthDate: "1996-03-22",
    phone: "+34 655 987 321",
    email: "gonzalo.fp@email.com",
    address: "Avenida de América 18",
    city: "Madrid",
    postalCode: "28002",
    medicalNotes: "Usuario diario de lentes de contacto blandas mensuales.",
    createdAt: "2024-03-01T16:20:00Z",
    updatedAt: "2024-05-10T17:00:00Z",
  },
  {
    id: "cust-4",
    firstName: "Carmen",
    lastName: "López Morales",
    taxId: "07891234T",
    birthDate: "1960-08-04",
    phone: "+34 677 889 900",
    email: "carmen.lopez@email.com",
    address: "Calle Alcalá 89, 1º Izq",
    city: "Madrid",
    postalCode: "28009",
    medicalNotes: "Operada de catarata en OI (Lente intraocular monofocal). Presbicia avanzada en OD.",
    createdAt: "2024-03-18T10:15:00Z",
    updatedAt: "2024-06-20T11:45:00Z",
  },
];

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: "rx-1",
    customerId: "cust-1",
    customerName: "Alejandro Vega Serrano",
    optometristId: "usr-1",
    optometristName: "Dra. Elena Ramos Gómez",
    licenseNumber: "COL-OPT-2849",
    examinationDate: "2024-03-15",
    rightEye: {
      sphere: -2.25,
      cylinder: -0.75,
      axis: 95,
      visualAcuity: "1.0",
      pupillaryDistance: 31.5,
      heightPupil: 21,
    },
    leftEye: {
      sphere: -2.50,
      cylinder: -0.50,
      axis: 80,
      visualAcuity: "1.0",
      pupillaryDistance: 32.0,
      heightPupil: 21,
    },
    pupillaryDistanceBinocular: 63.5,
    lensType: "monofocal_far",
    treatments: ["antireflejante_premium", "filtro_azul", "hidrofobico"],
    clinicalObservations: "Refracción subjetiva afinada con cilindro cruzado de Jackson. Buena agudeza visual binocular.",
    nextCheckupMonths: 12,
    createdAt: "2024-03-15T12:00:00Z",
  },
  {
    id: "rx-2",
    customerId: "cust-2",
    customerName: "Beatriz Navarro Gil",
    optometristId: "usr-2",
    optometristName: "Dr. Carlos Mendizábal",
    licenseNumber: "COL-OPT-3105",
    examinationDate: "2024-04-02",
    rightEye: {
      sphere: +1.25,
      cylinder: -0.50,
      axis: 175,
      addition: 2.00,
      visualAcuity: "1.0",
      pupillaryDistance: 31.0,
      heightPupil: 23,
    },
    leftEye: {
      sphere: +1.50,
      cylinder: -0.75,
      axis: 10,
      addition: 2.00,
      visualAcuity: "0.9",
      pupillaryDistance: 31.5,
      heightPupil: 23,
    },
    pupillaryDistanceBinocular: 62.5,
    lensType: "progressive",
    treatments: ["antireflejante_premium", "fotocromatico", "endurecido"],
    clinicalObservations: "Adaptación de lente progresiva de campo amplio (Freeform). Marcaje pupilar verificado en montura elegida.",
    nextCheckupMonths: 12,
    createdAt: "2024-04-02T09:15:00Z",
  },
  {
    id: "rx-3",
    customerId: "cust-3",
    customerName: "Gonzalo Fernández Pardo",
    optometristId: "usr-1",
    optometristName: "Dra. Elena Ramos Gómez",
    licenseNumber: "COL-OPT-2849",
    examinationDate: "2024-05-10",
    rightEye: {
      sphere: -3.75,
      cylinder: -0.75,
      axis: 180,
      visualAcuity: "1.0",
      pupillaryDistance: 33.0,
    },
    leftEye: {
      sphere: -4.00,
      cylinder: -0.50,
      axis: 170,
      visualAcuity: "1.0",
      pupillaryDistance: 33.0,
    },
    pupillaryDistanceBinocular: 66.0,
    lensType: "contact_soft",
    contactLens: {
      baseCurve: 8.6,
      diameter: 14.2,
      material: "Senofilcon A (Hidrogel de Silicona)",
      brand: "Acuvue Oasys",
      replacementSchedule: "biweekly",
    },
    treatments: [],
    clinicalObservations: "Prueba de fluorograma y centrado lagrimal óptimo. Sin tinción corneal periférica.",
    nextCheckupMonths: 6,
    createdAt: "2024-05-10T17:00:00Z",
  },
];

const getFutureDate = (daysAhead: number, hours: number, minutes: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    customerId: "cust-1",
    customerName: "Alejandro Vega Serrano",
    customerPhone: "+34 611 234 567",
    professionalId: "usr-1",
    professionalName: "Dra. Elena Ramos Gómez",
    serviceType: "graduacion_completa",
    startTime: getFutureDate(0, 10, 0),
    endTime: getFutureDate(0, 10, 45),
    status: "confirmed",
    notes: "Revisión anual rutinaria y control de visión frente a pantallas.",
    cabinetNumber: 1,
  },
  {
    id: "apt-2",
    customerId: "cust-2",
    customerName: "Beatriz Navarro Gil",
    customerPhone: "+34 622 345 678",
    professionalId: "usr-2",
    professionalName: "Dr. Carlos Mendizábal",
    serviceType: "revision_tension_ocular",
    startTime: getFutureDate(0, 11, 30),
    endTime: getFutureDate(0, 12, 0),
    status: "in_consultation",
    notes: "Tonometría de aire y campo visual de control.",
    cabinetNumber: 2,
  },
  {
    id: "apt-3",
    customerId: "cust-3",
    customerName: "Gonzalo Fernández Pardo",
    customerPhone: "+34 655 987 321",
    professionalId: "usr-1",
    professionalName: "Dra. Elena Ramos Gómez",
    serviceType: "adaptacion_lentillas",
    startTime: getFutureDate(0, 16, 0),
    endTime: getFutureDate(0, 16, 45),
    status: "scheduled",
    notes: "Entrega de lentillas tóricas de prueba y entrenamiento de inserción/extracción.",
    cabinetNumber: 1,
  },
  {
    id: "apt-4",
    customerId: "cust-4",
    customerName: "Carmen López Morales",
    customerPhone: "+34 677 889 900",
    professionalId: "usr-2",
    professionalName: "Dr. Carlos Mendizábal",
    serviceType: "entrega_ajuste",
    startTime: getFutureDate(1, 12, 0),
    endTime: getFutureDate(1, 12, 30),
    status: "scheduled",
    notes: "Ajuste anatómico de montura progresiva recién montada en taller.",
    cabinetNumber: 2,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    sku: "MON-RB-5154",
    barcode: "8053672358575",
    name: "Ray-Ban Clubmaster Optics",
    brand: "Ray-Ban",
    model: "RB5154 2000",
    category: "frame",
    costPrice: 58.0,
    salePrice: 145.0,
    stockCurrent: 8,
    stockMin: 3,
    supplierId: "sup-1",
    supplierName: "Luxottica España",
    specifications: {
      color: "Negro brillante / Dorado",
      caliber: 51,
      bridge: 21,
      rod: 145,
      material: "Acetato y Metal",
    },
    isActive: true,
    createdAt: "2024-01-05T08:00:00Z",
  },
  {
    id: "prod-2",
    sku: "MON-OK-8105",
    barcode: "888392110294",
    name: "Oakley Pitchman R Carbon",
    brand: "Oakley",
    model: "OX8105",
    category: "frame",
    costPrice: 72.0,
    salePrice: 180.0,
    stockCurrent: 2, // Alerta stock bajo
    stockMin: 4,
    supplierId: "sup-1",
    supplierName: "Luxottica España",
    specifications: {
      color: "Carbon / Satin Black",
      caliber: 50,
      bridge: 19,
      rod: 140,
      material: "O-Matter y Fibra de Carbono",
    },
    isActive: true,
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "prod-3",
    sku: "LEN-ESS-PROG-16",
    barcode: "3607840192847",
    name: "Essilor Varilux Physio 3.0 Ormix 1.6 Crizal Sapphire HR",
    brand: "Essilor",
    category: "ophthalmic_lens",
    costPrice: 95.0,
    salePrice: 240.0,
    stockCurrent: 14,
    stockMin: 5,
    supplierId: "sup-2",
    supplierName: "Essilor España",
    specifications: {
      index: 1.6,
      geometry: "Progresivo Freeform",
      material: "Ormix (MR-8)",
    },
    isActive: true,
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "prod-4",
    sku: "LTC-ACU-OAS-30",
    barcode: "0738215984729",
    name: "Acuvue Oasys with HydraLuxe 1-Day (30 uds)",
    brand: "Johnson & Johnson",
    category: "contact_lens",
    costPrice: 14.5,
    salePrice: 32.0,
    stockCurrent: 1, // Alerta stock crítico
    stockMin: 6,
    supplierId: "sup-3",
    supplierName: "Johnson & Johnson Vision",
    specifications: {
      packSize: 30,
      material: "Senofilcon A",
    },
    isActive: true,
    createdAt: "2024-02-01T08:00:00Z",
  },
  {
    id: "prod-5",
    sku: "SOL-OPT-PURE-360",
    barcode: "8470001827463",
    name: "Solución Única Opti-Free PureMoist 300ml",
    brand: "Alcon",
    category: "solution",
    costPrice: 4.8,
    salePrice: 12.5,
    stockCurrent: 24,
    stockMin: 8,
    supplierId: "sup-4",
    supplierName: "Alcon Cusí",
    specifications: {
      volume: "300 ml",
    },
    isActive: true,
    createdAt: "2024-02-10T08:00:00Z",
  },
  {
    id: "prod-6",
    sku: "GAF-SOL-PERS-0714",
    barcode: "8053672018471",
    name: "Persol 714 Steve McQueen Edición Plegable",
    brand: "Persol",
    model: "PO0714 24/57",
    category: "sunglasses",
    costPrice: 120.0,
    salePrice: 295.0,
    stockCurrent: 4,
    stockMin: 2,
    supplierId: "sup-1",
    supplierName: "Luxottica España",
    specifications: {
      color: "Habana / Cristal Polarizado Azul",
      caliber: 54,
      bridge: 21,
      rod: 140,
    },
    isActive: true,
    createdAt: "2024-02-15T08:00:00Z",
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    userId: "usr-1",
    userName: "Dra. Elena Ramos Gómez",
    action: "CREATE_PRESCRIPTION",
    entityName: "Prescription",
    entityId: "rx-1",
    timestamp: "2024-03-15T12:00:00Z",
    details: "Emisión de receta óptica para Alejandro Vega (OD: -2.25, OI: -2.50).",
  },
  {
    id: "log-2",
    userId: "usr-4",
    userName: "Javier Solís",
    action: "ADJUST_STOCK",
    entityName: "Product",
    entityId: "prod-4",
    timestamp: "2024-04-10T14:30:00Z",
    details: "Ajuste de inventario en Acuvue Oasys: reducción por venta a cliente.",
  },
  {
    id: "log-3",
    userId: "usr-2",
    userName: "Dr. Carlos Mendizábal",
    action: "UPDATE_APPOINTMENT",
    entityName: "Appointment",
    entityId: "apt-2",
    timestamp: "2024-04-02T09:15:00Z",
    details: "Cita iniciada para Beatriz Navarro Gil en Gabinete 2.",
  },
];

const INITIAL_SALES: SaleOrder[] = [
  {
    id: "sale-1",
    orderNumber: "PED-2024-0012",
    customerId: "cust-1",
    customerName: "Alejandro Vega Serrano",
    prescriptionId: "rx-1",
    items: [
      {
        productId: "prod-1",
        productName: "Ray-Ban Clubmaster Optics",
        sku: "MON-RB-5154",
        quantity: 1,
        unitPrice: 145.0,
        subtotal: 145.0,
      },
      {
        productId: "prod-3",
        productName: "Essilor Varilux Ormix (Pareja)",
        sku: "LEN-ESS-PROG-16",
        quantity: 2,
        unitPrice: 120.0,
        subtotal: 240.0,
      },
    ],
    subtotal: 385.0,
    tax: 80.85,
    total: 465.85,
    status: "workshop",
    paymentStatus: "paid",
    paymentMethod: "card",
    notes: "Biselado fino con Ranurado en taller interno.",
    createdAt: "2024-03-15T12:30:00Z",
  },
  {
    id: "sale-2",
    orderNumber: "PED-2024-0013",
    customerId: "cust-3",
    customerName: "Gonzalo Fernández Pardo",
    prescriptionId: "rx-3",
    items: [
      {
        productId: "prod-4",
        productName: "Acuvue Oasys 1-Day (Pack)",
        sku: "LTC-ACU-OAS-30",
        quantity: 2,
        unitPrice: 32.0,
        subtotal: 64.0,
      },
      {
        productId: "prod-5",
        productName: "Solución Única Opti-Free",
        sku: "SOL-OPT-PURE-360",
        quantity: 1,
        unitPrice: 12.5,
        subtotal: 12.5,
      },
    ],
    subtotal: 76.5,
    tax: 7.65,
    total: 84.15,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "card",
    createdAt: "2024-03-18T17:15:00Z",
  },
];

// Helper to interact with LocalStorage safely
const STORAGE_PREFIX = "optica_pro_";

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    // quota exceeded or SSR
  }
}

class OpticaStore {
  private users: User[] = INITIAL_USERS;
  private customers: Customer[] = [];
  private prescriptions: Prescription[] = [];
  private appointments: Appointment[] = [];
  private products: Product[] = [];
  private sales: SaleOrder[] = [];
  private auditLogs: AuditLog[] = [];
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== "undefined" && !this.initialized) {
      this.customers = loadStorage("customers", INITIAL_CUSTOMERS);
      this.prescriptions = loadStorage("prescriptions", INITIAL_PRESCRIPTIONS);
      this.appointments = loadStorage("appointments", INITIAL_APPOINTMENTS);
      this.products = loadStorage("products", INITIAL_PRODUCTS);
      this.sales = loadStorage("sales", INITIAL_SALES);
      this.auditLogs = loadStorage("audit_logs", INITIAL_AUDIT_LOGS);
      this.initialized = true;
    } else {
      this.customers = INITIAL_CUSTOMERS;
      this.prescriptions = INITIAL_PRESCRIPTIONS;
      this.appointments = INITIAL_APPOINTMENTS;
      this.products = INITIAL_PRODUCTS;
      this.sales = INITIAL_SALES;
      this.auditLogs = INITIAL_AUDIT_LOGS;
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    if (typeof window !== "undefined") {
      saveStorage("customers", this.customers);
      saveStorage("prescriptions", this.prescriptions);
      saveStorage("appointments", this.appointments);
      saveStorage("products", this.products);
      saveStorage("sales", this.sales);
      saveStorage("audit_logs", this.auditLogs);
    }
    this.listeners.forEach((fn) => fn());
  }

  // --- USERS & AUTH ---
  public getUsers() {
    return this.users;
  }
  public getCurrentUser(): User {
    return this.users[0]; // Dra. Elena Ramos Gómez
  }

  // --- CUSTOMERS ---
  public getCustomers() {
    return [...this.customers];
  }
  public getCustomerById(id: string) {
    return this.customers.find((c) => c.id === id);
  }
  public addCustomer(c: Omit<Customer, "id" | "createdAt" | "updatedAt">): Customer {
    const newCust: Customer = {
      ...c,
      id: "cust-" + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customers = [newCust, ...this.customers];
    this.logAction("CREATE_CUSTOMER", "Customer", newCust.id, `Alta de cliente: ${newCust.firstName} ${newCust.lastName}`);
    this.notify();
    return newCust;
  }
  public updateCustomer(id: string, patch: Partial<Customer>): Customer | undefined {
    const idx = this.customers.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.customers[idx] = {
      ...this.customers[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.logAction("UPDATE_CUSTOMER", "Customer", id, `Actualización de ficha de cliente`);
    this.notify();
    return this.customers[idx];
  }

  // --- PRESCRIPTIONS ---
  public getPrescriptions() {
    return [...this.prescriptions];
  }
  public getPrescriptionById(id: string) {
    return this.prescriptions.find((p) => p.id === id);
  }
  public getPrescriptionsByCustomerId(customerId: string) {
    return this.prescriptions.filter((p) => p.customerId === customerId);
  }
  public addPrescription(p: Omit<Prescription, "id" | "createdAt">): Prescription {
    const customer = this.getCustomerById(p.customerId);
    const newRx: Prescription = {
      ...p,
      id: "rx-" + Date.now(),
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : p.customerName || "Paciente",
      createdAt: new Date().toISOString(),
    };
    this.prescriptions = [newRx, ...this.prescriptions];
    this.logAction(
      "CREATE_PRESCRIPTION",
      "Prescription",
      newRx.id,
      `Nueva receta clínica para ${newRx.customerName} (OD Esf: ${newRx.rightEye.sphere}, OI Esf: ${newRx.leftEye.sphere})`
    );
    this.notify();
    return newRx;
  }

  // --- APPOINTMENTS ---
  public getAppointments() {
    return [...this.appointments];
  }
  public checkAppointmentOverlap(
    professionalId: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): boolean {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    return this.appointments.some((apt) => {
      if (apt.id === excludeId) return false;
      if (apt.professionalId !== professionalId) return false;
      if (apt.status === "cancelled" || apt.status === "no_show") return false;

      const aptStart = new Date(apt.startTime).getTime();
      const aptEnd = new Date(apt.endTime).getTime();

      // Solapamiento: (StartA < EndB) y (EndA > StartB)
      return start < aptEnd && end > aptStart;
    });
  }
  public addAppointment(apt: Omit<Appointment, "id">): { success: boolean; error?: string; appointment?: Appointment } {
    if (this.checkAppointmentOverlap(apt.professionalId, apt.startTime, apt.endTime)) {
      return {
        success: false,
        error: `El profesional ${apt.professionalName} ya tiene una consulta programada en ese intervalo horario.`,
      };
    }
    const newApt: Appointment = {
      ...apt,
      id: "apt-" + Date.now(),
    };
    this.appointments = [newApt, ...this.appointments];
    this.logAction("CREATE_APPOINTMENT", "Appointment", newApt.id, `Cita agendada para ${newApt.customerName}`);
    this.notify();
    return { success: true, appointment: newApt };
  }
  public updateAppointmentStatus(id: string, status: Appointment["status"]) {
    const idx = this.appointments.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.appointments[idx].status = status;
      this.logAction("UPDATE_APPOINTMENT_STATUS", "Appointment", id, `Estado de cita cambiado a ${status}`);
      this.notify();
    }
  }

  // --- PRODUCTS & INVENTORY ---
  public getProducts() {
    return [...this.products];
  }
  public getProductById(id: string) {
    return this.products.find((p) => p.id === id);
  }
  public addProduct(p: Omit<Product, "id" | "createdAt" | "isActive">): Product {
    const newProd: Product = {
      ...p,
      id: "prod-" + Date.now(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    this.products = [newProd, ...this.products];
    this.logAction("CREATE_PRODUCT", "Product", newProd.id, `Alta de producto SKU ${newProd.sku} - ${newProd.name}`);
    this.notify();
    return newProd;
  }
  public adjustStock(productId: string, quantityDelta: number, reason: string): Product | undefined {
    const idx = this.products.findIndex((p) => p.id === productId);
    if (idx === -1) return undefined;
    const current = this.products[idx].stockCurrent;
    const newStock = Math.max(0, current + quantityDelta);
    this.products[idx].stockCurrent = newStock;

    this.logAction(
      "ADJUST_STOCK",
      "Product",
      productId,
      `Ajuste de stock en ${this.products[idx].sku}: ${current} -> ${newStock} (${quantityDelta > 0 ? "+" : ""}${quantityDelta}). Motivo: ${reason}`
    );
    this.notify();
    return this.products[idx];
  }

  // --- SALES ---
  public getSales() {
    return [...this.sales];
  }
  public addSale(sale: Omit<SaleOrder, "id" | "createdAt" | "orderNumber">): SaleOrder {
    const newSale: SaleOrder = {
      ...sale,
      id: "sale-" + Date.now(),
      orderNumber: `PED-${new Date().getFullYear()}-${String(this.sales.length + 1).padStart(4, "0")}`,
      createdAt: new Date().toISOString(),
    };
    // Deduct inventory items
    for (const item of newSale.items) {
      this.adjustStock(item.productId, -item.quantity, `Venta en pedido ${newSale.orderNumber}`);
    }
    this.sales = [newSale, ...this.sales];
    this.logAction("CREATE_SALE", "SaleOrder", newSale.id, `Pedido ${newSale.orderNumber} creado por importe de ${newSale.total}€`);
    this.notify();
    return newSale;
  }

  // --- AUDIT TRAIL ---
  public getAuditLogs() {
    return [...this.auditLogs];
  }
  private logAction(action: string, entityName: string, entityId: string, details: string) {
    const user = this.getCurrentUser();
    const entry: AuditLog = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      userId: user.id,
      userName: user.name,
      action,
      entityName,
      entityId,
      timestamp: new Date().toISOString(),
      details,
    };
    this.auditLogs = [entry, ...this.auditLogs];
  }

  // --- STATS & KPIs ---
  public getDashboardKPIs() {
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = this.appointments.filter((a) => a.startTime.startsWith(today));
    const lowStockProducts = this.products.filter((p) => p.stockCurrent <= p.stockMin);
    const totalSalesAmount = this.sales.reduce((acc, s) => acc + s.total, 0);

    return {
      todayAppointmentsCount: todayAppointments.length,
      confirmedAppointmentsCount: todayAppointments.filter((a) => a.status === "confirmed" || a.status === "in_consultation").length,
      totalCustomersCount: this.customers.length,
      totalPrescriptionsCount: this.prescriptions.length,
      lowStockCount: lowStockProducts.length,
      totalProductsCount: this.products.length,
      totalSalesAmount,
      totalOrdersCount: this.sales.length,
    };
  }

  public resetToFactoryDefaults() {
    this.customers = INITIAL_CUSTOMERS;
    this.prescriptions = INITIAL_PRESCRIPTIONS;
    this.appointments = INITIAL_APPOINTMENTS;
    this.products = INITIAL_PRODUCTS;
    this.sales = INITIAL_SALES;
    this.auditLogs = INITIAL_AUDIT_LOGS;
    this.notify();
  }
}

export const opticaStore = new OpticaStore();
