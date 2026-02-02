import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/products/Pagination";
import axios from "axios";
import { cookies } from "next/headers";
import SearchAndFilter from "@/components/products/SearchAndFilter";

async function getProducts(searchParams: any) {
  const cookieStore = await cookies();
  // ✅ FIX 1: Get the token value
  const token = cookieStore.get("token")?.value || "";

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/products`,
    {
      params: {
        page: searchParams.page || 1,
        limit: 12,
        search: searchParams.search,
        category: searchParams.category,
        sort: searchParams.sort,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
      },
      headers: {
        // ✅ FIX 2: Format as "key=value" string
        Cookie: token ? `token=${token}` : "",
      },
    },
  );

  return res.data;
}

export default async function ProductsPage(props: { searchParams: Promise<any> }) {
  // ✅ FIX 3: Await searchParams (Next.js 15 requirement)
  const searchParams = await props.searchParams;
  const productData = await getProducts(searchParams);

  if (!productData?.success) {
    return <div className="p-10 text-center">Failed to load products</div>;
  }

  const { products, totalPages } = productData.data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SearchAndFilter categories={[]} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard
            key={product._id}
            product={product}
            initialWishlistState={true} 
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={Number(searchParams.page || 1)}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}