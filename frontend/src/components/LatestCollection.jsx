import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Get the most recent products
    const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setLatestProducts(sortedProducts.slice(0, 10));
    
    // Intersection observer for animation on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, [products]);

  const handleProductHover = (index) => {
    setActiveIndex(index);
  };

  // Categories for filtering
  const categories = ["All", "Clothing", "Accessories", "Home", "Beauty"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All" 
    ? latestProducts 
    : latestProducts.filter(product => product.category === activeCategory);

  return (
    <section 
      ref={sectionRef}
      className="my-16 px-4 sm:px-6 lg:px-8 relative" 
      aria-labelledby="latest-collection-heading"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent -z-10 h-1/2 rounded-lg"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-20 h-20 border-l-2 border-t-2 border-gray-200 -z-10 opacity-60"></div>
      <div className="absolute bottom-20 right-0 w-20 h-20 border-r-2 border-b-2 border-gray-200 -z-10 opacity-60"></div>
      
      <div className={`max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="py-12 text-center text-3xl max-w-3xl mx-auto">
          <Title text1={"LATEST"} text2={"COLLECTIONS"} />
          <p className="mt-6 text-gray-600 text-sm sm:text-base leading-relaxed">
            Step into a world of style with our newest collections, carefully
            curated to bring you the best in fashion, home decor, and more.
            <span className="hidden sm:inline"> Discover pieces that define the season's trends and elevate your everyday experience.</span>
          </p>
        </div>
        
      

        {/* Products grid with staggered animation */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 md:gap-y-10">
          {filteredProducts.map((item, index) => (
            <div 
              key={index}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => handleProductHover(index)}
            >
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                isActive={activeIndex === index}
              />
            </div>
          ))}
        </div>
        
        {/* View all button */}
        <div className="mt-12 text-center">
          <button className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition duration-300 ease-out border border-gray-200 rounded-md hover:bg-black">
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-black group-hover:translate-x-0 ease">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-black transition-all duration-300 transform group-hover:translate-x-full ease">VIEW ALL COLLECTIONS</span>
            <span className="relative invisible">VIEW ALL COLLECTIONS</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;