import { useState, useEffect } from 'react';

const horrorImages = [
  '👁️',
  '💀',
  '🩸',
  '👻',
  '🕷️'
];

const horrorMessages = [
  'ОНИ НАБЛЮДАЮТ',
  'НЕ ОБОРАЧИВАЙСЯ',
  'ТЫ НЕ ОДИН',
  'БЕГИ',
  'СЛИШКОМ ПОЗДНО'
];

export default function SubliminalFrame() {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const checkInterval = setInterval(() => {
      const random = Math.random();
      // 0.001% chance (1 in 100,000)
      if (random < 0.00001) {
        const isImage = Math.random() > 0.5;
        if (isImage) {
          setContent(horrorImages[Math.floor(Math.random() * horrorImages.length)]);
        } else {
          setContent(horrorMessages[Math.floor(Math.random() * horrorMessages.length)]);
        }
        setShow(true);
        
        // Show for 50ms (subliminal)
        setTimeout(() => {
          setShow(false);
        }, 50);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(checkInterval);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none bg-black/90">
      <div className="text-red-600 font-bold text-9xl glitch animate-pulse drop-shadow-[0_0_50px_rgba(220,38,38,1)]">
        {content}
      </div>
    </div>
  );
}
