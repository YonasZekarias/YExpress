import { cookies } from 'next/headers';
import ProductView from '@/components/products/ProductView';
import axios from 'axios';
import Link from 'next/link';
// 1. Fetch Product Details (Public)
async function getProduct(id: string) {

  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString(); // Get all cookies (token, session, etc.)

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/products/${id}`, {
      headers: { 
        Cookie: allCookies // Pass cookies to backend so it knows who the user is
      },

    });
    const data = res.data;
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// 2. Check if Product is in Wishlist (Private - needs cookies)
async function getWishlistStatus(productId: string) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString(); // Get all cookies (token, session, etc.)

    if (!allCookies) return false;

    // Call your existing /user/wishlist endpoint
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/wishlist`, {
      headers: { 
        Cookie: allCookies // Pass cookies to backend so it knows who the user is
      },
    });

    // Check the JSON structure you provided: { success: true, data: [ { _id: "..." }, ... ] }
    if (res.data?.success && Array.isArray(res.data.data)) {
      // Return TRUE if we find a product with the matching ID
      return res.data.data.some((item: any) => item._id === productId);
    }
    
    return false;
  } catch (error) {
    // If user is not logged in (401) or other error, return false
    return false;
  }
}

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  // Await params (Required for Next.js 15+)
  const { id } = await params;

  // Run fetches in parallel for speed
  const [product, isWishlisted] = await Promise.all([
    getProduct(id),
    getWishlistStatus(id)
  ]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-semibold text-gray-600">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/users/products" className="text-blue-500 hover:underline mb-4 block">← Back to Products</Link>
      <ProductView 
        product={product} 
        variants={product.variants || []}
        // 👇 PASS THE RESULT HERE
        initialWishlistState={isWishlisted} 
      />
    </div>
  );
}