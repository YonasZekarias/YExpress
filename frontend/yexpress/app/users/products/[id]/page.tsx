import { notFound } from 'next/navigation';
import ProductView from '@/components/products/ProductView';
import axios from 'axios';
import { cookies } from 'next/headers'; // Import cookies

// Fetch function
async function getProduct(id: string) {
  try {
    // 1. Get cookies to pass authentication to the backend
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/products/${id}`, {
      headers: {
        Cookie: cookieHeader // Pass the cookies manually
      },
      withCredentials: true 
    });
    
    return res.data; 
  } catch (e) {
    console.error("Error fetching product detail:", e);
    return null;
  }
}

// Next.js 15: 'params' is a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  // 2. Await the params before using them
  const resolvedParams = await params;
  const response = await getProduct(resolvedParams.id);

  if (!response || !response.success || !response.data) {
    notFound();
  }

  const { variants, priceRange, ...product } = response.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductView 
        product={product} 
        variants={variants || []} 
        priceRange={priceRange || { min: 0, max: 0 }} 
      />
    </div>
  );
}