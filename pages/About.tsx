import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-loft-gray"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-loft-gray"></div>
          <img 
            src="https://images.unsplash.com/photo-1600948836101-f60c27171194?q=80&w=1000&auto=format&fit=crop" 
            alt="Interior" 
            className="w-full h-auto rounded-sm shadow-2xl grayscale"
          />
        </div>

        <div>
          <h2 className="font-heading text-5xl font-bold text-loft-light mb-6 uppercase">История "Угла"</h2>
          <p className="text-loft-gray text-lg mb-6 leading-relaxed">
            Мы открылись в 2026 году с простой идеей: создать место, где мужчинам будет комфортно. Не просто парикмахерская, а клуб по интересам. Место силы.
          </p>
          <p className="text-loft-gray text-lg mb-6 leading-relaxed">
            Название "Угол" символизирует наше расположение в историческом здании на пересечении улиц, а также тот самый "свой угол", где можно скрыться от городской суеты, выпить виски и привести себя в порядок.
          </p>
          <p className="text-loft-gray text-lg mb-8 leading-relaxed">
            Интерьер выполнен в стиле классического лофта: вековой кирпич, натуральное дерево, металл и кожа. Никакого лишнего глянца. Только хардкор и стиль.
          </p>
          
          {/* Stats removed as requested */}
        </div>
      </div>
    </motion.div>
  );
};

export default About;