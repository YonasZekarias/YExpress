import api from "@/lib/axios";

/* ================= CART ================= */
export const getUserCart = () =>
  api.get("/user/cart");

export const addToCart = (data: any) =>
  api.post("/user/cart", data);

export const editCartItemQuantity = (itemId: string, quantity: number) =>
  api.put(`/user/cart/item/${itemId}`, { quantity });

export const clearUserCart = () =>
  api.delete("/user/cart");

/* ================= ORDERS ================= */
export const createOrder = (data?: any) =>
  api.post("/user/orders", data);

export const getUserOrders = () =>
  api.get("/user/orders");

export const getOrderById = (orderId: string) =>
  api.get(`/user/orders/${orderId}`);

export const cancelOrder = (orderId: string) =>
  api.put(`/user/orders/${orderId}/cancel`);

export const getOrderStats = () =>
  api.get("/user/orders/stats");

/* ================= PRODUCTS ================= */
export const getAllProducts = () =>
  api.get("/user/products");

export const getProductById = (productId: string) =>
  api.get(`/user/products/${productId}`);

/* ================= REVIEWS ================= */
export const createReview = (data: any) =>
  api.post("/user/reviews", data);

/* ================= USER ================= */
export const getUserProfile = () =>
  api.get("/user/user/profile");

export const editUserProfile = (data: any) =>
  api.put("/user/user/profile", data);

export const getUserStats = () =>
  api.get("/user/user/stats");