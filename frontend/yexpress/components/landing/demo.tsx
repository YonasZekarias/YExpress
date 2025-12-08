
import { LogIn, LayoutDashboard, Package, BarChart2, User, Settings, ShoppingBag } from 'lucide-react';

const steps = [
  {
    icon: <LogIn className="w-8 h-8 text-indigo-500" />,
    title: "1. Authentication",
    description: "Users and Admins log in securely through their respective portals (Sign In/Sign Up). Access is role-based.",
    color: "bg-indigo-50",
  },
  {
    icon: <User className="w-8 h-8 text-emerald-500" />,
    title: "2. User Dashboard",
    description: "The Customer views their profile, recent orders, tracking updates, and manages payment methods and addresses.",
    color: "bg-emerald-50",
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-rose-500" />,
    title: "3. Admin Dashboard",
    description: "The Admin gains centralized control over sales data, inventory alerts, product listings, and order fulfillment.",
    color: "bg-rose-50",
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-sky-500" />,
    title: "4. Real-Time Insights",
    description: "All stakeholders receive instant updates—customers on delivery, and admins on new sales and low stock.",
    color: "bg-sky-50",
  },
];

const Demo = () => {
  return (
    <section id="demo" className="py-20 bg-white sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold uppercase tracking-wider text-sm">Demo</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-3 sm:text-5xl">
            See YExpress in Action
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-3xl mx-auto">
            A seamless experience for both your customers and your operations team.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-slate-200 mx-16"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative z-10">
              {/* Icon Circle */}
              <div className={`p-4 rounded-full ${step.color} shadow-xl ring-4 ring-white mb-6`}>
                {step.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-base">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet Vertical Layout */}
        <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
                 <div key={index} className="flex items-start space-x-4">
                     <div className="flex flex-col items-center">
                         {/* Icon Circle */}
                        <div className={`p-3 rounded-full ${step.color} ring-2 ring-white shadow-md shrink-0`}>
                            {step.icon}
                        </div>
                        {/* Vertical Line */}
                        {index < steps.length - 1 && (
                            <div className="w-0.5 h-16 bg-slate-200"></div>
                        )}
                     </div>
                     <div className="pt-2">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h3>
                        <p className="text-slate-600 text-base">{step.description}</p>
                     </div>
                 </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Demo;