import { useState } from 'react';
import Image from 'next/image';

interface GalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery = ({ images, productName }: GalleryProps) => {
  const [selected, setSelected] = useState(images[0] || '/placeholder.jpg');

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
        <Image src={selected} alt={productName} fill className="object-cover" priority />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(img)}
              className={`relative aspect-square rounded-lg border-2 overflow-hidden ${
                selected === img ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};