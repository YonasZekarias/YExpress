
const Brand = () => {
  return (
    <section className="py-10 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Empowering top retail brands</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <span className="text-2xl font-bold text-slate-800">AcmeCorp</span>
           <span className="text-2xl font-bold text-slate-800">GlobalVogue</span>
           <span className="text-2xl font-bold text-slate-800">TechnoSpace</span>
           <span className="text-2xl font-bold text-slate-800">Nebula</span>
           <span className="text-2xl font-bold text-slate-800">FoxRun</span>
        </div>
      </div>
    </section>
  );
};

export default Brand;
