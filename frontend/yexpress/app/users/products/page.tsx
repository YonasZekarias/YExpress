import ProductCard from '@/components/products/ProductCard';
import Pagination from '@/components/products/Pagination';
import axios from 'axios';
import { cookies } from 'next/headers'; 
import SearchAndFilter from '@/components/products/SearchAndFilter';

async function getCategories() {
  try {
    const cookieStore = await cookies();
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/products/categories`, {
      headers: { Cookie: cookieStore.toString() },
      withCredentials: true
    });
    return res.data.success ? res.data.data : [];
  } catch (error) {
    return [];
  }
}

async function getProducts(searchParams: any) {
  try {
    const cookieStore = await cookies();
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/products`, {
      params: {
        page: searchParams.page || 1,
        limit: 12,
        search: searchParams.search,      
        category: searchParams.category,  
        sort: searchParams.sort,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice
      },
      headers: { Cookie: cookieStore.toString() },
      withCredentials: true
    });

    return res.data; 
  } catch (error) {
    console.error('Error loading products:', error);
    return null;
  }
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await Promise.resolve(searchParams); 
  
  const [productData, categories] = await Promise.all([
    getProducts(resolvedParams),
    getCategories()
  ]);

  if (!productData || !productData.success) {
    return <div className="p-10 text-center">Failed to load products.</div>;
  }

  // Backend: { success: true, data: { products: [...], totalPages: ... } }
  const { products, totalPages } = productData.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Marketplace
        </h1>
        <SearchAndFilter categories={categories} />
      </div>

      {products && products.length > 0 ? (
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
          currentPage={parseInt(String(resolvedParams.page || '1'))}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}