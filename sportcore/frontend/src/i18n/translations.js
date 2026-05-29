// Translations for i18n support
export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    orders: "Orders",
    products: "Products",
    clients: "Clients",
    createOrder: "Create Order",
    back: "Back",
    
    // Dashboard
    totalOrders: "Total Orders",
    confirmedOrders: "Confirmed Orders",
    activeClients: "Active Clients",
    totalRevenue: "Total Revenue",
    registeredOrders: "Registered orders",
    completedOrders: "Completed orders",
    uniqueClients: "Unique clients",
    totalSales: "Total sales",
    recentOrders: "Recent Orders",
    
    // Products
    productCatalog: "Product Catalog",
    totalProducts: "Total Products",
    categories: "Categories",
    totalStock: "Total Stock",
    availableProducts: "Products available",
    uniqueCategories: "Unique categories",
    inventoryUnits: "Units in inventory",
    add: "Add",
    price: "Price",
    unitPrice: "Price per unit",
    
    // Orders
    allOrders: "All Orders",
    orderDetails: "Order Details",
    client: "Client",
    email: "Email",
    address: "Address",
    date: "Date",
    items: "items",
    orderItems: "Order Items",
    noOrders: "No orders registered",
    createFirstOrder: "Create First Order",
    loadingOrders: "Loading orders...",
    
    // Create Order
    createNewOrder: "Create New Order",
    selectClient: "Select Client",
    selectClientDesc: "Choose the client for this order",
    addProducts: "Add Products",
    addProductsDesc: "Select products for the order",
    product: "Product",
    quantity: "Quantity",
    addToOrder: "Add to Order",
    orderSummary: "Order Summary",
    reviewDetails: "Review details before submitting",
    createOrder: "Create Order",
    processing: "Processing...",
    loadingData: "Loading data...",
    selectProduct: "Select product...",
    selectClientPlaceholder: "Select client...",
    
    // Clients
    clientManagement: "Client Management",
    totalClients: "Total Clients",
    registeredClients: "Clients registered in the system",
    loadingClients: "Loading clients...",
    noClients: "No clients registered",
    clientsManaged: "Clients can be managed from Django admin panel",
    
    // Status
    created: "CREATED",
    confirmed: "CONFIRMED",
    cancelled: "CANCELLED",
    
    // Common
    refresh: "Refresh",
    update: "Update",
    delete: "Delete",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    
    // Sporty theme
    sportManagement: "Sports Management",
    exploreCatalog: "Explore our sports products catalog",
    orderManagement: "Order management",
    completeForm: "Complete the form to create a new order",
  },
  es: {
    // Navigation
    dashboard: "Panel de Control",
    orders: "Pedidos",
    products: "Productos",
    clients: "Clientes",
    createOrder: "Crear Pedido",
    back: "Volver",
    
    // Dashboard
    totalOrders: "Total de Pedidos",
    confirmedOrders: "Pedidos Confirmados",
    activeClients: "Clientes Activos",
    totalRevenue: "Ingresos Totales",
    registeredOrders: "Pedidos registrados",
    completedOrders: "Pedidos completados",
    uniqueClients: "Clientes únicos",
    totalSales: "Total de ventas",
    recentOrders: "Pedidos Recientes",
    
    // Products
    productCatalog: "Catálogo de Productos",
    totalProducts: "Total de Productos",
    categories: "Categorías",
    totalStock: "Stock Total",
    availableProducts: "Productos disponibles",
    uniqueCategories: "Categorías únicas",
    inventoryUnits: "Unidades en inventario",
    add: "Agregar",
    price: "Precio",
    unitPrice: "Precio unitario",
    
    // Orders
    allOrders: "Todos los Pedidos",
    orderDetails: "Detalles del Pedido",
    client: "Cliente",
    email: "Correo",
    address: "Dirección",
    date: "Fecha",
    items: "items",
    orderItems: "Items del Pedido",
    noOrders: "No hay pedidos registrados",
    createFirstOrder: "Crear Primer Pedido",
    loadingOrders: "Cargando pedidos...",
    
    // Create Order
    createNewOrder: "Crear Nuevo Pedido",
    selectClient: "Seleccionar Cliente",
    selectClientDesc: "Elige el cliente para este pedido",
    addProducts: "Agregar Productos",
    addProductsDesc: "Selecciona los productos para el pedido",
    product: "Producto",
    quantity: "Cantidad",
    addToOrder: "Agregar al Pedido",
    orderSummary: "Resumen del Pedido",
    reviewDetails: "Revisa los detalles antes de enviar",
    createOrder: "Crear Pedido",
    processing: "Procesando...",
    loadingData: "Cargando datos...",
    selectProduct: "Seleccionar producto...",
    selectClientPlaceholder: "Seleccionar cliente...",
    
    // Clients
    clientManagement: "Gestión de Clientes",
    totalClients: "Total de Clientes",
    registeredClients: "Clientes registrados en el sistema",
    loadingClients: "Cargando clientes...",
    noClients: "No hay clientes registrados",
    clientsManaged: "Los clientes se pueden gestionar desde el panel de administración de Django",
    
    // Status
    created: "CREADO",
    confirmed: "CONFIRMADO",
    cancelled: "CANCELADO",
    
    // Common
    refresh: "Actualizar",
    update: "Actualizar",
    delete: "Eliminar",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    submit: "Enviar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    
    // Sporty theme
    sportManagement: "Gestión Deportiva",
    exploreCatalog: "Explora nuestro catálogo de productos deportivos",
    orderManagement: "Gestión de pedidos",
    completeForm: "Completa el formulario para crear un nuevo pedido",
  }
};

export const defaultLanguage = 'en';

export const getTranslation = (key, language = defaultLanguage) => {
  const lang = translations[language] || translations[defaultLanguage];
  return lang[key] || key;
};

export const useTranslation = (language = defaultLanguage) => {
  const t = (key) => getTranslation(key, language);
  return { t, language };
};
