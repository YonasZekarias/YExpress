"use client";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  category: string;
}

const mockProducts: Product[] = [
  { id: "PROD-001", name: "Premium Leather Bag", price: "$120.00", stock: 15, category: "Accessories" },
  { id: "PROD-002", name: "Wireless Headphones", price: "$250.00", stock: 8, category: "Electronics" },
  { id: "PROD-003", name: "Summer Sneakers", price: "$85.00", stock: 0, category: "Footwear" },
];

const InventoryWidget = () => (
  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden h-full">
    <div className="p-6 border-b border-border flex justify-between items-center">
      <h3 className="font-bold text-foreground">Low Stock Alert</h3>
      <button className="text-primary text-sm font-medium hover:text-primary/80">
        Manage
      </button>
    </div>

    <div className="p-4 space-y-4">
      {mockProducts.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between p-3 bg-muted rounded-xl"
        >
          <div>
            <p className="font-semibold text-foreground text-sm">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-md ${
                product.stock === 0
                  ? "bg-destructive/30 text-destructive"
                  : "bg-yellow-500/20 text-yellow-700"
              }`}
            >
              {product.stock} left
            </span>
          </div>
        </div>
      ))}

      <button className="w-full py-2 border border-dashed border-border rounded-xl text-muted-foreground text-sm hover:bg-muted/50 hover:text-primary flex items-center justify-center transition-colors">
        <Plus className="w-4 h-4 mr-2" />
        Add New Product
      </button>
    </div>
  </div>
);

export default InventoryWidget;
