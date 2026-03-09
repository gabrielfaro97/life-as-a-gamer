import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <Dashboard />
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
