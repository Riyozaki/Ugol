export interface ServiceItem {
  id: string;
  title: string;
  price: number; // Changed to number for calculations
  duration: number; // Minutes
  durationDisplay: string;
  category: 'basic' | 'additional';
  note?: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}
