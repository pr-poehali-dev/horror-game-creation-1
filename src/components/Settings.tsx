import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { audioSystem } from '../utils/audioSystem';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [musicVolume, setMusicVolume] = useState([70]);
  const [sfxVolume, setSfxVolume] = useState([80]);
  const [fullscreen, setFullscreen] = useState(false);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="flex items-center justify-center h-screen bg-black/95 p-8">
      <Card className="w-full max-w-2xl p-8 bg-gradient-to-b from-gray-900 to-black border-2 border-gray-700">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-300 flex items-center gap-3">
            <Icon name="Settings" size={36} />
            Настройки
          </h2>
          <Button onClick={onClose} variant="outline" className="border-red-700">
            <Icon name="X" size={20} className="mr-2" />
            Закрыть
          </Button>
        </div>

        <div className="space-y-8">
          {/* Audio */}
          <div>
            <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              <Icon name="Volume2" size={24} />
              Звук
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-lg text-gray-300">Музыка</label>
                  <span className="text-purple-400 font-bold">{musicVolume[0]}%</span>
                </div>
                <Slider
                  value={musicVolume}
                  onValueChange={(value) => {
                    setMusicVolume(value);
                    audioSystem.setMusicVolume(value[0] / 100);
                  }}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-lg text-gray-300">Звуковые эффекты</label>
                  <span className="text-purple-400 font-bold">{sfxVolume[0]}%</span>
                </div>
                <Slider
                  value={sfxVolume}
                  onValueChange={(value) => {
                    setSfxVolume(value);
                    audioSystem.setSfxVolume(value[0] / 100);
                  }}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Display */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <Icon name="Monitor" size={24} />
              Дисплей
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded border border-gray-700">
                <div>
                  <p className="text-lg text-gray-300 font-bold">Полноэкранный режим</p>
                  <p className="text-sm text-gray-500">Развернуть игру на весь экран</p>
                </div>
                <Switch checked={fullscreen} onCheckedChange={setFullscreen} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded border border-gray-700">
                <div>
                  <p className="text-lg text-gray-300 font-bold">Анимации</p>
                  <p className="text-sm text-gray-500">Включить визуальные эффекты</p>
                </div>
                <Switch checked={animations} onCheckedChange={setAnimations} />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-red-950/30 border border-red-900 rounded">
            <p className="text-gray-400 text-center text-sm">
              ⚠️ Тёмный мир v1.0 | Хоррор-приключение в стиле Deltarune
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full h-14 text-xl bg-gradient-to-r from-purple-900 to-red-900 hover:from-purple-800 hover:to-red-800 border-2 border-purple-700"
          >
            Сохранить настройки
          </Button>
        </div>
      </Card>
    </div>
  );
}