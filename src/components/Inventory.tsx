import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { PlayerData } from '../App';

interface InventoryProps {
  player: PlayerData;
  setPlayer: (player: PlayerData) => void;
  onClose: () => void;
}

const availableItems = [
  { name: 'Зелье здоровья', icon: 'FlaskConical', description: 'Восстанавливает 30 HP' },
  { name: 'Старый ключ', icon: 'Key', description: 'Ржавый ключ от неизвестной двери' },
  { name: 'Проклятый амулет', icon: 'Gem', description: 'Излучает тёмную энергию' },
  { name: 'Фонарь', icon: 'Lightbulb', description: 'Освещает тёмные места' }
];

const availableEquipment = [
  { name: 'Ржавый меч', slot: 'weapon' as const, icon: 'Sword', bonus: '+10 Атака' },
  { name: 'Кожаная броня', slot: 'armor' as const, icon: 'Shield', bonus: '+5 Защита' },
  { name: 'Проклятый клинок', slot: 'weapon' as const, icon: 'Sword', bonus: '+20 Атака' },
  { name: 'Тёмная мантия', slot: 'armor' as const, icon: 'Shield', bonus: '+15 Защита' }
];

export default function Inventory({ player, setPlayer, onClose }: InventoryProps) {
  const equipItem = (itemName: string, slot: 'weapon' | 'armor') => {
    setPlayer({
      ...player,
      equipment: {
        ...player.equipment,
        [slot]: itemName
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black/90 p-8">
      <Card className="w-full max-w-6xl p-8 bg-gradient-to-b from-gray-900 to-black border-2 border-purple-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-purple-400 flex items-center gap-3">
            <Icon name="Backpack" size={36} />
            Инвентарь
          </h2>
          <Button onClick={onClose} variant="outline" className="border-red-700">
            <Icon name="X" size={20} className="mr-2" />
            Закрыть
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Items */}
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <Icon name="Package" size={24} />
              Предметы
            </h3>
            <div className="space-y-2">
              {availableItems.map((item) => {
                const hasItem = player.items.includes(item.name);
                return (
                  <Card
                    key={item.name}
                    className={`p-4 ${
                      hasItem
                        ? 'bg-green-900/30 border-green-700'
                        : 'bg-gray-800/30 border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon name={item.icon as any} size={32} className="text-green-400" />
                      <div className="flex-1">
                        <p className="font-bold text-lg text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      {hasItem && (
                        <Icon name="Check" size={20} className="text-green-500" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <Icon name="Sword" size={24} />
              Экипировка
            </h3>

            <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded">
              <p className="text-lg mb-2 flex items-center gap-2">
                <Icon name="Sword" size={20} />
                <span className="font-bold">Оружие:</span>
                <span className="text-yellow-400">
                  {player.equipment.weapon || 'Не экипировано'}
                </span>
              </p>
              <p className="text-lg flex items-center gap-2">
                <Icon name="Shield" size={20} />
                <span className="font-bold">Броня:</span>
                <span className="text-yellow-400">
                  {player.equipment.armor || 'Не экипировано'}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              {availableEquipment.map((item) => {
                const isEquipped = player.equipment[item.slot] === item.name;
                return (
                  <Card
                    key={item.name}
                    className={`p-4 ${
                      isEquipped
                        ? 'bg-yellow-900/40 border-yellow-600'
                        : 'bg-gray-800/30 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon name={item.icon as any} size={32} className="text-yellow-400" />
                      <div className="flex-1">
                        <p className="font-bold text-lg text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">{item.bonus}</p>
                      </div>
                      <Button
                        onClick={() => equipItem(item.name, item.slot)}
                        disabled={isEquipped}
                        size="sm"
                        className={
                          isEquipped
                            ? 'bg-green-900/50 border-green-700'
                            : 'bg-yellow-900/50 border-yellow-700 hover:bg-yellow-800/70'
                        }
                      >
                        {isEquipped ? 'Надето' : 'Надеть'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded">
          <p className="text-gray-300 text-center">
            💡 Используйте предметы в бою или экипируйте оружие и броню для улучшения характеристик
          </p>
        </div>
      </Card>
    </div>
  );
}
