export interface Order {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: "Pending" | "Completed" | "Cancelled";
}

export interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  category: string;
}

export const mockRecentOrders: Order[] = [
  { id: "#ORD-001", customer: "Sarah Smith", date: "Today, 10:23 AM", amount: "$120.00", status: "Pending" },
  { id: "#ORD-002", customer: "Michael Brown", date: "Yesterday", amount: "$85.50", status: "Completed" },
  { id: "#ORD-003", customer: "Emily Davis", date: "Yesterday", amount: "$210.00", status: "Completed" },
  { id: "#ORD-004", customer: "James Wilson", date: "Oct 24", amount: "$45.00", status: "Cancelled" },
];

export const mockProducts: Product[] = [
  { id: "PROD-001", name: "Premium Leather Bag", price: "$120.00", stock: 15, category: "Accessories" },
  { id: "PROD-002", name: "Wireless Headphones", price: "$250.00", stock: 8, category: "Electronics" },
  { id: "PROD-003", name: "Summer Sneakers", price: "$85.00", stock: 0, category: "Footwear" },
];
