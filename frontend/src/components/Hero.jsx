import React from 'react'
import { motion } from 'framer-motion'
import hero from '../assets/Hero.jpg'

const Hero = ({ title = "Discover Elegance", subtitle = "in Every Detail", ctaText = "SHOP NOW", image = hero }) => {
  return (
    <section className='relative flex flex-col sm:flex-row min-h-[80vh] overflow-hidden' aria-label="Hero Section">
        {/* Hero left side */}
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='flex items-center justify-center w-full z-10 py-16 sm:w-1/2 sm:py-0 bg-gradient-to-r from-white/90 to-white/70'
        >
            <div className='text-[#414141] space-y-6'>
                <div className='flex items-center gap-2 hover:gap-4 transition-all duration-300'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    <p className='text-sm font-medium md:text-base tracking-wider'>OUR BEST SELLERS</p>
                </div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className='text-4xl leading-relaxed sm:py-3 lg:text-6xl prata-regular'
                >
                    {title}<br/>
                    <span className='text-3xl lg:text-5xl text-gray-600'>{subtitle}</span>
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className='flex items-center gap-2 group cursor-pointer'
                    aria-label="Shop Now Button"
                >
                    <p className='text-sm font-semibold md:text-base group-hover:text-black transition-colors'>{ctaText}</p>
                    <div className='flex items-center gap-2 group-hover:gap-4 transition-all duration-300'>
                        <p className='w-8 md:w-11 h-[1px] bg-[#414141] group-hover:w-16 transition-all'></p>
                        <span className='group-hover:translate-x-2 transition-transform'>→</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
        {/* Hero right side */}
        <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className='absolute sm:relative w-full h-full sm:w-1/2'
        >
            <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:hidden'></div>
            <img 
                className='w-full h-full object-cover' 
                src={image} 
                alt="Elegant products displayed in the hero section" 
                loading="lazy"
            />
        </motion.div>
    </section>
  )
}

export default Hero