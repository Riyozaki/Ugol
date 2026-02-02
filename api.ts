
export interface ServiceDTO {
  title: string;
  price: number;
  duration: number;
}

export interface BookingData {
  id: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  services: ServiceDTO[]; // Теперь массив объектов
  servicesCount: number;
  masterName: string;     // Было master
  masterRole: string;     // Было role
  appointmentDate: string;// Было date
  appointmentTime: string;// Было time
  duration: number;
  totalPrice: number;
  comment: string;
  status: string;
}

export interface ExistingBooking {
  master: string;
  startDateTime: Date;
  endDateTime: Date; // Includes duration
  bufferEndDateTime: Date; // End + 30 min
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztAyZpcjixP0X92_P_wOjj8nL7CpmFVYGMRAioiZLoLF8RlT43KRnjMDWrGGgOvFab/exec";

// Отправка новой записи
export const submitBookingToGoogleSheets = async (data: BookingData): Promise<boolean> => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      credentials: 'omit',
      redirect: 'follow',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return true;
  } catch (error) {
    console.error("Error submitting booking:", error);
    return false;
  }
};

// Получение существующих записей (для проверки занятости)
export const fetchExistingBookings = async (): Promise<ExistingBooking[]> => {
  try {
    // Добавлен параметр action=getBookings
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getBookings&t=${Date.now()}`, {
        method: 'GET',
        credentials: 'omit',
        redirect: 'follow'
    });
    
    if (!response.ok) {
        console.warn(`Failed to fetch bookings. Status: ${response.status}`);
        return [];
    }
    
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.warn("Response is not valid JSON:", text.substring(0, 50));
        return [];
    }
    
    // Handle if script returns array directly or wrapped in object
    let items = [];
    if (Array.isArray(data)) {
        items = data;
    } else if (data && Array.isArray(data.bookings)) {
        items = data.bookings;
    } else {
        return [];
    }
    
    return items.map((item: any) => {
      // Поддержка различных вариантов ключей, которые может вернуть скрипт
      // appointmentDate/Time - новые ключи, 'Дата записи' - старые из таблицы
      const dateStr = item.appointmentDate || item.date || item['Дата записи']; 
      const timeStr = item.appointmentTime || item.time || item['Время записи'];
      const duration = parseInt(item.duration || item['Длительность']) || 0;
      const master = item.masterName || item.master || item['Мастер'];

      if (!dateStr || !timeStr) return null;

      const startDateTime = new Date(`${dateStr}T${timeStr}`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
      const bufferEndDateTime = new Date(endDateTime.getTime() + 30 * 60000); // + 30 минут буфер

      return {
        master: master || '',
        startDateTime,
        endDateTime,
        bufferEndDateTime
      };
    }).filter((item: any) => item !== null) as ExistingBooking[];
    
  } catch (error) {
    console.warn("Could not fetch bookings:", error);
    return [];
  }
};
