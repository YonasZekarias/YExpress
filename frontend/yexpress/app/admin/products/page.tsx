'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Product, Category } from '@/types/admin';

// Modular Imports
import ProductTabs from '@/components/admin/products/ProductTabs';
import ProductToolbar from '@/components/admin/products/ProductToolbar';
import ProductTable from '@/components/admin/products/ProductTable';
import Pagination from '@/components/admin/products/Pagination';
import CategoryManager from '@/components/admin/CategoryManager';
import ProductForm from '@/components/admin/products/ProductForm';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminProductsPage() {
  // UI State
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Pagination
  const [cursors, setCursors] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- 1. Fetch Categories (Initial Load) ---
  useEffect(() => {
    axios.get(`${API_URL}/admin/categories`, { withCredentials: true })
      .then(res => res.data.success && setCategories(res.data.data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  // --- 2. Fetch Products Logic ---
  const fetchProducts = async (cursorParam: string | null = null) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/admin/products`, {
        params: { search, category: selectedCategory, limit: 10, cursor: cursorParam }, 
        withCredentials: true 
      });
      if (data.success) {
        setProducts(data.data);
        setNextCursor(data.nextCursor);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Effects ---
  useEffect(() => {
    // Reset pagination on filter change
    setCursors([]);
    setCurrentCursor(null);
    fetchProducts(null);
  }, [search, selectedCategory]);

  // --- 4. Handlers ---
  const handlePagination = (direction: 'prev' | 'next') => {
    if (direction === 'next' && nextCursor) {
      setCursors([...cursors, currentCursor || '']);
      setCurrentCursor(nextCursor);
      fetchProducts(nextCursor);
    } else if (direction === 'prev' && cursors.length > 0) {
      const prev = cursors[cursors.length - 1];
      setCursors(cursors.slice(0, -1));
      setCurrentCursor(prev || null);
      fetchProducts(prev || null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      await axios.delete(`${API_URL}/admin/products/${deleteId}`, { withCredentials: true });
      toast.success("Deleted successfully");
      fetchProducts(currentCursor);
    } catch (e) { toast.error("Delete failed"); }
    finally { setIsDeleteLoading(false); setDeleteId(null); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Inventory</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your catalog</p>
          </div>
          <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <ProductToolbar 
              search={search} setSearch={setSearch}
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
              categories={categories}
              onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            />

            <div className="flex flex-col">
              <ProductTable 
                products={products} 
                loading={loading}
                onEdit={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
                onDelete={(id) => setDeleteId(id)}
                onClearFilters={() => { setSearch(''); setSelectedCategory(''); }}
              />
              <Pagination 
                hasPrev={cursors.length > 0} 
                hasNext={!!nextCursor}
                onPrev={() => handlePagination('prev')}
                onNext={() => handlePagination('next')}
                pageIndex={cursors.length}
              />
            </div>
          </div>
        )}

        {/* --- CATEGORIES TAB --- */}
        {activeTab === 'categories' && <CategoryManager />}

        {/* --- MODALS --- */}
        {isProductModalOpen && (
          <ProductForm 
            initialData={editingProduct} 
            onClose={() => setIsProductModalOpen(false)} 
            onSuccess={() => fetchProducts(currentCursor)} 
          />
        )}

        <ConfirmModal 
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={confirmDelete}
            isLoading={isDeleteLoading}
            variant="danger"
            title="Delete Product"
            message="Permanently delete this product and its variants?"
            confirmText="Delete"
        />
      </div>
    </div>
  );
}