import { ServiceItem, Barber } from './types';

export const servicesList: ServiceItem[] = [
  // Basic Services
  { id: '1', title: 'Стрижка мужская', price: 1300, duration: 60, durationDisplay: '1 ч', category: 'basic' },
  { id: '2', title: 'Стрижка машинкой', price: 700, duration: 30, durationDisplay: '30 мин', category: 'basic', note: 'одна-две насадки' },
  { id: '3', title: 'Моделирование бороды', price: 900, duration: 45, durationDisplay: '45 мин', category: 'basic' },
  { id: '4', title: 'Бритье шейвером', price: 700, duration: 30, durationDisplay: '30 мин', category: 'basic' },
  { id: '5', title: 'Опасное бритье', price: 900, duration: 45, durationDisplay: '45 мин', category: 'basic' },
  
  // Additional Services
  { id: '6', title: 'Камуфляж седины', price: 800, duration: 30, durationDisplay: '30 мин', category: 'additional' },
  { id: '7', title: 'Воск (Одна зона)', price: 250, duration: 10, durationDisplay: '10 мин', category: 'additional' },
  { id: '8', title: 'Черная маска', price: 600, duration: 30, durationDisplay: '30 мин', category: 'additional' },
  { id: '9', title: 'Спа для лица', price: 800, duration: 30, durationDisplay: '30 мин', category: 'additional' },
  { id: '10', title: 'Мытье и укладка волос', price: 250, duration: 15, durationDisplay: '15 мин', category: 'additional' },
];

export const mastersList: Barber[] = [
  { 
    id: '1', 
    name: 'Артем', 
    role: 'Топ-Барбер', 
    // Using direct path to avoid module import errors in browser-native environments.
    // If this fails, the Masters component will show a fallback.
    image: '/src/photo/artem.jpg' 
  },
];