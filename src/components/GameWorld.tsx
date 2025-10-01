import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { audioSystem } from '../utils/audioSystem';
import type { PlayerData, Enemy } from '../App';

interface GameWorldProps {
  player: PlayerData;
  onBattle: (enemy: Enemy) => void;
  onDialog: (npcName: string, dialog: string[]) => void;
  onInventory: () => void;
  onSave: () => void;
  onMenu: () => void;
}

const locations = {
  dark_forest: {
    name: 'Тёмный лес',
    description: 'Деревья окутаны мраком. Слышны странные звуки из глубины леса.',
    objects: ['Старое дерево', 'Разбитый фонарь', 'Странный алтарь'],
    npcs: ['Загадочная тень']
  },
  abandoned_house: {
    name: 'Заброшенный дом',
    description: 'Ветхое строение с разбитыми окнами. Дверь скрипит на ветру.',
    objects: ['Запертая дверь', 'Окно', 'Подвал'],
    npcs: []
  },
  cemetery: {
    name: 'Кладбище',
    description: 'Древние надгробия покрыты мхом. Туман стелется по земле.',
    objects: ['Склеп', 'Старая часовня', 'Свежая могила'],
    npcs: ['Хранитель могил']
  }
};

export default function GameWorld({ player, onBattle, onDialog, onInventory, onSave, onMenu }: GameWorldProps) {
  const [currentLocation, setCurrentLocation] = useState<keyof typeof locations>('dark_forest');
  const [message, setMessage] = useState('');

  useEffect(() => {
    audioSystem.playBackgroundMusic('exploration');
    return () => audioSystem.stopBackgroundMusic();
  }, []);

  const location = locations[currentLocation];

  const handleObjectInteraction = (obj: string) => {
    if (obj === 'Странный алтарь') {
      const enemy: Enemy = {
        name: 'Призрак алтаря',
        hp: 80,
        maxHp: 80,
        attack: 15,
        defense: 5
      };
      onBattle(enemy);
    } else if (obj === 'Старое дерево') {
      setMessage('Вы нашли зелье здоровья в дупле дерева!');
      setTimeout(() => setMessage(''), 3000);
    } else if (obj === 'Свежая могила') {
      const enemy: Enemy = {
        name: 'Восставший мертвец',
        hp: 100,
        maxHp: 100,
        attack: 20,
        defense: 8
      };
      onBattle(enemy);
    } else {
      setMessage(`Вы осматриваете: ${obj}. Ничего интересного...`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleNpcInteraction = (npc: string) => {
    if (npc === 'Загадочная тень') {
      onDialog('Загадочная тень', [
        'Ты не должен был сюда приходить...',
        'Здесь таится древнее зло.',
        'Беги, пока не поздно...',
        'Или останься и присоединись к нам...'
      ]);
    } else if (npc === 'Хранитель могил') {
      onDialog('Хранитель могил', [
        'Добро пожаловать на кладбище забытых душ.',
        'Что привело тебя в эти мрачные земли?',
        'Будь осторожен. Не все мертвецы покоятся с миром.'
      ]);
    }
  };

  const changeLocation = (newLocation: keyof typeof locations) => {
    setCurrentLocation(newLocation);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f1a] text-white p-4">
      {/* HUD */}
      <div className="flex justify-between items-center mb-4 bg-black/50 p-4 rounded-lg border border-red-900/30">
        <div className="space-y-1">
          <p className="text-xl">{player.name} | Уровень {player.level}</p>
          <div className="flex items-center gap-2">
            <Icon name="Heart" size={20} className="text-red-500" />
            <div className="w-48 h-4 bg-gray-800 rounded-full overflow-hidden border border-red-900">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm">{player.hp}/{player.maxHp}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onInventory} variant="outline" size="sm" className="border-purple-700">
            <Icon name="Backpack" size={18} className="mr-1" />
            Инвентарь
          </Button>
          <Button onClick={onSave} variant="outline" size="sm" className="border-blue-700">
            <Icon name="Save" size={18} className="mr-1" />
            Сохранить
          </Button>
          <Button onClick={onMenu} variant="outline" size="sm" className="border-gray-700">
            <Icon name="Menu" size={18} className="mr-1" />
            Меню
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4">
        {/* Location View */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="p-6 bg-gradient-to-b from-gray-900 to-black border-2 border-red-900/40">
            <h2 className="text-3xl font-bold text-red-400 mb-3">{location.name}</h2>
            <p className="text-gray-300 text-lg italic mb-4">{location.description}</p>
            {message && (
              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-200 animate-fade-in">
                {message}
              </div>
            )}
          </Card>

          {/* Objects */}
          <Card className="p-4 bg-black/70 border border-purple-900/40 flex-1">
            <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
              <Icon name="Eye" size={20} />
              Объекты для взаимодействия
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {location.objects.map((obj) => (
                <Button
                  key={obj}
                  onClick={() => handleObjectInteraction(obj)}
                  className="h-auto py-3 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600 text-left justify-start"
                >
                  <Icon name="Circle" size={14} className="mr-2" />
                  {obj}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* NPCs & Navigation */}
        <div className="w-80 flex flex-col gap-4">
          {location.npcs.length > 0 && (
            <Card className="p-4 bg-black/70 border border-green-900/40">
              <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                <Icon name="Users" size={20} />
                Персонажи
              </h3>
              <div className="space-y-2">
                {location.npcs.map((npc) => (
                  <Button
                    key={npc}
                    onClick={() => handleNpcInteraction(npc)}
                    className="w-full bg-green-900/30 hover:bg-green-800/50 border border-green-700"
                  >
                    {npc}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4 bg-black/70 border border-blue-900/40 flex-1">
            <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
              <Icon name="Map" size={20} />
              Перемещение
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => changeLocation('dark_forest')}
                disabled={currentLocation === 'dark_forest'}
                className="w-full bg-blue-900/30 hover:bg-blue-800/50 border border-blue-700 disabled:opacity-50"
              >
                Тёмный лес
              </Button>
              <Button
                onClick={() => changeLocation('abandoned_house')}
                disabled={currentLocation === 'abandoned_house'}
                className="w-full bg-blue-900/30 hover:bg-blue-800/50 border border-blue-700 disabled:opacity-50"
              >
                Заброшенный дом
              </Button>
              <Button
                onClick={() => changeLocation('cemetery')}
                disabled={currentLocation === 'cemetery'}
                className="w-full bg-blue-900/30 hover:bg-blue-800/50 border border-blue-700 disabled:opacity-50"
              >
                Кладбище
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}