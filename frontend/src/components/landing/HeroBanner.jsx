import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiscounts } from '@/features/discountsSlice.js';

export default function HeroBanner({ onShopNow }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentDiscountIndex, setCurrentDiscountIndex] = useState(0);
    const dispatch = useDispatch();

    // Safely access discounts from Redux store
    const discountsState = useSelector((state) => state.discounts);
    const discounts = discountsState?.discounts || [];
    const isLoading = discountsState?.isLoading;
    const hasFetched = discountsState?.hasFetched;

    // Fetch discounts on component mount - only if not already fetched
    useEffect(() => {
        if (!hasFetched && !isLoading) {
            dispatch(fetchDiscounts());
        }
    }, [dispatch, hasFetched, isLoading]);

    // Get active discounts - use endsAt (correct field name)
    const activeDiscounts = discounts.filter(d => {
        try {
            return d.active && new Date(d.endsAt) > new Date();
        } catch (error) {
            return false;
        }
    });

    const slides = [
        {
            id: 1,
            title: "Accessories that move with them",
            subtitle: "Practical, comfortable accessories for pets",
            image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=600&fit=crop",
            cta: "Shop now"
        },
        {
            id: 2,
            title: "Where Paws Meet Plush",
            subtitle: "Premium quality for your furry friends",
            image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&h=600&fit=crop",
            cta: "Explore Collection"
        }
    ];

    // Auto-rotate hero carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // Auto-rotate discount carousel
    useEffect(() => {
        if (activeDiscounts.length > 1) {
            const timer = setInterval(() => {
                setCurrentDiscountIndex((prev) => (prev + 1) % activeDiscounts.length);
            }, 3000); // Change discount every 3 seconds
            return () => clearInterval(timer);
        }
    }, [activeDiscounts.length]);

    const nextDiscount = () => {
        setCurrentDiscountIndex((prev) => (prev + 1) % activeDiscounts.length);
    };

    const prevDiscount = () => {
        setCurrentDiscountIndex((prev) => (prev - 1 + activeDiscounts.length) % activeDiscounts.length);
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Discount Carousel Banner */}
            {activeDiscounts.length > 0 && (
                <div className="relative bg-gradient-to-r from-velvet-purple via-purple-600 to-velvet-purple py-4 overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] animate-pulse"></div>
                    </div>

                    {/* Left Arrow - only show if multiple discounts */}
                    {activeDiscounts.length > 1 && (
                        <button
                            onClick={prevDiscount}
                            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-all hover:scale-110"
                            aria-label="Previous discount"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Carousel Track */}
                    <div className="relative overflow-hidden mx-12 md:mx-16">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentDiscountIndex * 100}%)` }}
                        >
                            {activeDiscounts.map((discount, index) => (
                                <div key={discount._id || index} className="min-w-full flex-shrink-0">
                                    <div className="text-center px-2 sm:px-4">
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-white">
                                            {/* Special Offer Badge */}
                                            <span className="inline-flex items-center text-xs sm:text-sm">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="font-semibold">Special Offer!</span>
                                            </span>

                                            {/* Code and Discount */}
                                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center text-xs sm:text-sm md:text-base">
                                                <span className="font-medium hidden sm:inline">Use code:</span>
                                                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-velvet-golden text-white rounded-md font-bold tracking-wider shadow-lg text-sm sm:text-base">
                                                    {discount.code}
                                                </span>
                                                <span className="font-bold text-velvet-golden">
                                                    for {discount.type === 'percentage' ? `${discount.value}%` : `₹${(discount.value / 100).toFixed(2)}`} OFF
                                                </span>
                                            </div>

                                            {/* Min Order */}
                                            {discount.minOrderValue > 0 && (
                                                <span className="text-[10px] sm:text-xs opacity-90">
                                                    (Min. order: ₹{(discount.minOrderValue / 100).toFixed(2)})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Arrow - only show if multiple discounts */}
                    {activeDiscounts.length > 1 && (
                        <button
                            onClick={nextDiscount}
                            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-all hover:scale-110"
                            aria-label="Next discount"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Carousel indicators - only show if multiple discounts */}
                    {activeDiscounts.length > 1 && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-1.5 pb-1">
                            {activeDiscounts.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentDiscountIndex(index)}
                                    className={`h-1 rounded-full transition-all ${index === currentDiscountIndex
                                        ? 'bg-velvet-golden w-6'
                                        : 'bg-white/50 hover:bg-white/75 w-1'
                                        }`}
                                    aria-label={`Go to discount ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Hero Carousel */}
            <div className="relative h-[400px] md:h-[500px]">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
                        </div>

                        {/* Content */}
                        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                            <div className="max-w-2xl text-white">
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                                    {slide.title}
                                </h1>
                                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                                    {slide.subtitle}
                                </p>
                                <button
                                    onClick={onShopNow}
                                    className="inline-block px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base md:text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                                >
                                    {slide.cta}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
