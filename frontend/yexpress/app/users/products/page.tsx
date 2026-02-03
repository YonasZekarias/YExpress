import { cookies } from 'next/headers';
import ProductCard from '@/components/products/ProductCard';
import axios from 'axios';

// 1. Fetch User's Wishlist IDs (Helper)
async function getUserWishlistIds() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();

    // If no cookies, user isn't logged in -> empty wishlist
    if (!allCookies) return [];

    // Call your existing endpoint
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist`, {
      headers: { Cookie: allCookies }
    });

    // Check if data exists and map to an array of Strings (IDs)
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data.map((item: any) => item._id);
    }
    return [];
  } catch (error) {
    return [];
  }
}

// 2. Fetch Products (Helper)
async function getProducts(searchParams: any) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    // Construct query string from params
    const query = new URLSearchParams(searchParams).toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/products?${query}`, {
      headers : {
        Cookie :allCookies
      },
      cache: 'no-store' 
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, data: { products: [] } };
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  // Await searchParams (Next.js 15+)
  const params = await searchParams;

  // Run fetches in parallel
  const [productsRes, wishlistIds] = await Promise.all([
    getProducts(params),
    getUserWishlistIds()
  ]);

  const products = productsRes.success ? productsRes.data.products : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              // 👇 THIS IS THE MAGIC LINE
              initialWishlistState={wishlistIds.includes(product._id)} 
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-12">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}