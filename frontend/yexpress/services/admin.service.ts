import api from "@/lib/axios";

/* ================= ATTRIBUTES ================= */
export const addAttribute = (data: any) =>
  api.post("/admin/attributes", data);

export const getAllAttributes = () =>
  api.get("/admin/attributes");

export const editAttribute = (attributeId: string, data: any) =>
  api.put(`/admin/attributes/${attributeId}`, data);

export const deleteAttribute = (attributeId: string) =>
  api.delete(`/admin/attributes/${attributeId}`);

/* ================= CATEGORIES ================= */
export const addCategory = (data: any) =>
  api.post("/admin/categories", data);

export const getAllCategories = () =>
  api.get("/admin/categories");

export const getCategoryById = (categoryId: string) =>
  api.get(`/admin/categories/${categoryId}`);

export const editCategory = (categoryId: string, data: any) =>
  api.put(`/admin/categories/${categoryId}`, data);

export const deleteCategory = (categoryId: string) =>
  api.delete(`/admin/categories/${categoryId}`);

/* ================= PRODUCTS ================= */
export const addProduct = (data: any) =>
  api.post("/admin/products", data);

export const getAllProducts = () =>
  api.get("/admin/products");

export const getProductById = (productId: string) =>
  api.get(`/admin/products/${productId}`);

export const updateProduct = (productId: string, data: any) =>
  api.put(`/admin/products/${productId}`, data);

export const deleteProduct = (productId: string) =>
  api.delete(`/admin/products/${productId}`);

/* ================= ORDERS ================= */
export const getAllOrders = () =>
  api.get("/admin/orders");

export const getOrderById = (orderId: string) =>
  api.get(`/admin/orders/${orderId}`);

export const getOrdersByStatus = (status: string) =>
  api.get(`/admin/orders/status/${status}`);

export const updateOrderStatus = (orderId: string, status: string) =>
  api.put(`/admin/orders/${orderId}/status`, { status });

export const getOrderStats = () =>
  api.get("/admin/orders/stats");

/* ================= USERS ================= */
export const getAllUsers = () =>
  api.get("/admin/users");

export const getUserById = (userId: string) =>
  api.get(`/admin/users/${userId}`);

export const banUnbanUser = (userId: string) =>
  api.put(`/admin/users/${userId}/ban`);
