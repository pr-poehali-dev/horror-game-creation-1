import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { audioSystem } from '../utils/audioSystem';

interface DialogSystemProps {
  npcName: string;
  dialog: string[];
  onDialogEnd: () => void;
}

export default function DialogSystem({ npcName, dialog, onDialogEnd }: DialogSystemProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    
    const text = dialog[currentIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.substring(0, charIndex + 1));
        audioSystem.playSoundEffect('dialog');
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentIndex, dialog]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(dialog[currentIndex]);
      setIsTyping(false);
    } else if (currentIndex < dialog.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onDialogEnd();
    }
  };

  return (
    <div className="flex items-end justify-center h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-8">
      <Card className="w-full max-w-4xl p-8 bg-black/90 border-2 border-purple-900 mb-12">
        <div className="flex items-start gap-6 mb-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center border-2 border-purple-700">
              <Icon name="Ghost" size={48} className="text-purple-400" />
            </div>
            <p className="text-purple-400 font-bold text-lg">{npcName}</p>
          </div>

          <div className="flex-1">
            <Card className="p-6 bg-gray-900/70 border border-purple-800 min-h-[150px] relative">
              <p className="text-white text-2xl leading-relaxed">
                {displayedText}
                {isTyping && <span className="animate-pulse">▌</span>}
              </p>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            className="bg-purple-900/50 hover:bg-purple-800/70 border-2 border-purple-700 text-xl px-8 py-6"
          >
            {isTyping ? (
              <>
                <Icon name="FastForward" size={20} className="mr-2" />
                Пропустить
              </>
            ) : currentIndex < dialog.length - 1 ? (
              <>
                <Icon name="ArrowRight" size={20} className="mr-2" />
                Далее
              </>
            ) : (
              <>
                <Icon name="Check" size={20} className="mr-2" />
                Закончить
              </>
            )}
          </Button>
        </div>

        <p className="text-gray-600 text-sm mt-4 text-center">
          {currentIndex + 1} / {dialog.length}
        </p>
      </Card>
    </div>
  );
}