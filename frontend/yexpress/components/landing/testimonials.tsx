import { Star } from 'lucide-react';
const Testimonials = () => {
    const testimonialsData = [
      {
        quote: "YExpress transformed our inventory management. The admin dashboard is intuitive, powerful, and saved us 15 hours a week in manual work!",
        name: "Jessica P.",
        title: "CEO of GlobalVogue",
        avatar: "https://placehold.co/100x100/4F46E5/FFFFFF?text=JP",
        rating: 5,
      },
      {
        quote: "As a customer, the checkout process is lightning fast. I love the product variation selector—it makes shopping seamless and fast.",
        name: "Mark T.",
        title: "Frequent Shopper",
        avatar: "https://placehold.co/100x100/10B981/FFFFFF?text=MT",
        rating: 5,
      },
      {
        quote: "The real-time order tracking feature is fantastic. My customers are always updated, leading to fewer support requests.",
        name: "Sam R.",
        title: "Operations Manager, Nebula",
        avatar: "https://placehold.co/100x100/EF4444/FFFFFF?text=SR",
        rating: 4,
      },
    ];

    const StarRating = ({ rating }: { rating: number }) => {
        return (
            <div className="flex space-x-1  text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < rating ? 'fill-current' : 'text-slate-300'}`} />
                ))}
            </div>
        );
    };

    return (
        <section id="testimonials" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm">Customer Trust</h2>
                    <h3 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">What Our Users Say</h3>
                    <p className="mt-4 text-xl text-slate-600">
                        See how YExpress is simplifying shopping for customers and streamlining business for store owners.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="bg-slate-50 p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col h-full">
                            <StarRating rating={testimonial.rating} />
                            <p className="text-slate-700 text-lg italic mb-6 grow">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-indigo-500"
                                    onError={(e) => { const img = e.currentTarget as HTMLImageElement; img.onerror = null; img.src = 'https://placehold.co/100x100/000/FFF?text=User'; }}
                                />
                                <div>
                                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                                    <p className="text-sm text-indigo-600">{testimonial.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default Testimonials;