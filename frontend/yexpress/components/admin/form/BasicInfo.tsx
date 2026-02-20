'use client';

import { Category } from '@/types/admin';

interface BasicInfoProps {
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  categories: Category[];
}

export default function BasicInfo({ 
  name, setName, 
  description, setDescription, 
  categoryId, setCategoryId, 
  categories 
}: BasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
        <input 
          required 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
          placeholder="e.g. Wireless Headphones"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select 
          required 
          value={categoryId} 
          onChange={e => setCategoryId(e.target.value)} 
          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        >
          <option value="">Select Category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea 
          rows={3} 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
          placeholder="Product details..."
        />
      </div>
    </div>
  );
}