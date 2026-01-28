import ProductCard from '@/components/products/ProductCard';
import Pagination from '@/components/products/Pagination';
import { ProductResponse } from '@/types/product';
import axios from 'axios';
import { cookies } from 'next/headers'; 

// Utility to fetch data
async function getProducts(page: string | number, category?: string): Promise<ProductResponse | null> {
  try {

    const cookieStore = await cookies();
   
    const cookieHeader = cookieStore.toString(); 

    const res = await axios.get<ProductResponse>(`${process.env.NEXT_PUBLIC_API_URL}/user/products`, {
      params: {
        page,
        limit: 12,
        category 
      },
      // 3. Manually attach the Cookie header
      headers: {
        Cookie: cookieHeader
      },
      withCredentials: true // You can keep this, but the header above is what actually fixes it server-side
    });

    if (!res.data || !res.data.success) {
      return null;
    }

    return res.data;
  } catch (error) {
    // Only log the message to avoid cluttering terminal with huge objects
    if (axios.isAxiosError(error)) {
       console.log('Error loading products:', error.response?.status, error.response?.statusText);
    } else {
       console.log('Error loading products:', error);
    }
    return null;
  }
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await Promise.resolve(searchParams);
  
  const currentPage = Number(resolvedParams.page) || 1;
  const categoryFilter = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;

  const data = await getProducts(currentPage, categoryFilter);

  if (!data || !data.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <p className="text-red-500 font-medium">Unable to load products.</p>
            <p className="text-gray-500 text-sm mt-2">Please ensure you are logged in.</p>
        </div>
      </div>
    );
  }

  const { products, totalPages } = data.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {categoryFilter ? `Category: ${categoryFilter}` : 'All Products'}
        </h1>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">No products found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}