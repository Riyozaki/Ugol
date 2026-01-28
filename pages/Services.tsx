import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { servicesList } from '../data';
import { ServiceItem } from '../types';

const ServiceCard: React.FC<{ service: ServiceItem; index: number }> = ({ service, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex flex-col justify-between p-6 bg-loft-dark border-b-2 border-transparent hover:border-loft-green transition-all duration-300 group h-full relative overflow-hidden shadow-sm"
  >
    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-loft-green/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-loft-green/20"></div>
    
    <div className="mb-4 relative z-10">
      <h3 className="font-heading text-2xl text-loft-light group-hover:text-loft-green-bright transition-colors uppercase tracking-wide mb-2">
        {service.title}
      </h3>
      {service.note && (
        <p className="text-loft-gray text-sm mb-3 italic font-light border-l-2 border-loft-gray/30 pl-2">{service.note}</p>
      )}
      <span className="text-xs font-mono text-loft-gray uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-loft-green"></span>
        {service.durationDisplay}
      </span>
    </div>
    <div className="mt-auto pt-6 flex justify-between items-end border-t border-loft-light/5">
       <span className="font-mono text-xl text-loft-light font-medium">{service.price} ₽</span>
    </div>
  </motion.div>
);

const Services: React.FC = () => {
  const basicServices = servicesList.filter(s => s.category === 'basic');
  const additionalServices = servicesList.filter(s => s.category === 'additional');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <div className="text-center mb-20">
        <h2 className="font-heading text-6xl md:text-8xl font-bold text-loft-light mb-6 uppercase tracking-tight">Прайс</h2>
        <p className="max-w-xl mx-auto text-loft-gray font-sub text-lg">
          Честные цены. Без скрытых доплат.
        </p>
      </div>

      <div className="mb-24">
        <h3 className="font-heading text-4xl text-loft-light mb-10 border-l-4 border-loft-green pl-6 uppercase tracking-wider">
          Основные
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {basicServices.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h3 className="font-heading text-4xl text-loft-light mb-10 border-l-4 border-loft-gray pl-6 uppercase tracking-wider">
          Дополнительно
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {additionalServices.map((service, index) => (
            <ServiceCard key={index} service={service} index={index + basicServices.length} />
          ))}
        </div>
      </div>

      <div className="mt-16 bg-loft-dark p-12 border-l-4 border-loft-green flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
         <div className="text-center md:text-left">
             <h3 className="font-heading text-3xl text-loft-light mb-2 uppercase tracking-wider">Готовы к обновлению?</h3>
             <p className="text-loft-gray font-light">Выберите услуги и мастера в нашем онлайн-календаре.</p>
         </div>
         <Link to="/booking" className="inline-block bg-loft-green hover:bg-loft-green-bright text-white px-10 py-4 rounded-sm font-heading text-xl uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(47,122,94,0.4)]">
            Записаться
         </Link>
      </div>
    </motion.div>
  );
};

export default Services;