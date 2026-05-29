import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchProductById, clearCurrentProduct } from '@/features/productsSlice.js';
import { toPaise } from '@/utils/formatters.js';

export default function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    inventory: '',
    tags: '',
    size: '',
    color: '',
    length: '10',
    breadth: '10',
    height: '10',
    weight: '0.5'
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentProduct) {
      setFormData({
        title: currentProduct.title || '',
        description: currentProduct.description || '',
        price: currentProduct.price ? (currentProduct.price / 100).toFixed(2) : '',
        category: currentProduct.category || '',
        inventory: currentProduct.inventory || '',
        tags: currentProduct.tags ? currentProduct.tags.join(', ') : '',
        size: currentProduct.size || '',
        color: currentProduct.color || '',
        length: currentProduct.dimensions?.length || '10',
        breadth: currentProduct.dimensions?.breadth || '10',
        height: currentProduct.dimensions?.height || '10',
        weight: currentProduct.dimensions?.weight || '0.5'
      });
      if (currentProduct.images && currentProduct.images.length > 0) {
        setImagePreviews(currentProduct.images.map(img => img.url || img));
      }
    }
  }, [currentProduct, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);

      // Create previews for all selected files
      const previews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append('title', formData.title);
    productData.append('description', formData.description);
    // Send price as string with 2 decimal places to avoid floating-point precision issues
    productData.append('price', parseFloat(formData.price).toFixed(2));
    productData.append('category', formData.category);
    productData.append('inventory', formData.inventory);

    // Handle tags (convert comma-separated string to array)
    if (formData.tags && formData.tags.trim()) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      productData.append('tags', tagsArray.join(','));
    }

    // Add size and color if provided
    if (formData.size && formData.size.trim()) {
      productData.append('size', formData.size.trim());
    }
    if (formData.color && formData.color.trim()) {
      productData.append('color', formData.color.trim());
    }

    // Add dimensions
    productData.append('dimensions', JSON.stringify({
      length: parseFloat(formData.length) || 10,
      breadth: parseFloat(formData.breadth) || 10,
      height: parseFloat(formData.height) || 10,
      weight: parseFloat(formData.weight) || 0.5
    }));

    // Append all image files
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        productData.append('images', file);
      });
    }

    try {
      if (isEditMode) {
        await dispatch(updateProduct({ id, productData })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Toys, Food, Accessories"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., organic, premium, bestseller (comma-separated)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Separate multiple tags with commas</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>


          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="inventory"
                name="inventory"
                required
                min="0"
                value={formData.inventory}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

          </div>
        </div>

        {/* Product Attributes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Product Attributes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., Small, Medium, Large"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g., Red, Blue, Black"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping Dimensions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Shipping Dimensions</h2>
          <p className="text-sm text-gray-500">Used for accurate shipping cost calculation</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                Length (cm) *
              </label>
              <input
                type="number"
                id="length"
                name="length"
                required
                step="0.1"
                min="0"
                value={formData.length}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="breadth" className="block text-sm font-medium text-gray-700">
                Width (cm) *
              </label>
              <input
                type="number"
                id="breadth"
                name="breadth"
                required
                step="0.1"
                min="0"
                value={formData.breadth}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (cm) *
              </label>
              <input
                type="number"
                id="height"
                name="height"
                required
                step="0.1"
                min="0"
                value={formData.height}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg) *
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                required
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Images</h2>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Product Images (up to 5)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">Select up to 5 images. Hold Ctrl/Cmd to select multiple files.</p>
          </div>

          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Previews:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md border border-gray-300"
                    />
                    <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
