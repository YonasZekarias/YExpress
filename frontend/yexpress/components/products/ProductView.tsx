'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { Product, Variant } from '@/types/product';
import { useProductLogic } from '@/hooks/useProductLogic';
import { ProductGallery } from './ProductGallery';
import { VariantSelector } from './VariantSelector';

// --- MAIN COMPONENT ---
export default function ProductView({ 
  product, variants, initialWishlistState 
}: { 
  product: Product; variants: Variant[]; initialWishlistState: boolean; 
}) {
  
  // 1. Use Custom Logic Hook
  const {
    selectedAttrs, setSelectedAttrs,
    quantity, setQuantity,
    attributeTypes, getValuesForAttribute, getStockForOption,
    activeVariant, currentPrice, currentStock
  } = useProductLogic(product, variants);

  // 2. Wishlist Logic (kept here as it relies on simple props)
  const [isWishlisted, setIsWishlisted] = useState(initialWishlistState);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleWishlist = async () => {
    if (loading) return;
    setLoading(true);
    const prev = isWishlisted;
    setIsWishlisted(!prev);

    try {
      await axios.post(`${API_URL}/user/wishlist`, { productId: product._id }, { withCredentials: true });
      toast.success(prev ? "Removed from wishlist" : "Added to wishlist");
    } catch (e) {
      setIsWishlisted(prev);
      toast.error("Failed to update wishlist");
    } finally {
      setLoading(false);
    }
  };

  // 3. Cart Logic
  const handleCart = async () => {
    if (!activeVariant && variants.length > 0) {
      return toast.error("Please select options");
    }
    
    try {
      await axios.post(`${API_URL}/user/cart`, {
        productId: product._id,
        variantId: activeVariant?._id || null,
        quantity
      }, { withCredentials: true });
      
      toast.success("Added to cart");
      // Optional: window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  // 4. Prepare Images
  const images = product.photo?.map(p => 
    p.startsWith('http') ? p : '/placeholder.jpg'
  ) || ['/placeholder.jpg'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* --- LEFT: GALLERY --- */}
      <ProductGallery images={images} productName={product.name} />

      {/* --- RIGHT: INFO & ACTIONS --- */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-500 uppercase">{product.category?.name}</p>
        <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
        <p className="text-2xl font-bold mt-4">${currentPrice.toFixed(2)}</p>

        {/* SELECTORS */}
        <VariantSelector 
          attributeTypes={attributeTypes}
          selectedAttrs={selectedAttrs}
          onSelect={(key, val) => setSelectedAttrs(prev => ({ ...prev, [key]: val }))}
          getValues={getValuesForAttribute}
          getStock={getStockForOption}
        />

        {/* FOOTER ACTIONS */}
        <div className="mt-8 pt-6 border-t">
          {/* Stock Indicator */}
          <div className="mb-4">
             {currentStock > 0 
               ? <span className="text-green-600 font-medium">In Stock: {currentStock}</span>
               : <span className="text-red-500 font-medium">Out of Stock</span>
             }
          </div>

          {/* Quantity Row */}
          <div className="flex items-center gap-4 mb-4">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center border rounded">
               <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus className="w-4 h-4"/></button>
               <span className="px-4 font-medium">{quantity}</span>
               <button onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} className="p-2"><Plus className="w-4 h-4"/></button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={handleCart}
              disabled={currentStock === 0}
              className={`flex-1 py-3 px-6 rounded-lg font-bold flex justify-center items-center gap-2 
                ${currentStock > 0 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {currentStock > 0 ? 'Add to Cart' : 'Sold Out'}
            </button>
            
            <button 
              onClick={handleWishlist}
              className={`p-3 border rounded-lg transition-colors ${isWishlisted ? 'text-red-500 bg-red-50 border-red-200' : 'hover:bg-gray-50'}`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}