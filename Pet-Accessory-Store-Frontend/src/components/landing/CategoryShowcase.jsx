import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CategoryShowcase() {
    const productsState = useSelector((state) => state.products);
    const dbCategories = productsState?.categories || [];
    const products = productsState?.items || [];

    // Category descriptions
    const categoryDescriptions = {
        'Dogs': 'Collars, Leashes & More',
        'Cats': 'Toys, Beds & Accessories',
        'Toys': 'Fun & Interactive Play',
        'Accessories': 'Bowls, Carriers & More',
        'Food': 'Nutritious Meals',
        'Beds': 'Comfortable Rest'
    };

    // Get the first product image for each category
    const getCategoryImage = (categoryName) => {
        const productInCategory = products.find(
            p => p.category === categoryName && p.images && p.images.length > 0
        );
        return productInCategory?.images[0]?.url || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop';
    };

    // Build categories array from database with actual product images
    const categories = dbCategories.map(cat => ({
        name: cat,
        image: getCategoryImage(cat),
        description: categoryDescriptions[cat] || 'Premium Products',
        link: `/products?category=${cat}`
    }));

    return (
        <div className="py-16 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 relative">
                    {/* Decorative paw icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-velvet-purple to-purple-600 rounded-full mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 100 100" fill="currentColor">
                            <ellipse cx="50" cy="65" rx="20" ry="18" />
                            <ellipse cx="30" cy="40" rx="10" ry="12" />
                            <ellipse cx="50" cy="30" rx="10" ry="12" />
                            <ellipse cx="70" cy="40" rx="10" ry="12" />
                        </svg>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-velvet-purple to-gray-900 bg-clip-text text-transparent mb-3">
                        Shop by Category
                    </h2>

                    {/* Decorative line */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-velvet-golden"></div>
                        <div className="w-2 h-2 bg-velvet-golden rounded-full"></div>
                        <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-velvet-golden"></div>
                    </div>

                    <p className="text-lg text-gray-600">
                        Find exactly what your pet needs
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={category.link}
                            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-[0_25px_50px_-12px_rgba(107,51,129,0.4)] hover:ring-2 hover:ring-velvet-golden/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02]"
                        >
                            {/* Category Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            </div>

                            {/* Category Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-1 group-hover:text-velvet-golden transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-200 mb-3">
                                    {category.description}
                                </p>
                                <div className="flex items-center text-velvet-golden font-semibold">
                                    <span>Shop Now</span>
                                    <svg
                                        className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>

                            {/* Hover Border Effect */}
                            <div className="absolute inset-0 border-4 border-transparent group-hover:border-velvet-golden rounded-2xl transition-all duration-300" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
