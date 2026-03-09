import { useTranslation } from 'react-i18next';

import type { Game } from '../types/Game';

type GameCardProps = {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
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

function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-300 bg-zinc-100 shadow-md transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-zinc-400 hover:shadow-lg dark:border-zinc-500/90 dark:bg-zinc-800 dark:shadow-[0_8px_20px_rgba(0,0,0,0.22)] dark:hover:border-zinc-400 dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)]">
      <div className="aspect-[2/3] overflow-hidden bg-zinc-200 dark:bg-zinc-900">
        <img
          src={game.coverUrl || FALLBACK_COVER}
          alt={t('gameCard.coverAlt', { name: game.name })}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_COVER;
          }}
        />
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {game.name}
          </h3>
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
            onClick={() => onEdit(game)}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-indigo-500"
          >
            {t('gameCard.edit')}
          </button>
          <button
            type="button"
            onClick={() => onDelete(game)}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-red-400"
          >
            {t('gameCard.delete')}
          </button>
        </div>
      </div>
    </article>
  );
}

export default GameCard;
