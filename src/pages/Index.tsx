import { useState, useEffect } from 'react';
import MainMenu from '../components/MainMenu';
import GameWorld from '../components/GameWorld';
import BattleSystem from '../components/BattleSystem';
import DialogSystem from '../components/DialogSystem';
import Inventory from '../components/Inventory';
import SubliminalFrame from '../components/SubliminalFrame';
import Settings from '../components/Settings';

export type GameState = 'menu' | 'world' | 'battle' | 'dialog' | 'inventory' | 'settings';

export interface PlayerData {
  name: string;
  hp: number;
  maxHp: number;
  level: number;
  items: string[];
  equipment: { weapon?: string; armor?: string };
  location: string;
}

export interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [player, setPlayer] = useState<PlayerData>({
    name: 'Игрок',
    hp: 100,
    maxHp: 100,
    level: 1,
    items: ['Зелье здоровья', 'Старый ключ'],
    equipment: {},
    location: 'dark_forest'
  });
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [dialogData, setDialogData] = useState<any>(null);
  const [savedGame, setSavedGame] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('horrorGameSave');
    if (saved) {
      setSavedGame(true);
    }
  }, []);

  const startNewGame = () => {
    const newPlayer: PlayerData = {
      name: 'Странник',
      hp: 100,
      maxHp: 100,
      level: 1,
      items: ['Зелье здоровья', 'Старый ключ'],
      equipment: {},
      location: 'dark_forest'
    };
    setPlayer(newPlayer);
    setGameState('world');
  };

  const continueGame = () => {
    const saved = localStorage.getItem('horrorGameSave');
    if (saved) {
      const data = JSON.parse(saved);
      setPlayer(data);
      setGameState('world');
    }
  };

  const saveGame = () => {
    localStorage.setItem('horrorGameSave', JSON.stringify(player));
    setSavedGame(true);
  };

  const startBattle = (enemy: Enemy) => {
    setCurrentEnemy(enemy);
    setGameState('battle');
  };

  const endBattle = (won: boolean) => {
    if (won) {
      setPlayer({ ...player, hp: Math.min(player.hp + 20, player.maxHp) });
    } else {
      setPlayer({ ...player, hp: Math.max(player.hp - 30, 0) });
    }
    setCurrentEnemy(null);
    setGameState('world');
  };

  const startDialog = (npcName: string, dialog: string[]) => {
    setDialogData({ npcName, dialog, currentIndex: 0 });
    setGameState('dialog');
  };

  const endDialog = () => {
    setDialogData(null);
    setGameState('world');
  };

  const openInventory = () => {
    setGameState('inventory');
  };

  const closeInventory = () => {
    setGameState('world');
  };

  const openSettings = () => {
    setGameState('settings');
  };

  const closeSettings = () => {
    setGameState('menu');
  };

  return (
    <div className="grain-effect vignette w-screen h-screen overflow-hidden">
      <SubliminalFrame />
      
      {gameState === 'menu' && (
        <MainMenu
          onNewGame={startNewGame}
          onContinue={continueGame}
          onSettings={openSettings}
          hasSavedGame={savedGame}
        />
      )}

      {gameState === 'world' && (
        <GameWorld
          player={player}
          onBattle={startBattle}
          onDialog={startDialog}
          onInventory={openInventory}
          onSave={saveGame}
          onMenu={() => setGameState('menu')}
        />
      )}

      {gameState === 'battle' && currentEnemy && (
        <BattleSystem
          player={player}
          enemy={currentEnemy}
          onBattleEnd={endBattle}
          setPlayer={setPlayer}
        />
      )}

      {gameState === 'dialog' && dialogData && (
        <DialogSystem
          npcName={dialogData.npcName}
          dialog={dialogData.dialog}
          onDialogEnd={endDialog}
        />
      )}

      {gameState === 'inventory' && (
        <Inventory
          player={player}
          setPlayer={setPlayer}
          onClose={closeInventory}
        />
      )}

      {gameState === 'settings' && (
        <Settings onClose={closeSettings} />
      )}
    </div>
  );
};

export default Index;