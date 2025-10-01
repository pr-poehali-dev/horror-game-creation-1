import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import JumpscareScreen from './JumpscareScreen';
import type { PlayerData, Enemy } from '../App';

interface BattleSystemProps {
  player: PlayerData;
  enemy: Enemy;
  onBattleEnd: (won: boolean) => void;
  setPlayer: (player: PlayerData) => void;
}

export default function BattleSystem({ player, enemy, onBattleEnd, setPlayer }: BattleSystemProps) {
  const [currentEnemy, setCurrentEnemy] = useState({ ...enemy });
  const [currentPlayer, setCurrentPlayer] = useState({ ...player });
  const [battleLog, setBattleLog] = useState<string[]>([`Битва с ${enemy.name} началась!`]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [shakePlayer, setShakePlayer] = useState(false);
  const [shakeEnemy, setShakeEnemy] = useState(false);
  const [showJumpscare, setShowJumpscare] = useState(false);

  useEffect(() => {
    if (!isPlayerTurn && currentEnemy.hp > 0 && currentPlayer.hp > 0) {
      const timer = setTimeout(() => {
        enemyTurn();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, currentEnemy.hp, currentPlayer.hp]);

  useEffect(() => {
    if (currentPlayer.hp <= 0) {
      setBattleLog((prev) => [...prev, 'Вы проиграли...']);
      setTimeout(() => {
        setShowJumpscare(true);
      }, 1000);
    } else if (currentEnemy.hp <= 0) {
      setBattleLog((prev) => [...prev, `${enemy.name} повержен!`]);
      setTimeout(() => {
        setPlayer({ ...currentPlayer });
        onBattleEnd(true);
      }, 2000);
    }
  }, [currentPlayer.hp, currentEnemy.hp]);

  const handleJumpscareFinish = () => {
    setShowJumpscare(false);
    setPlayer({ ...currentPlayer });
    onBattleEnd(false);
  };

  const playerAttack = () => {
    const damage = Math.max(15 - currentEnemy.defense, 5) + Math.floor(Math.random() * 10);
    const newEnemyHp = Math.max(currentEnemy.hp - damage, 0);
    
    setShakeEnemy(true);
    setTimeout(() => setShakeEnemy(false), 300);
    
    setCurrentEnemy({ ...currentEnemy, hp: newEnemyHp });
    setBattleLog((prev) => [...prev, `Вы атакуете! Урон: ${damage}`]);
    
    if (newEnemyHp > 0) {
      setIsPlayerTurn(false);
    }
  };

  const playerDefend = () => {
    const healAmount = 10;
    const newHp = Math.min(currentPlayer.hp + healAmount, currentPlayer.maxHp);
    setCurrentPlayer({ ...currentPlayer, hp: newHp });
    setBattleLog((prev) => [...prev, `Вы защищаетесь и восстанавливаете ${healAmount} HP`]);
    setIsPlayerTurn(false);
  };

  const useItem = (item: string) => {
    if (item === 'Зелье здоровья') {
      const healAmount = 30;
      const newHp = Math.min(currentPlayer.hp + healAmount, currentPlayer.maxHp);
      setCurrentPlayer({ ...currentPlayer, hp: newHp });
      setBattleLog((prev) => [...prev, `Использовано зелье здоровья! +${healAmount} HP`]);
      setIsPlayerTurn(false);
    }
  };

  const enemyTurn = () => {
    const damage = Math.max(currentEnemy.attack - 5, 3) + Math.floor(Math.random() * 8);
    const newPlayerHp = Math.max(currentPlayer.hp - damage, 0);
    
    setShakePlayer(true);
    setTimeout(() => setShakePlayer(false), 300);
    
    setCurrentPlayer({ ...currentPlayer, hp: newPlayerHp });
    setBattleLog((prev) => [...prev, `${enemy.name} атакует! Урон: ${damage}`]);
    
    if (newPlayerHp > 0) {
      setIsPlayerTurn(true);
    }
  };

  return (
    <>
      {showJumpscare && (
        <JumpscareScreen enemyName={enemy.name} onFinish={handleJumpscareFinish} />
      )}
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-red-950/30 to-black p-8">
      <Card className="w-full max-w-5xl p-8 bg-black/80 border-2 border-red-900">
        {/* Enemy */}
        <div className={`text-center mb-8 ${shakeEnemy ? 'animate-shake' : ''}`}>
          <h2 className="text-4xl font-bold text-red-400 mb-4">{currentEnemy.name}</h2>
          <div className="flex justify-center items-center gap-4 mb-4">
            <Icon name="Skull" size={64} className="text-red-600" />
          </div>
          <div className="flex justify-center items-center gap-2">
            <Icon name="Heart" size={20} className="text-red-500" />
            <div className="w-96 h-6 bg-gray-800 rounded-full overflow-hidden border-2 border-red-700">
              <div
                className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500"
                style={{ width: `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%` }}
              ></div>
            </div>
            <span className="text-xl text-white">{currentEnemy.hp}/{currentEnemy.maxHp}</span>
          </div>
        </div>

        {/* Battle Log */}
        <Card className="p-4 mb-6 bg-gray-900/50 border border-purple-900/50 h-32 overflow-y-auto">
          {battleLog.map((log, index) => (
            <p key={index} className="text-gray-300 text-lg mb-1 animate-fade-in">
              &gt; {log}
            </p>
          ))}
        </Card>

        {/* Player */}
        <div className={`text-center mb-6 ${shakePlayer ? 'animate-shake' : ''}`}>
          <h3 className="text-2xl font-bold text-blue-400 mb-3">{currentPlayer.name}</h3>
          <div className="flex justify-center items-center gap-2">
            <Icon name="Heart" size={20} className="text-red-500" />
            <div className="w-96 h-6 bg-gray-800 rounded-full overflow-hidden border-2 border-blue-700">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                style={{ width: `${(currentPlayer.hp / currentPlayer.maxHp) * 100}%` }}
              ></div>
            </div>
            <span className="text-xl text-white">{currentPlayer.hp}/{currentPlayer.maxHp}</span>
          </div>
        </div>

        {/* Actions */}
        {isPlayerTurn && currentPlayer.hp > 0 && currentEnemy.hp > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={playerAttack}
              className="h-16 text-xl bg-red-900/50 hover:bg-red-800/70 border-2 border-red-700"
            >
              <Icon name="Sword" size={24} className="mr-2" />
              Атаковать
            </Button>
            <Button
              onClick={playerDefend}
              className="h-16 text-xl bg-blue-900/50 hover:bg-blue-800/70 border-2 border-blue-700"
            >
              <Icon name="Shield" size={24} className="mr-2" />
              Защита
            </Button>
            <Button
              onClick={() => useItem('Зелье здоровья')}
              disabled={!currentPlayer.items?.includes('Зелье здоровья')}
              className="h-16 text-xl bg-green-900/50 hover:bg-green-800/70 border-2 border-green-700 disabled:opacity-30"
            >
              <Icon name="FlaskConical" size={24} className="mr-2" />
              Зелье
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-2xl text-yellow-400 animate-pulse">
              {currentPlayer.hp > 0 && currentEnemy.hp > 0 ? 'Ход противника...' : ''}
            </p>
          </div>
        )}
      </Card>
    </div>
    </>
  );
}