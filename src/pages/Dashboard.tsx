import { useState } from 'react';

import AddGameForm from '../components/AddGameForm';
import ConfirmDialog from '../components/ConfirmDialog';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import { useGames } from '../context/GameContext';
import type { Game } from '../types/Game';

function Dashboard() {
  const { games, addGame, removeGame, updateGame } = useGames();
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  function handleConfirmDelete() {
    if (gameToDelete) {
      removeGame(gameToDelete);
      setGameToDelete(null);
    }
  }

  function handleUpdateGame(game: Game) {
    updateGame(game);
    setGameToEdit(null);
  }

  function handleOpenAddGame() {
    setGameToEdit(null);
    const formElement = document.getElementById('add-game-form');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const firstField = formElement?.querySelector<
      HTMLInputElement | HTMLSelectElement
    >('input, select');
    firstField?.focus();
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <ConfirmDialog
        open={Boolean(gameToDelete)}
        title="Remover jogo"
        message={
          gameToDelete
            ? `Tem certeza que deseja remover "${gameToDelete.name}"?`
            : ''
        }
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setGameToDelete(null)}
      />
      <Header onAddGame={handleOpenAddGame} />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-8 pt-28">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="rounded-xl bg-zinc-800 p-6 shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">
                  Seus jogos zerados
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Visualize os jogos finalizados e mantenha sua biblioteca
                  organizada.
                </p>
              </div>
              <span className="rounded-xl border border-zinc-700 px-3 py-1 text-sm text-zinc-400">
                {games.length} {games.length === 1 ? 'jogo' : 'jogos'}
              </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onEdit={(game) => setGameToEdit(game)}
                  onDelete={(game) => setGameToDelete(game)}
                />
              ))}
            </div>
          </div>

          <aside className="rounded-xl bg-zinc-800 p-6 shadow-md">
            <AddGameForm
            initialGame={gameToEdit}
            onSubmit={gameToEdit ? handleUpdateGame : addGame}
            onCancel={gameToEdit ? () => setGameToEdit(null) : undefined}
          />
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
