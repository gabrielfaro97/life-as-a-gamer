import { GameProvider } from './context/GameContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <GameProvider>
      <Dashboard />
    </GameProvider>
  );
}

export default App;
