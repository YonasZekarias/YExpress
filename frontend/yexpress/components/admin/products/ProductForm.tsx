'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast'; // IMPORT TOAST
import { Product, Category, VariantInput } from '@/types/admin';
import BasicInfo from '../form/BasicInfo';
import VariantManager from '../form/VariantManager';

interface ProductFormProps {
  initialData?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ initialData, onClose, onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  
  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [variants, setVariants] = useState<VariantInput[]>([
    { price: 0, stock: 0, attributes: [{ attribute: '', value: '' }] }
  ]);

  const isEditing = !!initialData;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 1. Fetch Categories
  useEffect(() => {
    axios.get(`${API_URL}/admin/categories`, { withCredentials: true })
      .then(res => {
        if (res.data.success) setCategories(res.data.data);
      })
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // 2. Fetch Full Product Details on Edit
  useEffect(() => {
    if (initialData && initialData._id) {
      setIsFetchingDetails(true);
      
      axios.get(`${API_URL}/admin/products/${initialData._id}`, { withCredentials: true })
        .then(res => {
          const product = res.data.data; // Ensure this matches your controller return { success: true, data: { ... } }

          if (!product) throw new Error("No data received");

          setName(product.name || '');
          setDescription(product.description || '');
          
          // Handle Category: It might be populated object OR just an ID string
          const catId = typeof product.category === 'object' ? product.category?._id : product.category;
          setCategoryId(catId || '');

          // TRANSFORM VARIANTS: Safely map DB structure to Form structure
          if (Array.isArray(product.variants) && product.variants.length > 0) {
            const formattedVariants = product.variants.map((v: any) => ({
              _id: v._id,
              price: v.price || 0,
              stock: v.stock || 0,
              // Check if attributes exist and map them
              attributes: Array.isArray(v.attributes) 
                ? v.attributes.map((attr: any) => ({
                    // Handle populated vs unpopulated attribute names
                    attribute: attr.attribute?.name || attr.attribute || '',
                    value: attr.value?.value || attr.value || ''
                  })) 
                : [{ attribute: '', value: '' }]
            }));
            setVariants(formattedVariants);
          }
        })
        .catch(err => {
          console.error("Failed to fetch details", err);
          toast.error("Could not load product details. Check console.");
        })
        .finally(() => setIsFetchingDetails(false));
    }
  }, [initialData]);

  // 3. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic Validation
    if (!name || !categoryId) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
    }

    const payload = {
      name,
      description,
      category_id: categoryId,
      variants
    };

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/admin/products/${initialData._id}`, payload, { withCredentials: true });
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${API_URL}/admin/products`, payload, { withCredentials: true });
        toast.success("Product created successfully");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Save failed", error);
      const msg = error.response?.data?.message || "Failed to save product";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Product' : 'Create New Product'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isFetchingDetails ? (
             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Loading product details...</p>
             </div>
          ) : (
            <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
              
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  General Information
                </h3>
                <BasicInfo 
                  name={name} setName={setName}
                  description={description} setDescription={setDescription}
                  categoryId={categoryId} setCategoryId={setCategoryId}
                  categories={categories}
                />
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                  Inventory & Variants
                </h3>
                <VariantManager variants={variants} setVariants={setVariants} />
              </section>

            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="product-form"
            disabled={isSubmitting || isFetchingDetails} 
            className="px-6 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Product</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}