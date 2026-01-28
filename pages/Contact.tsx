import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <div className="text-center mb-16">
        <h2 className="font-heading text-5xl font-bold text-loft-light mb-4 uppercase">Контакты</h2>
        <div className="h-1 w-24 bg-loft-green mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="bg-loft-dark p-3 border border-loft-dark text-loft-green shadow-[0_0_10px_rgba(47,122,94,0.2)]">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-loft-light uppercase mb-2">Адрес</h3>
              <p className="text-loft-gray">г. Псков</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-loft-dark p-3 border border-loft-dark text-loft-green shadow-[0_0_10px_rgba(47,122,94,0.2)]">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-loft-light uppercase mb-2">Телефон</h3>
              <p className="text-loft-gray text-lg font-mono">+7 (000) 000-00-00</p>
              <p className="text-loft-gray/50 text-sm mt-1">Звонки принимаем с 10:00 до 22:00</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
             <div className="bg-loft-dark p-3 border border-loft-dark text-loft-green shadow-[0_0_10px_rgba(47,122,94,0.2)]">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-loft-light uppercase mb-2">Email</h3>
              <p className="text-loft-gray">info@ugol-barber.ru</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
             <div className="bg-loft-dark p-3 border border-loft-dark text-loft-green shadow-[0_0_10px_rgba(47,122,94,0.2)]">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-loft-light uppercase mb-2">Режим работы</h3>
              <p className="text-loft-gray">Ежедневно: 10:00 - 22:00</p>
              <p className="text-loft-gray font-mono text-sm text-loft-green">Без выходных</p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-96 w-full bg-loft-dark border-2 border-loft-dark hover:border-loft-green transition-colors relative group overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center z-10">
             <span className="text-loft-gray font-heading text-2xl uppercase tracking-widest bg-loft-black/80 px-4 py-2">Карта загружается...</span>
          </div>
          {/* Simulate map view */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale group-hover:opacity-40 transition-all duration-700"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;