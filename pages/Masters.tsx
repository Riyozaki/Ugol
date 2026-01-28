import React from 'react';
import { motion } from 'framer-motion';
import { mastersList } from '../data';

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
            <div className="aspect-[3/4] overflow-hidden bg-loft-dark border-2 border-transparent group-hover:border-loft-green transition-all duration-500">
              <img 
                src={master.image} 
                alt={master.name} 
                className="w-full h-full object-cover grayscale transition-all duration-700 scale-100 group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            {/* Note: We keep text-white here because it sits on a dark overlay regardless of theme */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-24">
              <h3 className="font-heading text-4xl text-white uppercase tracking-wide mb-1">{master.name}</h3>
              <p className="text-loft-green font-mono uppercase tracking-widest text-xs">{master.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Masters;