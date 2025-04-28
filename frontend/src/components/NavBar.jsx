import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import CartModal from './CartModal';
import { AnimatePresence } from 'framer-motion';

const NavBar = () => {
    const [visible, setVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const {setShowSearch, getCartCount} = useContext(ShopContext);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const navigate = useNavigate();
    const [lastScrollY, setLastScrollY] = useState(0);
    const [hideNav, setHideNav] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Check authentication status on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            // Get username from email in localStorage or from token
            const storedEmail = localStorage.getItem('userEmail');
            if (storedEmail) {
                setUsername(storedEmail.split('@')[0]);
            }
        }
    }, []);
    
    // Handle logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        setShowProfileMenu(false);
        setShowLogoutModal(true);
        
        // Hide modal and redirect after 2 seconds
        setTimeout(() => {
            setShowLogoutModal(false);
            navigate('/');
        }, 2000);
    };

    // Toggle profile dropdown
    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Hide/show navbar based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                setHideNav(true);
            } else {
                setHideNav(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Open cart modal
    const openCartModal = (e) => {
        e.preventDefault(); // Prevent navigating to cart page
        setIsCartModalOpen(true);
    };

    return (
        <>
            <div className={`sticky top-0 z-[100] w-full transition-transform duration-300 ease-out
                ${hideNav ? '-translate-y-full' : 'translate-y-0'}`}>
                
                <div className='flex bg-gradient-to-b from-white/100 via-white/95 to-white/90 backdrop-blur-sm items-center justify-between py-4 px-4 font-medium shadow-sm'>
                    <Link to='/'>
                        <img src={assets.logo} className='w-24 transition-transform duration-300 hover:scale-105' alt="Trendify" />
                    </Link>
                    
                    {/* Desktop Menu */}
                    <ul className='hidden gap-8 text-sm text-gray-700 sm:flex'>
                        <NavLink to='/' className={({isActive}) => 
                            `flex flex-col items-center gap-1 transition-all duration-300 hover:-translate-y-0.5 
                            ${isActive ? "text-black font-semibold" : ""}`
                        }>
                            <p>HOME</p>
                            <div className='h-[2px] bg-black transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100' />
                        </NavLink>
                        <NavLink to='/collection' className={({isActive}) => 
                            `flex flex-col items-center gap-1 transition-all duration-300 hover:-translate-y-0.5 
                            ${isActive ? "text-black font-semibold" : ""}`
                        }>
                            <p>COLLECTION</p>
                            <div className='h-[2px] bg-black transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100' />
                        </NavLink>
                        <NavLink to='/about' className={({isActive}) => 
                            `flex flex-col items-center gap-1 transition-all duration-300 hover:-translate-y-0.5 
                            ${isActive ? "text-black font-semibold" : ""}`
                        }>
                            <p>ABOUT</p>
                            <div className='h-[2px] bg-black transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100' />
                        </NavLink>
                        <NavLink to='/contact' className={({isActive}) => 
                            `flex flex-col items-center gap-1 transition-all duration-300 hover:-translate-y-0.5 
                            ${isActive ? "text-black font-semibold" : ""}`
                        }>
                            <p>CONTACT</p>
                            <div className='h-[2px] bg-black transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100' />
                        </NavLink>
                    </ul>
                    
                    <div className='flex items-center gap-6'>
                        <div className='relative group'>
                            <img 
                                onClick={() => {
                                    console.log("Search icon tapped"); // Debug log
                                    setShowSearch(true);
                                }} 
                                src={assets.search_icon} 
                                className='w-5 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-0.5' 
                                alt="Search Products" 
                            />
                        </div>
                        
                        {/* Profile section with authentication logic */}
                        <div className='relative group'>
                            {isLoggedIn ? (
                                <div className='relative'>
                                    <div 
                                        onClick={toggleProfileMenu} 
                                        className='flex items-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5'
                                    >
                                        <div className='w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 text-xs font-semibold uppercase
                                            transition-all duration-300 hover:shadow-md'>
                                            {username ? username.charAt(0) : "U"}
                                        </div>
                                    </div>
                                    
                                    {/* Profile dropdown */}
                                    {showProfileMenu && (
                                        <div className='absolute right-0 mt-2 z-50 min-w-40 animate-dropdownFade'>
                                            <div className='flex flex-col gap-1 px-5 py-3 text-gray-600 rounded shadow-lg bg-white border'>
                                                <div className='font-medium pb-2 border-b'>Hi, {username}!</div>
                                                <Link to='/profile' onClick={() => setShowProfileMenu(false)} className='py-2 hover:text-black transition-colors'>My Profile</Link>
                                                <Link to='/orders' onClick={() => setShowProfileMenu(false)} className='py-2 hover:text-black transition-colors'>Orders</Link>
                                                <Link to='/wishlist' onClick={() => setShowProfileMenu(false)} className='py-2 hover:text-black transition-colors'>Wishlist</Link>
                                                <button 
                                                    onClick={handleLogout} 
                                                    className='mt-2 py-2 text-left text-red-600 hover:text-red-700 transition-colors'
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to='/login'>
                                    <img 
                                        src={assets.profile_icon} 
                                        className='w-5 cursor-pointer transition-transform hover:scale-110' 
                                        alt="Login" 
                                    />
                                </Link>
                            )}
                        </div>
                        
                        {/* Cart with notification badge */}
                        <div 
                            onClick={openCartModal} 
                            className='relative group cursor-pointer'
                        >
                            <img 
                                src={assets.cart_icon} 
                                className='w-5 min-w-5 transition-transform group-hover:scale-110' 
                                alt="Cart" 
                            />
                            {getCartCount() > 0 && (
                                <div className='absolute -right-1.5 -top-1.5 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs font-medium group-hover:animate-pulse'>
                                    {getCartCount()}
                                </div>
                            )}
                        </div>
                        
                        {/* Mobile menu button */}
                        <div 
                            onClick={() => setVisible(true)} 
                            className='sm:hidden cursor-pointer p-1 rounded-md hover:bg-gray-100 transition-colors'
                        >
                            <img src={assets.menu_icon} className='w-5' alt="Menu Icon" />
                        </div>
                    </div>
                    
                    {/* Mobile sidebar menu */}
                    <div className={`fixed top-0 right-0 h-full z-50 overflow-hidden bg-white shadow-xl transition-all duration-300 ease-in-out ${visible ? 'w-64' : 'w-0'}`}>
                        <div className='flex flex-col h-full'>
                            <div className='p-4 border-b flex justify-between items-center'>
                                <h2 className='font-semibold'>Menu</h2>
                                <button onClick={() => setVisible(false)} className='p-1 rounded-full hover:bg-gray-100'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* User info in mobile menu */}
                            {isLoggedIn && (
                                <div className='p-4 border-b bg-gray-50'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 text-sm font-semibold uppercase'>
                                            {username ? username.charAt(0) : "U"}
                                        </div>
                                        <div>
                                            <p className='font-medium'>{username}</p>
                                            <p className='text-xs text-gray-500'>Welcome back!</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Mobile navigation links */}
                            <div className='flex flex-col py-2'>
                                <NavLink 
                                    onClick={() => setVisible(false)} 
                                    className={({isActive}) => 
                                        `py-3 px-4 border-b border-gray-100 ${isActive ? "bg-gray-50 font-medium" : ""}`
                                    } 
                                    to='/'
                                >
                                    HOME
                                </NavLink>
                                <NavLink 
                                    onClick={() => setVisible(false)} 
                                    className={({isActive}) => 
                                        `py-3 px-4 border-b border-gray-100 ${isActive ? "bg-gray-50 font-medium" : ""}`
                                    } 
                                    to='/collection'
                                >
                                    COLLECTION
                                </NavLink>
                                <NavLink 
                                    onClick={() => setVisible(false)} 
                                    className={({isActive}) => 
                                        `py-3 px-4 border-b border-gray-100 ${isActive ? "bg-gray-50 font-medium" : ""}`
                                    } 
                                    to='/about'
                                >
                                    ABOUT
                                </NavLink>
                                <NavLink 
                                    onClick={() => setVisible(false)} 
                                    className={({isActive}) => 
                                        `py-3 px-4 border-b border-gray-100 ${isActive ? "bg-gray-50 font-medium" : ""}`
                                    } 
                                    to='/contact'
                                >
                                    CONTACT
                                </NavLink>
                            </div>
                            
                            {/* Authentication links in mobile menu */}
                            <div className='mt-auto border-t'>
                                {isLoggedIn ? (
                                    <>
                                        <Link 
                                            to="/profile" 
                                            onClick={() => setVisible(false)}
                                            className='py-3 px-4 border-b border-gray-100 flex items-center gap-2'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            My Profile
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                handleLogout();
                                                setVisible(false);
                                            }}
                                            className='w-full text-left py-3 px-4 text-red-600 flex items-center gap-2'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                            </svg>
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link 
                                        to="/login" 
                                        onClick={() => setVisible(false)}
                                        className='py-3 px-4 flex items-center gap-2'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        Login / Sign Up
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Overlay for mobile menu */}
                    {visible && (
                        <div 
                            className="fixed inset-0 bg-black/30 z-40" 
                            onClick={() => setVisible(false)}
                        ></div>
                    )}
                </div>

                {/* Add this to apply hover effects on nav links */}
                <style jsx>{`
                    @keyframes dropdownFade {
                        from { opacity: 0; transform: translateY(-8px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-dropdownFade {
                        animation: dropdownFade 0.2s ease-out forwards;
                    }
                    .group:hover .scale-x-0 {
                        transform: scaleX(1);
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.2s ease-out forwards;
                    }
                `}</style>
            </div>

            {/* Cart Modal Portal */}
            <AnimatePresence>
                {isCartModalOpen && (
                    <CartModal 
                        isOpen={isCartModalOpen} 
                        onClose={() => setIsCartModalOpen(false)}
                    />
                )}
            </AnimatePresence>
            
            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/30" onClick={() => setShowLogoutModal(false)}></div>
                    <div className="relative bg-white rounded-lg px-8 py-6 shadow-xl animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-lg font-medium">Successfully logged out!</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default NavBar;