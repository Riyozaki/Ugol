import React from 'react';
import { MapPin, Phone } from 'lucide-react';

// Simple TikTok Icon component since it might not be in standard Lucide imports
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-loft-black border-t border-loft-dark pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <div className="mb-6 border-b-2 border-loft-green pb-2 pr-10 inline-block">
                <span className="font-heading text-4xl tracking-widest text-loft-light">УГОЛ</span>
             </div>
             <p className="text-loft-gray max-w-xs font-light">
               Мужская территория. Строгий стиль, честные цены и атмосфера, в которую хочется возвращаться.
             </p>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-6">
             <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="p-3 bg-loft-dark rounded-full group-hover:bg-loft-green transition-colors">
                    <MapPin className="h-5 w-5 text-loft-gray group-hover:text-white" />
                </div>
                <span className="text-loft-gray font-mono text-sm">г. Псков</span>
             </div>
             <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="p-3 bg-loft-dark rounded-full group-hover:bg-loft-green transition-colors">
                    <Phone className="h-5 w-5 text-loft-gray group-hover:text-white" />
                </div>
                <a href="tel:+70000000000" className="text-loft-gray hover:text-loft-light transition-colors font-mono text-lg">+7 (000) 000-00-00</a>
             </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center">
            <h4 className="font-sub font-bold text-loft-light mb-6 uppercase text-sm tracking-wider">Следите за нами</h4>
            <a href="#" className="flex items-center space-x-2 text-loft-gray hover:text-loft-green-bright transition-colors bg-loft-dark p-4 rounded-full border border-loft-dark hover:border-loft-green shadow-lg">
              <TikTokIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-loft-dark pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-loft-gray/50 uppercase tracking-widest font-mono">
          <p>&copy; 2026 BARBERSHOP UGOL.</p>
          <p className="mt-2 md:mt-0">EST. 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;