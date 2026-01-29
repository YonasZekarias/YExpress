'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart} from 'lucide-react'; // Added icons back
import { Product, Variant, Attribute, AttributeValue } from '@/types/product';

interface ProductViewProps {
  product: Product;
  variants: Variant[];
  priceRange: { min: number; max: number };
}

const getImageUrl = (photo?: string): string => {
  if (!photo) return '/placeholder.jpg'; // Unified extension
  if (photo.startsWith('http') || photo.startsWith('/')) return photo;
  return '/placeholder.jpg';
};

// HELPER 1: Get Attribute Name (Safe)
const getAttrName = (attr: string | Attribute): string => {
  if (typeof attr === 'string') return attr; 
  return attr.name; 
};

// HELPER 2: Get Attribute Value (Safe)
const getAttrValue = (val: string | AttributeValue): string => {
  if (typeof val === 'string') return val;
  return val.value || (val as any).name || 'Unknown';
};

export default function ProductView({ product, variants, priceRange }: ProductViewProps) {
  const validPhotos = product.photo?.length 
    ? product.photo.map(getImageUrl) 
    : ['/placeholder.png'];

  const [selectedImage, setSelectedImage] = useState(validPhotos[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});

  // 1. Extract Unique Attribute Types
  const attributeTypes = useMemo(() => {
    const types = new Set<string>();
    variants.forEach(v => {
      if (Array.isArray(v.attributes)) {
        v.attributes.forEach(attr => {
          const name = getAttrName(attr.attribute);
          if (name) types.add(name);
        });
      }
    });
    return Array.from(types);
  }, [variants]);

  // 2. Extract Values for a specific Attribute Type
  const getValuesForAttribute = (typeName: string) => {
    const values = new Set<string>();
    variants.forEach(v => {
      const match = v.attributes.find(a => getAttrName(a.attribute) === typeName);
      if (match) {
        values.add(getAttrValue(match.value));
      }
    });
    return Array.from(values);
  };

  // 3. Find Active Variant (Exact Match)
  const activeVariant = useMemo(() => {
    if (!variants || variants.length === 0) return null;
    return variants.find(v => {
      return Object.entries(selectedAttrs).every(([key, value]) => {
        const attrObj = v.attributes.find(a => getAttrName(a.attribute) === key);
        return attrObj && getAttrValue(attrObj.value) === value;
      });
    });
  }, [variants, selectedAttrs]);

  // 4. NEW: Calculate Stock for a specific button option
  // (Logic: "If I click this, how many items are available considering my OTHER current selections?")
  const getStockForOption = (attributeType: string, attributeValue: string) => {
    // Filter variants that match the option being checked AND the other currently selected attributes
    const matchingVariants = variants.filter(v => {
      // A. Check if this variant has the specific attribute value we are rendering (e.g. Color = Red)
      const thisAttr = v.attributes.find(a => getAttrName(a.attribute) === attributeType);
      const thisVal = thisAttr ? getAttrValue(thisAttr.value) : null;
      if (thisVal !== attributeValue) return false;

      // B. Check if this variant ALSO matches the *other* selections the user has made
      // (e.g. If user selected Size=Small, we only count Red items that are also Small)
      return Object.entries(selectedAttrs).every(([selKey, selVal]) => {
         // Skip the attribute we are currently checking (e.g. ignore Color selection when calculating Red stock)
         if (selKey === attributeType) return true; 

         const otherAttr = v.attributes.find(a => getAttrName(a.attribute) === selKey);
         return otherAttr && getAttrValue(otherAttr.value) === selVal;
      });
    });

    // Sum up the stock of all valid variants found
    return matchingVariants.reduce((sum, v) => sum + v.stock, 0);
  };

  // 5. Auto-select defaults
  useEffect(() => {
    if (variants.length > 0 && Object.keys(selectedAttrs).length === 0) {
      const firstVariant = variants[0];
      const defaults: Record<string, string> = {};
      firstVariant.attributes.forEach(a => {
        defaults[getAttrName(a.attribute)] = getAttrValue(a.value);
      });
      setSelectedAttrs(defaults);
    }
  }, [variants]);

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Column: Images */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Image src={selectedImage} alt={product.name} fill className="object-cover" priority />
        </div>
        {validPhotos.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {validPhotos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(photo)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === photo ? 'border-black dark:border-white' : 'border-transparent'
                }`}
              >
                <Image src={photo} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Details */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category?.name}</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{product.name}</h1>
        <p className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">${currentPrice.toFixed(2)}</p>

        {/* VARIANT SELECTORS */}
        <div className="mt-6 space-y-4">
          {attributeTypes.map((type) => (
            <div key={type}>
              <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">{type}</h3>
              <div className="flex flex-wrap gap-2">
                {getValuesForAttribute(type).map((val) => {
                  const stockCount = getStockForOption(type, val);
                  const isSelected = selectedAttrs[type] === val;
                  const isOutOfStock = stockCount === 0;

                  return (
                    <button
                      key={`${type}-${val}`}
                      disabled={isOutOfStock} // Disable click if stock is 0
                      onClick={() => setSelectedAttrs(prev => ({ ...prev, [type]: val }))}
                      className={`
                        relative px-4 py-2 text-sm border rounded-md transition-all flex items-center gap-2
                        ${isOutOfStock 
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed box-decoration-slice' 
                          : isSelected
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 dark:bg-transparent dark:text-gray-300 dark:border-gray-600'
                        }
                      `}
                    >
                      <span>{val}</span>
                      {/* Show Count Badge */}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isSelected 
                           ? 'bg-white text-black dark:bg-black dark:text-white' 
                           : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {stockCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* STOCK STATUS & CART */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
           
           {/* Main Stock Indicator */}
           <div className="mb-4">
              {currentStock > 0 ? (
                <p className="text-green-600 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  In Stock: {currentStock} items available
                </p>
              ) : (
                <p className="text-red-500 font-medium">Out of Stock</p>
              )}
           </div>

           <div className="flex items-center gap-4 mb-4">
             <span className="font-medium text-gray-900 dark:text-gray-200">Quantity</span>
             <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >-</button>
                <span className="px-3 py-1 border-x border-gray-300 dark:border-gray-600 font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(q + 1, currentStock))} // Prevent going over stock
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >+</button>
             </div>
           </div>
           
           <div className="flex gap-4">
              <button 
                disabled={currentStock === 0 || quantity > currentStock}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors
                  ${currentStock > 0 
                    ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {currentStock > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
              
              <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                <Heart className="w-6 h-6" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}