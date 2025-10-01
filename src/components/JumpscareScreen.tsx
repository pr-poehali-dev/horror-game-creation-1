import { useEffect, useState } from 'react';

interface JumpscareScreenProps {
  enemyName: string;
  onFinish: () => void;
}

const enemyScreamers: { [key: string]: string } = {
  'Призрак алтаря': '/img/de82d95b-1cac-4518-98ed-f06325e7b1fa.jpg',
  'Восставший мертвец': '/img/eca8cf20-237e-49a9-af73-3cc0382ccbfc.jpg'
};

export default function JumpscareScreen({ enemyName, onFinish }: JumpscareScreenProps) {
  const [audioPlayed, setAudioPlayed] = useState(false);
  
  const screamerImage = enemyScreamers[enemyName] || enemyScreamers['Призрак алтаря'];

  useEffect(() => {
    if (!audioPlayed) {
      try {
        const audio = new Audio();
        audio.volume = 0.8;
        audio.play().catch(() => {});
        setAudioPlayed(true);
      } catch (e) {
        console.log('Audio failed');
      }
    }

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [audioPlayed, onFinish]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black animate-fade-in">
      <div className="w-full h-full relative overflow-hidden">
        <img
          src={screamerImage}
          alt="SCREAMER"
          className="w-full h-full object-cover animate-pulse"
          style={{
            animation: 'glitch 0.1s infinite, shake 0.1s infinite'
          }}
        />
        
        <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply animate-pulse"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-9xl font-bold text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,1)] glitch animate-pulse">
            ТЫ УМЕР
          </h1>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
