import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddGameModal from '../components/AddGameModal';
import ConfirmDialog from '../components/ConfirmDialog';
import CoverSyncModal from '../components/CoverSyncModal';
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
  const { t } = useTranslation();
  const { games, addGame, removeGame, updateGame } = useGames();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [gameToSync, setGameToSync] = useState<Game | null>(null);
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const OTHERS_PLATFORM = '__others__';

  function handleConfirmDelete() {
    if (gameToDelete) {
      removeGame(gameToDelete);
      setGameToDelete(null);
    }
  }

  function handleAddGame(game: Game) {
    addGame(game);
    setIsModalOpen(false);
  }

  function handleUpdateGame(game: Game) {
    updateGame(game);
    setGameToEdit(null);
    setIsModalOpen(false);
  }

  function handleEditGame(game: Game) {
    setGameToEdit(game);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setGameToEdit(null);
  }

  function handleSelectCover(coverUrl: string, steamGridDbId: number) {
    if (gameToSync) {
      updateGame({
        ...gameToSync,
        coverUrl,
        steamGridDbId,
      });
      setGameToSync(null);
    }
  }

  function handleOpenAddGame() {
    setGameToEdit(null);
    setIsModalOpen(true);
  }

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const game of games) {
      const year = new Date(game.finishedAt).getFullYear();
      if (!Number.isNaN(year)) years.add(year);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [games]);

  const availablePlatforms = useMemo(() => {
    const platforms = new Set<string>();
    for (const game of games) {
      const platform = game.platform?.trim() || OTHERS_PLATFORM;
      platforms.add(platform);
    }
    return Array.from(platforms).sort((a, b) => {
      if (a === OTHERS_PLATFORM) return 1;
      if (b === OTHERS_PLATFORM) return -1;
      return a.localeCompare(b);
    });
  }, [games]);

  const filteredAndSortedGames = useMemo(() => {
    let result = games;

    if (yearFilter !== 'all') {
      const year = Number(yearFilter);
      result = result.filter(
        (g) => new Date(g.finishedAt).getFullYear() === year,
      );
    }

    if (platformFilter !== 'all') {
      result = result.filter((g) => {
        const platform = g.platform?.trim() || OTHERS_PLATFORM;
        return platform === platformFilter;
      });
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
  }, [games, yearFilter, platformFilter, sortBy]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <ConfirmDialog
        open={Boolean(gameToDelete)}
        title={t('confirmDialog.removeGame')}
        message={
          gameToDelete
            ? t('confirmDialog.removeGameMessage', { name: gameToDelete.name })
            : ''
        }
        confirmLabel={t('confirmDialog.remove')}
        cancelLabel={t('confirmDialog.cancel')}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setGameToDelete(null)}
      />
      {gameToSync && (
        <CoverSyncModal
          game={gameToSync}
          open={Boolean(gameToSync)}
          onClose={() => setGameToSync(null)}
          onSelectCover={handleSelectCover}
        />
      )}
      <AddGameModal
        open={isModalOpen}
        initialGame={gameToEdit}
        onSubmit={gameToEdit ? handleUpdateGame : handleAddGame}
        onClose={handleCloseModal}
      />
      <Header onAddGame={handleOpenAddGame} />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-6 sm:pt-28">
        <section>
          <div className="rounded-xl bg-zinc-100 p-4 shadow-md dark:bg-zinc-800 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {t('dashboard.gamesTitle')}
                </h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {t('dashboard.gamesDescription')}
                </p>
              </div>
              <StatsBar total={filteredAndSortedGames.length} />
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="year-filter"
                  className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
                >
                  {t('dashboard.year')}
                </label>
                <select
                  id="year-filter"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 bg-white pl-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="all">{t('dashboard.all')}</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="platform-filter"
                  className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
                >
                  {t('dashboard.platform')}
                </label>
                <select
                  id="platform-filter"
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="rounded-lg border border-zinc-300 bg-white pl-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="all">{t('dashboard.all')}</option>
                  {availablePlatforms.map((p) => (
                    <option key={p} value={p}>
                      {p === OTHERS_PLATFORM ? t('dashboard.others') : p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-by"
                  className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
                >
                  {t('dashboard.sort')}
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as SortOption)
                  }
                  className="rounded-lg border border-zinc-300 bg-white pl-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="date-desc">{t('dashboard.sortDateDesc')}</option>
                  <option value="date-asc">{t('dashboard.sortDateAsc')}</option>
                  <option value="name-asc">{t('dashboard.sortNameAsc')}</option>
                  <option value="name-desc">{t('dashboard.sortNameDesc')}</option>
                  <option value="rating-desc">{t('dashboard.sortRatingDesc')}</option>
                  <option value="rating-asc">{t('dashboard.sortRatingAsc')}</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredAndSortedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onEdit={handleEditGame}
                    onDelete={(g) => setGameToDelete(g)}
                    onSyncCover={(g) => setGameToSync(g)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
