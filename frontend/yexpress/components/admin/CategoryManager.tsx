'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Save, Layers, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface Category {
  _id: string;
  name: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // Add State
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Delete Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/categories`, { withCredentials: true });
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsAdding(true);
    try {
      await axios.post(`${API_URL}/admin/categories`, { name: newName }, { withCredentials: true });
      setNewName('');
      toast.success("Category added");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to add category");
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await axios.put(`${API_URL}/admin/categories/${id}`, { name: editName }, { withCredentials: true });
      setEditingId(null);
      toast.success("Category updated");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  // Triggered by the Modal
  const executeDelete = async () => {
    if (!deleteId) return;
    setIsDeleteLoading(true);
    try {
      await axios.delete(`${API_URL}/admin/categories/${deleteId}`, { withCredentials: true });
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete. Check if products are using this category.");
    } finally {
      setIsDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ADD SECTION */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" /> 
          Manage Categories
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="New Category Name (e.g. Electronics)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 p-2.5 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
          <button 
            type="submit" 
            disabled={!newName || isAdding} 
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[120px]"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </form>
      </div>

      {/* LIST SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Category Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
               <tr><td colSpan={2} className="p-8 text-center text-gray-500">Loading categories...</td></tr>
            ) : categories.length === 0 ? (
               <tr><td colSpan={2} className="p-8 text-center text-gray-500">No categories found.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    {editingId === cat._id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') handleUpdate(cat._id);
                            if(e.key === 'Escape') setEditingId(null);
                        }}
                        className="w-full max-w-sm p-2 rounded border border-blue-400 dark:bg-gray-900 dark:border-blue-500 dark:text-white outline-none ring-2 ring-blue-100 dark:ring-blue-900/50"
                      />
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === cat._id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleUpdate(cat._id)} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors" title="Save">
                            <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Cancel">
                            <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => { setEditingId(cat._id); setEditName(cat.name); }} 
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setDeleteId(cat._id)} 
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={executeDelete}
        isLoading={isDeleteLoading}
        title="Delete Category?"
        message="Are you sure you want to delete this category? If any products are assigned to this category, they might lose their categorization."
        confirmText="Delete Category"
        variant="danger"
      />

    </div>
  );
}