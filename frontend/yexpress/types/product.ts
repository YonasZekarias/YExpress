export interface Category {
  _id: string;
  name: string;
  slug: string;
}

// ADD THIS INTERFACE
export interface Variant {
  _id: string;
  product: string; // Reference to parent product ID
  sku: string;
  price: number;
  stock: number;
  // Allows dynamic attributes like { Color: "Red", Size: "L" }
  attributes: Record<string, string>; 
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