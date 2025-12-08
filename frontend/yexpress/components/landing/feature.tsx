import {Layers,ShoppingCart,LayoutDashboard,Users,CreditCard, Package} from 'lucide-react'

const Feature = () => {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm">System Capabilities</h2>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Everything customers & admins need</h3>
          <p className="mt-4 text-xl text-slate-600">
            From browsing products to managing inventory, our modular system handles every step of the e-commerce lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <Layers className="h-6 w-6 text-white" />,
              title: "Product Variations",
              desc: "Customers can easily browse products and select preferred sizes, colors, and other custom attributes.",
              color: "bg-indigo-500"
            },
            {
              icon: <ShoppingCart className="h-6 w-6 text-white" />,
              title: "Smart Cart System",
              desc: "A seamless cart experience allowing users to modify quantities and save items for later.",
              color: "bg-blue-500"
            },
            {
              icon: <LayoutDashboard className="h-6 w-6 text-white" />,
              title: "Admin Dashboard",
              desc: "A powerful backend for store owners to oversee sales, revenue, and daily operations at a glance.",
              color: "bg-violet-600"
            },
            {
              icon: <Package className="h-6 w-6 text-white" />,
              title: "Inventory Control",
              desc: "Real-time tracking of stock levels with automated alerts when supplies run low.",
              color: "bg-amber-500"
            },
            {
              icon: <Users className="h-6 w-6 text-white" />,
              title: "User Management",
              desc: "Admins can manage customer profiles, view order history, and handle support requests efficiently.",
              color: "bg-rose-500"
            },
            {
              icon: <CreditCard className="h-6 w-6 text-white" />,
              title: "Flexible Payments",
              desc: "Support for multiple payment methods to ensure a smooth checkout process for every customer.",
              color: "bg-emerald-500"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 group">
              <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Feature;
