import React from 'react';
import { motion } from 'framer-motion';

// Curated list of high-quality, working Unsplash images for barbershop context
const photos = [
  "https://images.unsplash.com/photo-1599351431202-0e671379f1a9?q=80&w=800&auto=format&fit=crop", // Barber cutting hair
  "https://images.unsplash.com/photo-1503951914875-befbb7135952?q=80&w=800&auto=format&fit=crop", // Tools
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop", // Chair
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop", // Beard trim
  "https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=800&auto=format&fit=crop", // Interior detail
  "https://images.unsplash.com/photo-1593702275220-292996998196?q=80&w=800&auto=format&fit=crop"  // Barber pole
];

const Gallery: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="font-heading text-5xl font-bold text-loft-light mb-4 uppercase">Интерьер & Работы</h2>
        <div className="h-1 w-24 bg-loft-green mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="aspect-square overflow-hidden rounded-sm bg-loft-dark border border-loft-gray/20 relative group"
          >
            <img 
              src={src} 
              alt={`Gallery ${index}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0 opacity-90 group-hover:opacity-100"
              onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Gallery;