import { useTranslation } from 'react-i18next';

import type { Game } from '../types/Game';

type GameCardProps = {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
  onSyncCover: (game: Game) => void;
};

const FALLBACK_COVER =
  'https://placehold.co/600x900/18181b/f4f4f5?text=Sem+capa';

function formatFinishedAt(finishedAt: string, locale: string, invalidDateLabel: string) {
  const parsedDate = new Date(finishedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return invalidDateLabel;
  }

  return new Intl.DateTimeFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}

function RatingIndicator({ rating }: { rating: number }) {
  const filled = Math.round((rating / 10) * 5);
  return (
    <div className="flex w-full gap-1" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-colors ${
            i < filled ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-600'
          }`}
        />
      ))}
    </div>
  );
}

function GameCard({ game, onEdit, onDelete, onSyncCover }: GameCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-300 bg-zinc-100 shadow-md transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-zinc-400 hover:shadow-lg dark:border-zinc-500/90 dark:bg-zinc-800 dark:shadow-[0_8px_20px_rgba(0,0,0,0.22)] dark:hover:border-zinc-400 dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)]">
      <div className="group/cover relative aspect-[2/3] overflow-hidden bg-zinc-200 dark:bg-zinc-900">
        <img
          src={game.coverUrl || FALLBACK_COVER}
          alt={t('gameCard.coverAlt', { name: game.name })}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_COVER;
          }}
        />
        <button
          type="button"
          onClick={() => onSyncCover(game)}
          className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity hover:bg-black/80 group-hover/cover:opacity-100"
          title={t('gameCard.syncCover')}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('gameCard.syncCover')}
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="group relative">
            <h3 className="min-h-[2.5em] line-clamp-2 text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
              {game.name}
            </h3>
            <span
              className="pointer-events-none absolute bottom-full left-0 z-20 mb-1 max-w-[min(16rem,100vw)] scale-95 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm font-medium text-zinc-900 opacity-0 shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              role="tooltip"
            >
              {game.name}
            </span>
          </div>
          <span className="inline-block rounded-lg bg-zinc-300/80 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-600/80 dark:text-zinc-300">
            {game.platform}
          </span>
        </div>

        <dl className="flex flex-col gap-3 text-sm">
          <div className="rounded-xl border border-zinc-300 bg-zinc-200/60 p-3 dark:border-zinc-700 dark:bg-zinc-900/60">
            <dt className="text-zinc-500 dark:text-zinc-400">{t('gameCard.finished')}</dt>
            <dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
              {formatFinishedAt(game.finishedAt, i18n.language, t('gameCard.invalidDate'))}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-300 bg-zinc-200/60 p-3 dark:border-zinc-700 dark:bg-zinc-900/60">
            <dt className="text-zinc-500 dark:text-zinc-400">{t('gameCard.rating')}</dt>
            <dd className="mt-1.5 flex flex-col gap-1">
              <RatingIndicator rating={game.rating} />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {game.rating}/10
              </span>
            </dd>
          </div>
        </dl>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onDelete(game)}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-red-400"
          >
            {t('gameCard.delete')}
          </button>
          <button
            type="button"
            onClick={() => onEdit(game)}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-indigo-500"
          >
            {t('gameCard.edit')}
          </button>
        </div>
      </div>
    </article>
  );
}

export default GameCard;
