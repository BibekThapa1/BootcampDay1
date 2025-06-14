import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
// import api from "../../services/api";
// import { getImageUrl } from "../../utils/imageUtils";
import Loading from "../../components/Loading";
import axios from "axios";
import SummaryApi from "../../api/api";
const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Meat",
  "Dairy",
  "Beverages",
  "Snacks",
  "Other",
];

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    unit: "", // added field for unit (e.g., liter, kg, piece)
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(SummaryApi.getAllProducts.url, {
        withCredentials: true,
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.stock
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      // Validate if image is required for new products
      if (!selectedProduct && !formData.image) {
        toast.error("Please upload a product image");
        return;
      }

      // Create FormData object
      console.log("form1", formData);

      let response;
      if (selectedProduct) {
        // Update existing product
        console.log("Update route");
        // console.log(productData);
        response = await axios.patch(
          `${SummaryApi.updateProduct.url}/${selectedProduct._id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        toast.success("Product updated successfully");
      } else {
        const productData = new FormData();
        productData.append("name", formData.name);
        productData.append("description", formData.description);
        productData.append("price", formData.price);
        productData.append("stock", formData.stock);
        productData.append("unit", formData.unit); // append unit field

        // Only append image if a new file is selected
        if (formData.image instanceof File) {
          productData.append("image", formData.image);
        }

        // Create new product
        console.log(formData);
        response = await axios.post(SummaryApi.addProduct.url, productData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        toast.success("Product created successfully");
      }

      if (response.data.success) {
        setShowModal(false);
        fetchProducts();
        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          image: null,
          unit: "", // reset unit field
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save product";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(
          `${SummaryApi.deleteProduct.url}/${id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          toast.success("Product deleted successfully");
          fetchProducts(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    }
  };

  const ProductImage = ({ image, name }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div className="h-24 w-24 flex-shrink-0 relative bg-gray-100 rounded-lg overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={image}
          alt={name}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            !imageLoaded && "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
            e.target.onerror = null;
          }}
        />
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        e.target.value = "";
        return;
      }
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setFormData({
              name: "",
              description: "",
              price: "",
              stock: "",
              image: null,
              unit: "", // reset unit field
            });
            setShowModal(true);
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <FaPlus className="mr-2" />
          Add Product
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Unit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <ProductImage
                          image={product.image}
                          name={product.name}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2 whitespace-pre-wrap">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      Rs.{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            console.log(product.name);
                            setFormData({
                              name: product.name,
                              description: product.description,
                              price: product.price,
                              stock: product.stock,
                              image: null,
                              unit: product.unit,
                            });
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-4 w-full max-w-2xl">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {selectedProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent whitespace-pre-wrap"
                    required
                    placeholder="Enter product description. Line breaks and formatting will be preserved."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* New Unit field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit (e.g. liter, kg, piece)
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter unit"
                  />
                </div>

                {!selectedProduct && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image{" "}
                      {!selectedProduct && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required={!selectedProduct}
                    />
                    {formData.image && (
                      <p className="mt-2 text-sm text-gray-500">
                        Selected file:{" "}
                        {formData.image instanceof File
                          ? formData.image.name
                          : "Current image"}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {selectedProduct ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
