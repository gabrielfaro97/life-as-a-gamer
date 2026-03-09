import { useMemo, useState } from 'react';

import AddGameForm from '../components/AddGameForm';
import ConfirmDialog from '../components/ConfirmDialog';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import { useGames } from '../context/GameContext';
import type { Game } from '../types/Game';

type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'name-asc'
  | 'name-desc'
  | 'rating-desc'
  | 'rating-asc';

function Dashboard() {
  const { games, addGame, removeGame, updateGame } = useGames();
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

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

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const game of games) {
      const year = new Date(game.finishedAt).getFullYear();
      if (!Number.isNaN(year)) years.add(year);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [games]);

  const filteredAndSortedGames = useMemo(() => {
    let result = games;

    if (yearFilter !== 'all') {
      const year = Number(yearFilter);
      result = result.filter(
        (g) => new Date(g.finishedAt).getFullYear() === year,
      );
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime();
        case 'date-asc':
          return new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return result;
  }, [games, yearFilter, sortBy]);

  const gamesByPlatform = useMemo(() => {
    const map = new Map<string, Game[]>();
    for (const game of filteredAndSortedGames) {
      const platform = game.platform || 'Outros';
      const list = map.get(platform) ?? [];
      list.push(game);
      map.set(platform, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
  }, [filteredAndSortedGames]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
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
          <div className="rounded-xl bg-zinc-100 p-6 shadow-md dark:bg-zinc-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Seus jogos zerados
                </h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Visualize os jogos finalizados e mantenha sua biblioteca
                  organizada.
                </p>
              </div>
              <StatsBar total={filteredAndSortedGames.length} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="year-filter"
                  className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
                >
                  Ano
                </label>
                <select
                  id="year-filter"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 bg-white pl-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="all">Todos</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-by"
                  className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
                >
                  Ordenar
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as SortOption)
                  }
                  className="rounded-lg border border-zinc-300 bg-white pl-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="date-desc">Data (mais recente)</option>
                  <option value="date-asc">Data (mais antiga)</option>
                  <option value="name-asc">Nome (A–Z)</option>
                  <option value="name-desc">Nome (Z–A)</option>
                  <option value="rating-desc">Nota (maior)</option>
                  <option value="rating-asc">Nota (menor)</option>
                </select>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              {gamesByPlatform.map(([platform, platformGames]) => (
                <div key={platform}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {platform}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {platformGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onEdit={(g) => setGameToEdit(g)}
                        onDelete={(g) => setGameToDelete(g)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-xl bg-zinc-100 p-6 shadow-md dark:bg-zinc-800">
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
