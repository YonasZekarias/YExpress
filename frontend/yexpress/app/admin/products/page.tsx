import { Settings } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-dashed border-slate-300">
      <Settings className="w-16 h-16 text-slate-200 mb-4" />
      <h3 className="text-xl font-bold text-slate-800 capitalize">Products Management</h3>
      <p className="text-slate-500">This module is under development.</p>
    </div>
  );
}
