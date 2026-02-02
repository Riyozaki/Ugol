import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Scissors } from 'lucide-react';
import { mastersList } from '../data';
import { Barber } from '../types';

// Helper component to handle image state logic
const MasterImage: React.FC<{ master: Barber }> = ({ master }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    // Fallback UI if the local image is missing
    return (
      <div className="w-full h-full bg-loft-dark flex flex-col items-center justify-center p-6 border-2 border-loft-dark group-hover:border-loft-green transition-colors duration-500">
        <div className="w-20 h-20 rounded-full bg-loft-black border border-loft-gray/20 flex items-center justify-center mb-4 shadow-inner">
          <User className="w-10 h-10 text-loft-gray" />
        </div>
        <p className="text-loft-gray text-xs font-mono uppercase text-center tracking-widest">
          Фото загружается...
        </p>
        {/* Hidden debug info for the developer */}
        <span className="hidden">{master.image}</span>
      </div>
    );
  }

  return (
    <img 
      src={master.image} 
      alt={master.name} 
      className="w-full h-full object-cover grayscale transition-all duration-700 scale-100 group-hover:scale-105 group-hover:grayscale-0"
      onError={() => setImgError(true)}
    />
  );
};

const Masters: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <div className="text-center mb-16">
        <h2 className="font-heading text-5xl font-bold text-loft-light mb-4 uppercase">Команда</h2>
        <div className="h-1 w-24 bg-loft-green mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {mastersList.map((master, index) => (
          <motion.div
            key={master.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="group relative"
          >
            <div className="aspect-[3/4] overflow-hidden bg-loft-dark border-2 border-transparent group-hover:border-loft-green transition-all duration-500 relative">
               <MasterImage master={master} />
            </div>
            
            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-24">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-heading text-4xl text-white uppercase tracking-wide mb-1">{master.name}</h3>
                <div className="flex items-center space-x-2">
                   <Scissors className="w-3 h-3 text-loft-green" />
                   <p className="text-loft-green font-mono uppercase tracking-widest text-xs">{master.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Masters;