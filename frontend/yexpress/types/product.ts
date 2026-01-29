export interface Category {
  _id: string;
  name: string;
  slug: string;
}

// types/product.ts

export interface Attribute {
  _id: string;
  name: string; // e.g., "Color"
}

export interface AttributeValue {
  _id: string;
  value: string; // e.g., "Red" (Check your DB if this field is called 'name' or 'value')
}

export interface VariantAttribute {
  _id?: string;
  attribute: Attribute | string; // Can be populated object OR string ID
  value: AttributeValue | string; // Can be populated object OR string ID
}

export interface Variant {
  _id: string;
  product: string;
  price: number;
  stock: number;
  attributes: VariantAttribute[];
}
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category | null; // Can be populated or null
  photo: string[];
  stock: number;
  averageRating: number;
  ratingsCount: number;
  
  // Optional calculated fields for display
  minPrice?: number;
  maxPrice?: number;
  
  createdAt?: string;
  updatedAt?: string;
}

// Helper for API responses
export interface ProductResponse {
  success: boolean;
  message?: string;
  data: {
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
    // For single product view:
    variants?: Variant[];
    priceRange?: { min: number; max: number };
  } & Product; // Includes product fields when fetching single product
}