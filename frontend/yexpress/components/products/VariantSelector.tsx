interface SelectorProps {
  attributeTypes: string[];
  selectedAttrs: Record<string, string>;
  onSelect: (key: string, val: string) => void;
  getValues: (type: string) => string[];
  getStock: (type: string, val: string) => number;
}

export const VariantSelector = ({ 
  attributeTypes, selectedAttrs, onSelect, getValues, getStock 
}: SelectorProps) => {
  return (
    <div className="mt-6 space-y-4">
      {attributeTypes.map((type) => ( 
        <div key={type}>
          <h3 className="text-sm font-medium mb-2">{type}</h3>
          <div className="flex flex-wrap gap-2">
            {getValues(type).map((val) => {
              const stock = getStock(type, val);
              const isSelected = selectedAttrs[type] === val;
              const isOutOfStock = stock === 0;

              return (
                <button
                  key={`${type}-${val}`}
                  disabled={isOutOfStock}
                  onClick={() => onSelect(type, val)}
                  className={`relative px-4 py-2 text-sm border rounded-md flex items-center gap-2 transition-all
                    ${isOutOfStock 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white hover:border-gray-400 dark:text-black'
                    }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};