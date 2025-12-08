import { useRouter } from "next/navigation";
const Promo = () => {
  const router = useRouter();
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/50 skew-x-12 transform origin-bottom"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to scale your store?<br />
            <span className="text-indigo-400">Join the platform today.</span>
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-md">
            Simple, fast, and user-friendly. The perfect tool for both shoppers and business owners.
          </p>
          <div className="flex space-x-4">
            <button onClick={()=>{router.push('/auth/signin')}} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-500 transition">
              Get Started Now
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
           {/* Abstract Dashboard Graphic */}
           <div className="relative w-full max-w-md h-64 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
              <div className="h-8 bg-slate-700 flex items-center px-4 space-x-2 border-b border-slate-600">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-white p-4 flex">
                 <div className="w-1/4 h-full bg-slate-100 rounded mr-4"></div>
                 <div className="flex-1 space-y-4">
                    <div className="h-8 bg-indigo-50 rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-slate-100 rounded"></div>
                      <div className="h-20 bg-slate-100 rounded"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};


export default Promo;
