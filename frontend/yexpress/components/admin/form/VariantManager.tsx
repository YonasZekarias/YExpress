'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { VariantInput } from '@/types/admin';

interface VariantManagerProps {
  variants: VariantInput[];
  setVariants: (v: VariantInput[]) => void;
}

export default function VariantManager({ variants, setVariants }: VariantManagerProps) {
  
  const addVariant = () => {
    setVariants([...variants, { price: 0, stock: 0, attributes: [{ attribute: '', value: '' }] }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) return alert("You must have at least one variant.");
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantInput, value: any) => {
    const newVariants = [...variants];
    // @ts-ignore
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addAttribute = (vIndex: number) => {
    const newVariants = [...variants];
    newVariants[vIndex].attributes.push({ attribute: '', value: '' });
    setVariants(newVariants);
  };

  const updateAttribute = (vIndex: number, aIndex: number, field: 'attribute' | 'value', val: string) => {
    const newVariants = [...variants];
    newVariants[vIndex].attributes[aIndex][field] = val;
    setVariants(newVariants);
  };

  const removeAttribute = (vIndex: number, aIndex: number) => {
    const newVariants = [...variants];
    if (newVariants[vIndex].attributes.length === 1) return; // Keep at least one attribute
    newVariants[vIndex].attributes = newVariants[vIndex].attributes.filter((_, i) => i !== aIndex);
    setVariants(newVariants);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Product Variants</h3>
        <button type="button" onClick={addVariant} className="flex items-center gap-2 text-sm bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Variant
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {variants.map((variant, vIndex) => (
          <div key={vIndex} className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 relative group transition-all hover:border-blue-300 dark:hover:border-blue-700">
            
            <button 
              type="button" 
              onClick={() => removeVariant(vIndex)} 
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Remove Variant"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price ($)</label>
                <input 
                  type="number" 
                  min="0"
                  value={variant.price} 
                  onChange={e => updateVariant(vIndex, 'price', Number(e.target.value))} 
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</label>
                <input 
                  type="number" 
                  min="0"
                  value={variant.stock} 
                  onChange={e => updateVariant(vIndex, 'stock', Number(e.target.value))} 
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            <div className="space-y-3 bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attributes (Color, Size, etc)</label>
              {variant.attributes.map((attr, aIndex) => (
                <div key={aIndex} className="flex items-center gap-2">
                  <input 
                    placeholder="Name (e.g. Color)" 
                    value={attr.attribute} 
                    onChange={e => updateAttribute(vIndex, aIndex, 'attribute', e.target.value)} 
                    className="flex-1 p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 outline-none" 
                  />
                  <input 
                    placeholder="Value (e.g. Red)" 
                    value={attr.value} 
                    onChange={e => updateAttribute(vIndex, aIndex, 'value', e.target.value)} 
                    className="flex-1 p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-blue-500 outline-none" 
                  />
                  {variant.attributes.length > 1 && (
                     <button type="button" onClick={() => removeAttribute(vIndex, aIndex)} className="text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                     </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addAttribute(vIndex)} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Attribute
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}