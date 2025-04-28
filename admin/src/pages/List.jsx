import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { Trash2, Eye, Tag, RefreshCw, Search, Grid, List as ListIcon } from "lucide-react";

const List = ({ token }) => {
  const [listProducts, setListProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  const fetchListProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setListProducts(response.data.products);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.products.map(product => product.category))];
        setCategories(["All", ...uniqueCategories]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.info(response.data.message);
        await fetchListProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove product.");
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);

  // Filter products based on search term and category
  const filteredProducts = listProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen max-w-5xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-black to-black/80 py-6 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Product Inventory</h1>
            <p className="text-purple-200 mt-1">Manage your product catalog</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button 
              onClick={() => fetchListProducts()}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                >
                  <Grid size={18} className={viewMode === "grid" ? "text-purple-600" : "text-gray-500"} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                >
                  <ListIcon size={18} className={viewMode === "list" ? "text-purple-600" : "text-gray-500"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product List Section */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No products found</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="relative">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-56 object-cover transition-transform group-hover:scale-105"
                  />
                  {product.bestSeller && (
                    <span className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                      {product.name}
                    </h2>
                    <span className="text-lg font-bold text-purple-600">
                      {currency(product.price)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {product.category} · {product.subCategory}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 rounded-full border border-gray-200"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => removeProduct(product._id)}
                      className="flex-1 flex justify-center items-center gap-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                    <button
                      className="flex justify-center items-center p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img className="h-12 w-12 rounded-md object-cover" src={product.image[0]} alt={product.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                          </div>
                          {product.bestSeller && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-amber-800 bg-amber-100 rounded-full">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                        <div className="text-xs text-gray-500">{product.subCategory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-purple-600">{currency(product.price)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 text-xs bg-gray-100 rounded-full"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => removeProduct(product._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="text-purple-500 hover:text-purple-600"
                          >
                            <Eye size={18} />
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
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          Showing {filteredProducts.length} of {listProducts.length} products
        </div>
      </div>
    </div>
  );
};

export default List;