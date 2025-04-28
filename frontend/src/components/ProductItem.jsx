import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, isActive = false }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizes, setShowSizes] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  const availableSizes = ["XS", "S", "M", "L", "XL"];

  const handleImageChange = () => {
    if (image.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % image.length);
    }
  };

  const toggleSizeSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizes(!showSizes);
  };

  const handleSizeSelect = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedSize) {
      addToCart(id, selectedSize);
      setAdded(true);
      setTimeout(() => setAdded(false), 900);
      setShowSizes(false);
      setSelectedSize(null);
    } else {
      setShowSizes(true);
    }
  };

  return (
    <Link
      className="group block text-gray-700 cursor-pointer relative"
      to={`/product/${id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
        if (!showSizes) {
          setSelectedSize(null);
        }
      }}
      aria-label={`View details for ${name}`}
    >
      {/* Image container */}
      <div className="overflow-hidden relative aspect-[3/4] bg-gray-50">
        <img
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          src={image[currentImageIndex]}
          alt={name}
          onMouseOver={handleImageChange}
        />

        {/* Quick actions overlay */}
        <div 
          className={`absolute inset-0 bg-black/5 flex items-end justify-center transition-opacity duration-300 ${
            isHovered || showSizes ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {!showSizes ? (
              <button
                onClick={toggleSizeSelection}
                className="w-full py-3 bg-white bg-opacity-90 hover:bg-black hover:text-white transition-all duration-300 text-sm font-medium uppercase tracking-wider rounded-b-lg shadow-md hover:scale-105 focus:outline-none"
                aria-label={`Quick add ${name} to cart`}
              >
                Quick Add
              </button>
            ) : (
              <div className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20 w-56 bg-white bg-opacity-95 p-3 rounded-xl shadow-2xl animate-fadeInUp">
                <p className="text-xs text-center font-medium mb-2">Select Size</p>
                <div className="flex justify-center flex-wrap gap-1 mb-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => handleSizeSelect(e, size)}
                      className={`size-btn w-8 h-8 flex items-center justify-center text-xs border rounded-full transition-all duration-200 relative focus:outline-none ${
                        selectedSize === size 
                          ? "border-black bg-black text-white scale-110 shadow-lg"
                          : "border-gray-300 hover:border-gray-500 bg-white"
                      }`}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                      {selectedSize === size && (
                        <span className="absolute -top-1 -right-1 text-green-500 text-lg">&#10003;</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={handleQuickAdd}
                    disabled={!selectedSize}
                    className={`flex-1 py-2 text-xs font-medium uppercase rounded-lg transition-all duration-200 focus:outline-none ${
                      selectedSize 
                        ? `bg-black text-white hover:bg-gray-800 ${added ? "scale-105 ring-2 ring-green-400" : ""}` 
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    aria-label={selectedSize ? `Add ${name} size ${selectedSize} to cart` : "Select a size"}
                  >
                    {added ? "Added!" : "Add to Cart"}
                  </button>
                  <button
                    onClick={toggleSizeSelection}
                    className="py-2 px-3 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
                    aria-label="Cancel size selection"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image navigation dots (if multiple images) */}
        {image.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {image.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentImageIndex === idx ? "bg-black w-3" : "bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="mt-4 space-y-1">
        <h3 className={`text-sm transition-colors duration-300 ${isActive ? "font-medium" : ""}`}>
          {name}
        </h3>
        <p className="text-sm font-medium flex items-center">
          <span className="inline-flex items-center">
            {price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            &nbsp;{currency}
          </span>
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;

// Add this to your global CSS (e.g., index.css or tailwind.css):
/*
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px);}
  100% { opacity: 1; transform: translateY(0);}
}
.animate-fadeInUp {
  animation: fadeInUp 0.3s cubic-bezier(0.4,0,0.2,1);
}
*/