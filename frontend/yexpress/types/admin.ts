// Base types for the Form State
export interface AttributeInput {
  attribute: string; // e.g. "Color"
  value: string;     // e.g. "Red"
}
export interface Category {
  _id: string;
  name: string;
}
export interface VariantInput {
  _id?: string; // Optional because new variants won't have IDs yet
  price: number;
  stock: number;
  attributes: AttributeInput[];
}

// Type for the full product data from API
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: { _id: string; name: string } | string;
  variants?: any[]; // We will transform this
}