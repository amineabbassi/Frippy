import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const {search, setSearch, showSearch, setShowSearch, products} = useContext(ShopContext);
    const [localResults, setLocalResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Filter products as user types
    useEffect(() => {
        if (!search.trim()) {
            setLocalResults([]);
            return;
        }
        setLoading(true);
        const results = products.filter(product =>
            product.name.toLowerCase().startsWith(search.toLowerCase())
        );
        setLocalResults(results);
        setLoading(false);
    }, [search, products]);

    // Handle search submit
    const handleSearch = () => {
        if (!search.trim()) return;
        setShowSearch(false);
        navigate(`/collection?search=${encodeURIComponent(search)}`);
    };

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Clear search on close
    const handleClose = () => {
        setShowSearch(false);
        setSearch('');
        setLocalResults([]);
    };

    return showSearch ? (
        <div className='text-center border-t border-b bg-gray-50 relative'>
            <div className='inline-flex items-center justify-center w-3/4 px-5 py-2 mx-3 my-5 border border-gray-400 rounded-full sm:w-1/2'>
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    className='flex-1 text-sm outline-none bg-inherit' 
                    type="text" placeholder='Search...' 
                    disabled={loading}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className='flex items-center'
                    style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                >
                    {loading ? (
                        <span className="loader w-4 h-4 mr-1" />
                    ) : (
                        <img className='w-4' src={assets.search_icon} alt="Search" />
                    )}
                </button>
            </div>
            <img 
                onClick={handleClose} 
                className='inline w-3 cursor-pointer' 
                src={assets.cross_icon} alt="Close" 
            />
            {/* Results dropdown */}
            {localResults.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 w-3/4 sm:w-1/2 bg-white border rounded shadow-lg mt-2 z-50 max-h-64 overflow-y-auto">
                    {localResults.map(product => (
                        <div
                            key={product._id}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                navigate(`/product/${product._id}`);
                                setShowSearch(false);
                                setSearch('');
                            }}
                        >
                            <img src={product.image[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                            <div className="text-left">
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.category}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ) : null;
}

export default SearchBar;
