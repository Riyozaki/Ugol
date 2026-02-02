import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';
import { servicesList, mastersList } from '../data';
import { submitBookingToGoogleSheets, fetchExistingBookings, ExistingBooking, BookingData } from '../api';

const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [dateTime, setDateTime] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '' });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // New States for Logic
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [timeError, setTimeError] = useState<string | null>(null);

  // Load existing bookings on mount
  useEffect(() => {
    const loadBookings = async () => {
      const bookings = await fetchExistingBookings();
      setExistingBookings(bookings);
    };
    loadBookings();
  }, []);

  // Calculate totals
  const selectedServiceObjects = servicesList.filter(s => selectedServices.includes(s.id));
  const subtotal = selectedServiceObjects.reduce((acc, curr) => acc + curr.price, 0);
  const totalDuration = selectedServiceObjects.reduce((acc, curr) => acc + curr.duration, 0);
  
  const discount = appliedPromo === '$WAG' ? subtotal * 0.15 : 0;
  const finalPrice = subtotal - discount;

  // Find selected barber details
  const barberDetails = mastersList.find(b => b.id === selectedBarber);

  // Time Validation Logic
  const validateTime = (dt: string): boolean => {
    setTimeError(null);
    if (!dt) return false;

    const selectedDate = new Date(dt);
    const now = new Date();

    // 1. Check if in the past
    if (selectedDate < now) {
      setTimeError('Нельзя записаться на прошедшее время');
      return false;
    }

    // 2. Check Business Hours (10:00 - 22:00)
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    
    // Преобразуем в минуты от начала дня для удобства
    const startOfDayMinutes = hours * 60 + minutes;
    const shopOpenMinutes = 10 * 60; // 10:00
    const shopCloseMinutes = 22 * 60; // 22:00
    
    // Время окончания процедуры
    const endOfDayMinutes = startOfDayMinutes + totalDuration;

    if (startOfDayMinutes < shopOpenMinutes || endOfDayMinutes > shopCloseMinutes) {
      setTimeError('Мы работаем с 10:00 до 22:00. Услуга должна быть завершена до закрытия.');
      return false;
    }

    // 3. Check Overlaps with existing bookings
    if (selectedBarber && existingBookings.length > 0) {
      const selectedStart = selectedDate.getTime();
      const selectedEnd = selectedStart + totalDuration * 60000;

      // Получаем имя мастера (в базе оно может быть полным именем)
      const barberName = mastersList.find(b => b.id === selectedBarber)?.name;

      const hasOverlap = existingBookings.some(booking => {
        // Проверяем только для выбранного мастера
        if (booking.master !== barberName) return false;

        const bookedStart = booking.startDateTime.getTime();
        // Используем bufferEndDateTime, так как следующий клиент не может начать, 
        // пока не пройдет 30 мин после окончания предыдущего
        const bookedBufferEnd = booking.bufferEndDateTime.getTime();

        // Логика пересечения:
        // (Новое начало < Конец старого+буфер) И (Новый конец > Начало старого)
        // Но с учетом требования "не раньше чем предположительно закончит клиент прошлый + 30мин":
        // Это значит, если наш старт попадает в интервал [start, end + 30min] существующей записи.
        
        return (selectedStart < bookedBufferEnd && selectedEnd > bookedStart);
      });

      if (hasOverlap) {
        setTimeError('Это время уже занято или мастер на перерыве (30 мин после клиента).');
        return false;
      }
    }

    return true;
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(e.target.value);
    validateTime(e.target.value);
  };

  const handleServiceToggle = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(sId => sId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === '$WAG') {
      setAppliedPromo('$WAG');
    } else {
      setAppliedPromo(null);
      alert('Неверный промокод');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTime(dateTime)) {
      setStep(3); // Вернуть на шаг выбора времени
      return;
    }

    setIsSubmitting(true);

    const dateObj = new Date(dateTime);
    const dateStr = dateObj.toISOString().split('T')[0];
    const timeStr = dateObj.toTimeString().split(' ')[0].substring(0, 5);

    // Подготовка списка услуг в формате объектов, как требуется бэкендом
    const servicesForApi = selectedServiceObjects.map(s => ({
        title: s.title,
        price: s.price,
        duration: s.duration
    }));

    const bookingData: BookingData = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      clientName: contact.name,
      clientPhone: contact.phone,
      services: servicesForApi, // Теперь массив объектов
      servicesCount: selectedServices.length,
      masterName: barberDetails?.name || 'Любой', // Новое имя поля
      masterRole: barberDetails?.role || '',     // Новое имя поля
      appointmentDate: dateStr,                  // Новое имя поля
      appointmentTime: timeStr,                  // Новое имя поля
      duration: totalDuration,
      totalPrice: finalPrice,
      comment: appliedPromo ? `Промокод: ${appliedPromo}` : '',
      status: 'Новый'
    };

    const success = await submitBookingToGoogleSheets(bookingData);

    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
    } else {
      alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или позвоните нам.');
    }
  };

  const nextStep = () => {
    if (step === 3) {
      if (!validateTime(dateTime)) return;
    }
    setStep(step + 1);
  };
  
  const prevStep = () => setStep(step - 1);

  if (isSuccess) {
    return (
       <div className="min-h-[60vh] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-loft-dark p-10 border border-loft-green text-center max-w-md w-full relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-loft-green shadow-[0_0_10px_#2F7A5E]"></div>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-loft-black border-2 border-loft-green text-loft-green mb-6 shadow-[0_0_15px_rgba(47,122,94,0.3)]">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="font-heading text-4xl text-loft-light mb-2 tracking-wider">Успешно</h2>
            <p className="text-loft-gray mb-8">Ваша запись подтверждена. Мастер ожидает вас в назначенное время.</p>
            <button onClick={() => window.location.reload()} className="text-loft-green hover:text-loft-light underline font-mono text-sm uppercase">Записаться еще раз</button>
          </motion.div>
       </div>
    );
  }

  // Format date for display
  const formatDate = (dt: string) => {
      if (!dt) return '';
      const date = new Date(dt);
      return date.toLocaleString('ru-RU', { 
          day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
      });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="font-heading text-5xl font-bold text-loft-light mb-4 uppercase">Запись</h2>
        {/* Progress Bar */}
        <div className="flex justify-center items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`h-1 w-12 rounded-sm transition-colors duration-300 ${step >= s ? 'bg-loft-green shadow-[0_0_5px_#2F7A5E]' : 'bg-loft-dark'}`} />
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <h3 className="font-sub text-2xl text-loft-light font-bold mb-6">1. Выберите услуги</h3>
                        <div className="space-y-3">
                            {servicesList.map(service => (
                                <div 
                                    key={service.id}
                                    onClick={() => handleServiceToggle(service.id)}
                                    className={`p-4 border-2 cursor-pointer transition-all flex justify-between items-center group ${selectedServices.includes(service.id) ? 'bg-loft-dark border-loft-green' : 'bg-loft-black border-loft-dark hover:border-loft-gray'}`}
                                >
                                    <div>
                                        <p className="font-heading text-lg text-loft-light uppercase tracking-wide">{service.title}</p>
                                        <p className="text-xs text-loft-gray font-mono">{service.durationDisplay}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-mono font-bold ${selectedServices.includes(service.id) ? 'text-loft-green-bright' : 'text-loft-gray'}`}>{service.price} ₽</span>
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selectedServices.includes(service.id) ? 'bg-loft-green border-loft-green' : 'border-loft-gray'}`}>
                                            {selectedServices.includes(service.id) && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <h3 className="font-sub text-2xl text-loft-light font-bold mb-6">2. Выберите мастера</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {mastersList.map(barber => (
                                <div 
                                    key={barber.id}
                                    onClick={() => setSelectedBarber(barber.id)}
                                    className={`relative overflow-hidden cursor-pointer border-2 transition-all ${selectedBarber === barber.id ? 'border-loft-green' : 'border-transparent'}`}
                                >
                                    <img src={barber.image} alt={barber.name} className="w-full h-64 object-cover grayscale" />
                                    <div className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent ${selectedBarber === barber.id ? 'border-t-2 border-loft-green' : ''}`}>
                                        <h4 className="font-heading text-2xl text-white uppercase">{barber.name}</h4>
                                        <p className="text-xs text-loft-green font-bold uppercase tracking-widest">{barber.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                     <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                         <h3 className="font-sub text-2xl text-loft-light font-bold mb-6">3. Дата и время</h3>
                         <div className={`bg-loft-dark p-6 border-l-4 shadow-lg transition-colors ${timeError ? 'border-red-500' : 'border-loft-green'}`}>
                             <label className="block text-loft-gray text-sm uppercase tracking-widest mb-2">Выберите время</label>
                             <input 
                                type="datetime-local" 
                                className="w-full bg-loft-black border border-loft-gray/20 text-loft-light p-4 font-mono focus:border-loft-green outline-none"
                                value={dateTime}
                                onChange={handleDateTimeChange}
                             />
                             <AnimatePresence>
                               {timeError && (
                                 <motion.div 
                                   initial={{ opacity: 0, height: 0 }} 
                                   animate={{ opacity: 1, height: 'auto' }} 
                                   exit={{ opacity: 0, height: 0 }}
                                   className="flex items-start gap-2 mt-4 text-red-400 text-sm font-bold"
                                 >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{timeError}</span>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                             <p className="mt-4 text-sm text-loft-gray/70 border-t border-loft-gray/10 pt-2">
                                <span className="block mb-1">• Мы работаем с 10:00 до 22:00</span>
                                <span className="block">• Технический перерыв между клиентами: 30 мин</span>
                             </p>
                         </div>
                     </motion.div>
                )}

                {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <h3 className="font-sub text-2xl text-loft-light font-bold mb-6">4. Контакты</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" placeholder="Ваше имя" 
                                className="w-full bg-loft-dark border-b-2 border-loft-dark focus:border-loft-green text-loft-light p-4 outline-none transition-colors placeholder-loft-gray/50 font-sub"
                                required
                                value={contact.name}
                                onChange={e => setContact({...contact, name: e.target.value})}
                                disabled={isSubmitting}
                            />
                            <input 
                                type="tel" placeholder="Телефон" 
                                className="w-full bg-loft-dark border-b-2 border-loft-dark focus:border-loft-green text-loft-light p-4 outline-none transition-colors placeholder-loft-gray/50 font-sub"
                                required
                                value={contact.phone}
                                onChange={e => setContact({...contact, phone: e.target.value})}
                                disabled={isSubmitting}
                            />
                            
                            <div className="mt-8 flex gap-2">
                                <input 
                                    type="text" placeholder="Промокод" 
                                    className="flex-grow bg-loft-black border border-loft-dark text-loft-light p-3 font-mono uppercase text-sm focus:border-loft-green outline-none"
                                    value={promoCode}
                                    onChange={e => setPromoCode(e.target.value)}
                                    disabled={isSubmitting}
                                />
                                <button type="button" onClick={handleApplyPromo} disabled={isSubmitting} className="px-4 border border-loft-green text-loft-green hover:bg-loft-green hover:text-white uppercase text-xs font-bold tracking-wider transition-colors disabled:opacity-50">
                                    Применить
                                </button>
                            </div>
                            {appliedPromo && <p className="text-loft-green-bright text-xs uppercase tracking-wider mt-1">Промокод {appliedPromo} применен!</p>}
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
                {step > 1 ? (
                    <button onClick={prevStep} disabled={isSubmitting} className="flex items-center text-loft-gray hover:text-loft-light uppercase font-bold tracking-widest text-sm disabled:opacity-50">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Назад
                    </button>
                ) : <div></div>}
                
                {step < 4 ? (
                    <button 
                        onClick={nextStep} 
                        disabled={(step === 1 && selectedServices.length === 0) || (step === 3 && !!timeError) || (step === 3 && !dateTime)}
                        className="bg-loft-green disabled:bg-loft-dark disabled:text-loft-gray hover:bg-loft-green-bright text-white px-8 py-3 font-heading text-lg tracking-widest transition-all shadow-lg disabled:shadow-none"
                    >
                        Далее
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={!contact.name || !contact.phone || isSubmitting}
                        className="bg-loft-light hover:bg-loft-gray text-loft-black px-8 py-3 font-heading text-lg tracking-widest transition-all shadow-lg shadow-loft-light/10 disabled:opacity-70 flex items-center justify-center min-w-[200px]"
                    >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Оформляем...
                          </>
                        ) : (
                          'Подтвердить'
                        )}
                    </button>
                )}
            </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 bg-loft-dark p-6 border-t-4 border-loft-green shadow-2xl transition-colors duration-300">
                <h4 className="font-heading text-2xl text-loft-light uppercase mb-6 tracking-wider">Ваш заказ</h4>
                
                <div className="space-y-6">
                    {/* Services */}
                    <div>
                        <h5 className="text-xs uppercase tracking-widest text-loft-gray mb-3 border-b border-loft-gray/10 pb-1">Услуги</h5>
                        {selectedServices.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedServiceObjects.map(s => (
                                    <li key={s.id} className="flex justify-between text-sm">
                                        <span className="text-loft-light w-2/3">{s.title}</span>
                                        <span className="text-loft-green font-mono">{s.price} ₽</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-loft-gray text-sm italic">Выберите услуги...</p>
                        )}
                    </div>

                    {/* Barber */}
                    {(selectedBarber || step >= 2) && (
                        <div>
                             <h5 className="text-xs uppercase tracking-widest text-loft-gray mb-3 border-b border-loft-gray/10 pb-1">Мастер</h5>
                             {barberDetails ? (
                                 <div className="flex items-center space-x-3">
                                     <img src={barberDetails.image} alt={barberDetails.name} className="w-10 h-10 rounded-full object-cover border border-loft-gray/30" />
                                     <div>
                                         <p className="text-sm text-loft-light font-bold uppercase">{barberDetails.name}</p>
                                         <p className="text-xs text-loft-gray">{barberDetails.role}</p>
                                     </div>
                                 </div>
                             ) : (
                                 <p className="text-loft-gray text-sm italic">Не выбран</p>
                             )}
                        </div>
                    )}

                    {/* Date & Time */}
                    {(dateTime || step >= 3) && (
                        <div>
                             <h5 className="text-xs uppercase tracking-widest text-loft-gray mb-3 border-b border-loft-gray/10 pb-1">Дата и время</h5>
                             {dateTime ? (
                                 <div>
                                   <p className={`text-sm font-mono capitalize ${timeError ? 'text-red-400' : 'text-loft-light'}`}>
                                       {formatDate(dateTime)}
                                   </p>
                                   {timeError && <p className="text-xs text-red-500 mt-1">{timeError}</p>}
                                 </div>
                             ) : (
                                 <p className="text-loft-gray text-sm italic">Не выбрано</p>
                             )}
                        </div>
                    )}

                    {/* Contact */}
                    {((contact.name || contact.phone) || step >= 4) && (
                        <div>
                             <h5 className="text-xs uppercase tracking-widest text-loft-gray mb-3 border-b border-loft-gray/10 pb-1">Клиент</h5>
                             {contact.name || contact.phone ? (
                                 <div className="space-y-1">
                                     {contact.name && <p className="text-sm text-loft-light">{contact.name}</p>}
                                     {contact.phone && <p className="text-sm text-loft-gray font-mono">{contact.phone}</p>}
                                 </div>
                             ) : (
                                 <p className="text-loft-gray text-sm italic">Не заполнено</p>
                             )}
                        </div>
                    )}
                </div>

                <div className="border-t border-loft-gray/20 pt-4 mt-6 space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-loft-gray">
                        <span>Длительность</span>
                        <span>{Math.floor(totalDuration / 60) > 0 ? `${Math.floor(totalDuration / 60)} ч ` : ''}{totalDuration % 60 > 0 ? `${totalDuration % 60} мин` : ''}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-sm text-loft-green-bright font-mono">
                            <span>Скидка</span>
                            <span>- {discount.toFixed(0)} ₽</span>
                        </div>
                    )}
                    <div className="flex justify-between text-xl font-heading text-loft-light pt-2 border-t border-loft-gray/20 mt-2">
                        <span>Итого</span>
                        <span>{finalPrice.toFixed(0)} ₽</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;