import { ChevronRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
const Hero = () => {
  const router = useRouter();
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Text */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 mb-12 lg:mb-0">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
              Complete Platform V1.0
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-6">

              The Ultimate{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
                Commerce Solution
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              A complete online shopping platform designed for everyone.
              Customers get a seamless shopping experience, while store owners
              get a powerful dashboard to manage it all.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={()=>{router.push("/auth/signin")}} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center">
                Start Shopping
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              {/* <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-bold text-lg transition-all shadow-sm flex items-center justify-center">
                View Admin Demo
              </button> */}
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"
                  ></div>
                ))}
              </div>
              <p>Trusted by 500+ Store Owners</p>
            </div>
          </div>

          {/* --- Video Container --- */}
          <div id="hero" className="relative w-full">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-30"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-slate-900">

              {/* Video with fallback */}
              <video
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                key="hero-video" 
                poster="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Floating Stats Card */}
            <div className="hidden xl:block rounded p-1 absolute -left-12 -bottom-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-4 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Weekly Orders
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">1,245</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
