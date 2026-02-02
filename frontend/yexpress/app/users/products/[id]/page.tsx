import { notFound } from 'next/navigation';
import ProductView from '@/components/products/ProductView';
import axios from 'axios';
import { cookies } from 'next/headers'; 

async function getProduct(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/products/${id}`, {
      headers: {
        // ✅ FIX 1: Ensure correct Cookie format here too
        Cookie: token ? `token=${token}` : "" 
      },
      withCredentials: true 
    });
    
    return res.data; 
  } catch (e) {
    console.error("Error fetching product detail:", e);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const response = await getProduct(resolvedParams.id);

  if (!response || !response.success || !response.data) {
    notFound();
  }

  // Check where isWishlisted is located in your API response.
  // Usually it is inside response.data (the product object).
  const { variants, priceRange, ...product } = response.data;
  
  // ✅ DEBUG: Uncomment this if it still fails to check if backend is sending it
  // console.log("Product Detail Wishlist Status:", product.isWishlisted);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductView 
        product={product} 
        variants={variants || []} 
        priceRange={priceRange || { min: 0, max: 0 }}
        // ✅ FIX 2: THIS WAS MISSING. Pass the state to the component.
        initialWishlistState={product.isWishlisted} 
      />
    </div>
  );
}