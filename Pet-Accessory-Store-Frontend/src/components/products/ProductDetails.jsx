import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '@/features/productsSlice.js';
import { addToCart } from '@/features/cartSlice.js';
import ImageGallery from './ImageGallery.jsx';
import { formatPrice } from '@/utils/formatters.js';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const { currentProduct, isLoading, error } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        dispatch(fetchProductById(id));
    }, [dispatch, id]);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        if (currentProduct && newQuantity > currentProduct.inventory) {
            alert(`Only ${currentProduct.inventory} items available`);
            return;
        }
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        if (!currentProduct) return;

        // Require login to add to cart
        if (!user) {
            navigate('/login', { state: { from: `/products/${currentProduct._id}` } });
            return;
        }

        if (currentProduct.inventory === 0) {
            return;
        }

        if (quantity > currentProduct.inventory) {
            return;
        }

        dispatch(addToCart({ product: currentProduct, quantity }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-velvet-purple mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !currentProduct) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const discountPercentage = currentProduct.compareAtPrice && currentProduct.compareAtPrice > currentProduct.price
        ? Math.round((1 - currentProduct.price / currentProduct.compareAtPrice) * 100)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <nav className="flex mb-8 text-sm">
                <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900">{currentProduct.category}</span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900 truncate">{currentProduct.title}</span>
            </nav>

            {/* Back Button */}
            <button
                onClick={() => navigate('/products')}
                className="mb-6 text-velvet-purple hover:text-velvet-purple-dark flex items-center text-sm font-medium"
            >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    <ImageGallery images={currentProduct.images} />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Title & Category */}
                    <div>
                        <p className="text-sm text-gray-500 mb-2">{currentProduct.category}</p>
                        <h1 className="text-3xl font-bold text-gray-900">{currentProduct.title}</h1>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline space-x-3">
                        <span className="text-3xl font-bold text-gray-900">
                            {formatPrice(currentProduct.price)}
                        </span>
                        {currentProduct.compareAtPrice && currentProduct.compareAtPrice > currentProduct.price && (
                            <>
                                <span className="text-xl text-gray-500 line-through">
                                    {formatPrice(currentProduct.compareAtPrice)}
                                </span>
                                <span className="px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded">
                                    {discountPercentage}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div>
                        {currentProduct.inventory === 0 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                Out of Stock
                            </span>
                        ) : currentProduct.inventory <= 10 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                Only {currentProduct.inventory} left in stock!
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                In Stock
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                        <p className="text-gray-600 leading-relaxed">{currentProduct.description}</p>
                    </div>

                    {/* Tags */}
                    {currentProduct.tags && typeof currentProduct.tags === 'string' && currentProduct.tags.trim() && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {currentProduct.tags.split(',').map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector & Add to Cart / Admin Controls */}
                    <div className="border-t border-gray-200 pt-6">
                        {isAdmin ? (
                            /* Admin Controls */
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate(`/admin/products/edit/${currentProduct._id}`)}
                                        className="flex-1 px-6 py-3 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2 font-medium"
                                    >
                                        ✏️ Edit Product
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/products')}
                                        className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
                                    >
                                        Back to Products
                                    </button>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Admin View:</strong> You're viewing this product as an administrator.
                                        Click "Edit Product" to modify details, pricing, or inventory.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Customer Controls */
                            <>
                                <div className="flex items-center space-x-4 mb-4">
                                    <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                                        Quantity:
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
                                            disabled={currentProduct.inventory === 0}
                                        >
                                            -
                                        </button>
                                        <input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            max={currentProduct.inventory}
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                                            disabled={currentProduct.inventory === 0}
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
                                            disabled={currentProduct.inventory === 0}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={currentProduct.inventory === 0}
                                    className="w-full px-6 py-3 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
                                >
                                    {currentProduct.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
