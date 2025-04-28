import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { 
  Upload, 
  X, 
  Check, 
  Tag, 
  DollarSign, 
  Package, 
  Layers, 
  Save, 
  RefreshCcw,
  Award
} from "lucide-react";

const Add = ({ token }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setName("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setPrice("");
    setSizes([]);
    setBestSeller(false);
  };

  const removeImage = (setter) => {
    setter(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen max-w-5xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-black to-black/80 py-6 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Product</h1>
            <p className="text-purple-200 mt-1">Create a new item in your inventory</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={onSubmitHandler} className="space-y-8">
            {/* Image Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <Upload size={20} className="text-purple-600" />
                Product Images
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { state: image1, setter: setImage1, id: "image1" },
                  { state: image2, setter: setImage2, id: "image2" },
                  { state: image3, setter: setImage3, id: "image3" },
                  { state: image4, setter: setImage4, id: "image4" }
                ].map((image, index) => (
                  <div key={index} className="relative">
                    <label htmlFor={image.id} className="block cursor-pointer">
                      <div className={`aspect-square overflow-hidden rounded-lg border-2 ${image.state ? 'border-purple-400' : 'border-dashed border-gray-300 hover:border-purple-300'} flex items-center justify-center transition-all`}>
                        {image.state ? (
                          <img
                            src={URL.createObjectURL(image.state)}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 text-gray-400">
                            <Upload size={24} className="mb-2" />
                            <p className="text-xs text-center">Upload Image {index + 1}</p>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) => image.setter(e.target.files[0])}
                        type="file"
                        id={image.id}
                        hidden
                        accept="image/*"
                      />
                    </label>
                    {image.state && (
                      <button
                        type="button"
                        onClick={() => removeImage(image.setter)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500">Upload up to 4 images. First image will be used as the main product image.</p>
            </div>

            {/* Basic Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Package size={18} className="text-purple-600" />
                    Product Name
                  </label>
                  <input
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    type="text"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Layers size={18} className="text-purple-600" />
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors min-h-32"
                    placeholder="Describe your product in detail"
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <Tag size={18} className="text-purple-600" />
                      Category
                    </label>
                    <select
                      id="category"
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subCategory" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <Tag size={18} className="text-purple-600" />
                      Sub Category
                    </label>
                    <select
                      id="subCategory"
                      onChange={(e) => setSubCategory(e.target.value)}
                      value={subCategory}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Select Sub Category</option>
                      <option value="Topwear">Topwear</option>
                      <option value="Bottomwear">Bottomwear</option>
                      <option value="Winterwear">Winterwear</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="price" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <DollarSign size={18} className="text-purple-600" />
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 -left-1 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">DT</span>
                    </div>
                    <input
                      id="price"
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                      className="w-full pl-8 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                    <Package size={18} className="text-purple-600" />
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <div
                        key={size}
                        onClick={() =>
                          setSizes((prev) =>
                            prev.includes(size)
                              ? prev.filter((item) => item !== size)
                              : [...prev, size]
                          )
                        }
                        className={`
                          px-4 py-2 rounded-md cursor-pointer transition-all
                          ${
                            sizes.includes(size)
                              ? "bg-purple-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }
                        `}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                  {sizes.length > 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      {sizes.length} size{sizes.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div
                    onClick={() => setBestSeller((prev) => !prev)}
                    className={`
                      flex items-center cursor-pointer px-4 py-3 rounded-lg transition-all
                      ${bestSeller ? "bg-amber-50 border border-amber-200" : "bg-gray-50 border border-gray-200"}
                    `}
                  >
                    <div className={`
                      w-5 h-5 rounded flex items-center justify-center mr-2
                      ${bestSeller ? "bg-amber-500 text-white" : "border border-gray-300"}
                    `}>
                      {bestSeller && <Check size={14} />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={18} className={bestSeller ? "text-amber-500" : "text-gray-400"} />
                      <span className={bestSeller ? "font-medium text-amber-700" : "text-gray-600"}>
                        Mark as Best Seller
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
                  ${isSubmitting 
                    ? "bg-purple-400 text-white cursor-not-allowed" 
                    : "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg"}
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Add Product</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCcw size={18} />
                <span>Reset Form</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;