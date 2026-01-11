const Brand = () => {
  return (
    <section className="py-10 border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8 dark:text-slate-500">
          Empowering top retail brands
        </p>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {["AcmeCorp", "GlobalVogue", "TechnoSpace", "Nebula", "FoxRun"].map(
            (brand) => (
              <span
                key={brand}
                className="text-2xl font-bold text-slate-800 dark:text-slate-200"
              >
                {brand}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
};
export default Brand;