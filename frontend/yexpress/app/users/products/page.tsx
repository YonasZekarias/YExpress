import ProductCard from '@/components/products/ProductCard';
import Pagination from '@/components/products/Pagination';
import axios from 'axios';
import { cookies } from 'next/headers'; 
import SearchAndFilter from '@/components/products/SearchAndFilter';
async function getCategories() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/products/categories`, {
      headers: { Cookie: cookieHeader },
      withCredentials: true
    });

    console.log("Categories fetched:", res.data);
    
    // FIX: The array is in 'res.data.data', not 'res.data.categories'
    return res.data.success ? res.data.data : [];
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
async function getProducts(searchParams: any){
  try {

    const cookieStore = await cookies();
   
    const cookieHeader = cookieStore.toString(); 

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/products`, {
      params: {
        page: searchParams.page || 1,
        limit: 12,
        search: searchParams.search,      
        category: searchParams.category,  
        sort: searchParams.sort           
      },
      // 3. Manually attach the Cookie header
      headers: {
        Cookie: cookieHeader
      },
      withCredentials: true // You can keep this, but the header above is what actually fixes it server-side
    });

    if (!res.data.data || !res.data.success) {
      return null;
    }

    return res.data.data;
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
  const resolvedParams = await Promise.resolve(searchParams); // Next.js 15
  
  // Parallel fetching for speed
  const [productData, categories] = await Promise.all([
    getProducts(resolvedParams),
    getCategories()
  ]);

  if (!productData) return <div>Error...</div>;

  // Check if .data exists, otherwise use productData directly
const { products, totalPages } = productData.data || productData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Marketplace
        </h1>
        
        {/* ADD THE COMPONENT HERE */}
        <SearchAndFilter categories={categories} />
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">No products found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={parseInt(
            Array.isArray(resolvedParams.page)
              ? resolvedParams.page[0] || '1'
              : resolvedParams.page || '1'
          )}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}