export interface OrderStats {
  pending: number;
  processing: number;
  delivered: number;
  shipped: number;
  cancelled: number;
}

export interface OrderItem {
  product: { name: string; photo: string[] };
  variant?: { attributes: any[] };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}