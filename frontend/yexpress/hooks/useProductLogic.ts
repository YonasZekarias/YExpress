import { useState, useMemo, useEffect } from 'react';
import { Product, Variant, Attribute, AttributeValue } from "@/types/product";

// Helpers
const getAttrName = (attr: string | Attribute) => typeof attr === 'string' ? attr : attr.name;
const getAttrValue = (val: string | AttributeValue) => typeof val === 'string' ? val : (val.value || (val as any).name || 'Unknown');

export const useProductLogic = (product: Product, variants: Variant[]) => {
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  // 1. Get all unique Attribute Types (e.g., "Color", "Size")
  const attributeTypes = useMemo(() => {
    const types = new Set<string>();
    variants.forEach(v => {
      v.attributes?.forEach(attr => types.add(getAttrName(attr.attribute)));
    });
    return Array.from(types);
  }, [variants]);

  // 2. Get available values for a specific type
  const getValuesForAttribute = (typeName: string) => {
    const values = new Set<string>();
    variants.forEach(v => {
      const match = v.attributes.find(a => getAttrName(a.attribute) === typeName);
      if (match) values.add(getAttrValue(match.value));
    });
    return Array.from(values);
  };

  // 3. Determine Active Variant based on selection
  const activeVariant = useMemo(() => {
    if (!variants.length) return null;
    return variants.find(v => {
      return Object.entries(selectedAttrs).every(([key, value]) => {
        const attrObj = v.attributes.find(a => getAttrName(a.attribute) === key);
        return attrObj && getAttrValue(attrObj.value) === value;
      });
    });
  }, [variants, selectedAttrs]);

  // 4. Check Stock for a specific button
  const getStockForOption = (attributeType: string, attributeValue: string) => {
    const matching = variants.filter(v => {
      const thisAttr = v.attributes.find(a => getAttrName(a.attribute) === attributeType);
      const thisVal = thisAttr ? getAttrValue(thisAttr.value) : null;
      if (thisVal !== attributeValue) return false;

      // Check against *other* currently selected attributes
      return Object.entries(selectedAttrs).every(([selKey, selVal]) => {
         if (selKey === attributeType) return true; 
         const otherAttr = v.attributes.find(a => getAttrName(a.attribute) === selKey);
         return otherAttr && getAttrValue(otherAttr.value) === selVal;
      });
    });
    return matching.reduce((sum, v) => sum + v.stock, 0);
  };

  // 5. Set default selection on load
  useEffect(() => {
    if (variants.length > 0 && Object.keys(selectedAttrs).length === 0) {
      const first = variants[0];
      const defaults: Record<string, string> = {};
      first.attributes.forEach(a => {
        defaults[getAttrName(a.attribute)] = getAttrValue(a.value);
      });
      setSelectedAttrs(defaults);
    }
  }, [variants]);

  return {
    selectedAttrs,
    setSelectedAttrs,
    quantity,
    setQuantity,
    attributeTypes,
    getValuesForAttribute,
    getStockForOption,
    activeVariant,
    currentPrice: activeVariant ? activeVariant.price : product.price,
    currentStock: activeVariant ? activeVariant.stock : product.stock,
  };
};