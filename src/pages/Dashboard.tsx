import { useState } from 'react';

import AddGameForm from '../components/AddGameForm';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import type { Game } from '../types/Game';

const sampleGame: Game = {
  id: '1',
  name: 'The Legend of Zelda: Tears of the Kingdom',
  coverUrl:
    'https://cdn2.steamgriddb.com/grid/ae758fbcbd5bd841516c53b3c08ebc6f.png',
  finishedAt: '2026-03-01T00:00:00.000Z',
  platform: 'Nintendo Switch',
  rating: 10,
};

function Dashboard() {
  const [games, setGames] = useState<Game[]>([sampleGame]);

  function handleAddGame(game: Game) {
    setGames((currentGames) => [game, ...currentGames]);
  }

  function handleOpenAddGame() {
    const formElement = document.getElementById('add-game-form');

    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const firstField = formElement?.querySelector<
      HTMLInputElement | HTMLSelectElement
    >('input, select');

    firstField?.focus();
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
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
                  onEdit={() => undefined}
                  onDelete={() => undefined}
                />
              ))}
            </div>
          </div>

          <aside className="rounded-xl bg-zinc-800 p-6 shadow-md">
            <AddGameForm onSubmit={handleAddGame} />
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
