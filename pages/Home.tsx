import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Beer, ArrowDown } from 'lucide-react';

const ParallaxText = ({ children, baseVelocity = 100 }: { children?: React.ReactNode; baseVelocity?: number }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap opacity-10 select-none pointer-events-none absolute top-0 left-0 right-0 z-0">
      <motion.div 
        className="font-heading text-[10rem] md:text-[15rem] font-bold uppercase text-loft-light flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ 
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
      </motion.div>
    </div>
  );
};

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 500], [1, 1.1]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        {/* Parallax Background Image - Reliable URL */}
        <motion.div 
            style={{ y: y1, scale: scaleHero }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center z-0"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center">
            <motion.div 
              style={{ opacity: opacityHero }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 50 }}
            >
              <div className="inline-block border-2 border-loft-green px-4 py-1 mb-6 bg-black/30 backdrop-blur-sm">
                 <h2 className="text-loft-green-bright font-mono font-bold tracking-[0.2em] uppercase text-sm">
                    Est. 2026
                 </h2>
              </div>
              
              {/* Force text-white here because background is ALWAYS dark image */}
              <h1 className="font-heading text-9xl sm:text-[10rem] md:text-[12rem] font-bold text-white mb-4 leading-none tracking-tighter drop-shadow-2xl">
                УГОЛ
              </h1>
              
              <p className="text-2xl sm:text-3xl text-gray-200 font-sub font-bold uppercase tracking-widest mb-12 drop-shadow-md">
                Мужские <span className="text-loft-green">стрижки</span> & <span className="text-loft-green">бритье</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/booking" 
                  className="bg-loft-green hover:bg-loft-green-bright text-white font-heading py-4 px-12 text-xl tracking-widest transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(47,122,94,0.6)] rounded-sm"
                >
                  Записаться
                </Link>
                <Link 
                  to="/services" 
                  className="border-2 border-white/80 hover:border-loft-green hover:text-loft-green text-white font-heading py-4 px-12 text-xl tracking-widest transition-all rounded-sm backdrop-blur-sm hover:bg-white/10"
                >
                  Прайс-лист
                </Link>
              </div>
            </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 z-20 text-white/50 animate-bounce"
          style={{ opacity: opacityHero }}
        >
           <ArrowDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Features Teaser */}
      <section className="py-32 bg-loft-black relative overflow-hidden">
        
        {/* Background Parallax Marquee */}
        <div className="absolute top-0 w-full transform -translate-y-1/2">
             <ParallaxText>EST. 2026 • BARBERSHOP UGOL • EST. 2026 • BARBERSHOP UGOL • </ParallaxText>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
              <h2 className="font-heading text-6xl text-loft-light tracking-wide drop-shadow-sm">Почему <span className="text-loft-green">Мы</span></h2>
              <div className="w-24 h-1 bg-loft-green mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: ShieldCheck, title: "Мастера", desc: "Строгий отбор. Только лучшие профессионалы своего дела." },
               { icon: Zap, title: "Стиль", desc: "Классический лофт. Вековой кирпич и правильная музыка." },
               { icon: Beer, title: "Сервис", desc: "Бесплатные напитки, PS5 и честный разговор." }
             ].map((feature, idx) => (
               <motion.div 
                 key={idx} 
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.2, duration: 0.6 }}
                 className="bg-loft-dark p-10 border-b-2 border-transparent hover:border-loft-green transition-all duration-300 group shadow-lg hover:shadow-2xl transform hover:-translate-y-2"
               >
                 <div className="w-16 h-16 bg-loft-black rounded-full flex items-center justify-center mb-6 group-hover:bg-loft-green transition-colors duration-500 shadow-inner">
                    <feature.icon className="w-8 h-8 text-loft-gray group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                 </div>
                 <h3 className="font-heading text-2xl text-loft-light uppercase tracking-wider mb-4 group-hover:text-loft-green transition-colors">{feature.title}</h3>
                 <p className="text-loft-gray font-light leading-relaxed group-hover:text-loft-light/80 transition-colors">{feature.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;