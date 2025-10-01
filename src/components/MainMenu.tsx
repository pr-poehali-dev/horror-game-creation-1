import { Button } from '@/components/ui/button';

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onSettings: () => void;
  hasSavedGame: boolean;
}

export default function MainMenu({ onNewGame, onContinue, onSettings, hasSavedGame }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e] relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-900/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="z-10 text-center space-y-8 animate-fade-in">
        <h1 className="text-7xl font-bold text-red-500 mb-4 tracking-wider drop-shadow-[0_0_20px_rgba(233,69,96,0.5)] animate-pulse">
          ТЕМНЫЙ МИР
        </h1>
        <p className="text-2xl text-gray-400 mb-12 italic">
          ...где страх становится реальностью...
        </p>

        <div className="space-y-4 flex flex-col items-center">
          <Button
            onClick={onNewGame}
            className="w-64 h-14 text-2xl bg-red-900/50 hover:bg-red-800/70 border-2 border-red-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(233,69,96,0.6)]"
          >
            НОВАЯ ИГРА
          </Button>

          {hasSavedGame && (
            <Button
              onClick={onContinue}
              className="w-64 h-14 text-2xl bg-purple-900/50 hover:bg-purple-800/70 border-2 border-purple-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
            >
              ПРОДОЛЖИТЬ
            </Button>
          )}

          <Button
            onClick={onSettings}
            className="w-64 h-14 text-2xl bg-gray-800/50 hover:bg-gray-700/70 border-2 border-gray-600 text-white transition-all duration-300 hover:scale-105"
          >
            НАСТРОЙКИ
          </Button>
        </div>

        <p className="text-sm text-gray-600 mt-12 animate-pulse">
          Нажмите любую кнопку, чтобы начать...
        </p>
      </div>
    </div>
  );
}
