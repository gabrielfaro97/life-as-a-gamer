import type { Game } from '../types/Game';

type GameCardProps = {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
};

const FALLBACK_COVER =
  'https://placehold.co/600x900/18181b/f4f4f5?text=Sem+capa';

function formatFinishedAt(finishedAt: string) {
  const parsedDate = new Date(finishedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Data invalida';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}

function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-500/90 bg-zinc-800 shadow-[0_8px_20px_rgba(0,0,0,0.22)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-zinc-400 hover:shadow-[0_12px_28px_rgba(0,0,0,0.3)]">
      <div className="aspect-[2/3] overflow-hidden bg-zinc-900">
        <img
          src={game.coverUrl}
          alt={`Capa de ${game.name}`}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_COVER;
          }}
        />
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-zinc-100">{game.name}</h3>
          <p className="text-sm text-zinc-400">{game.platform}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-3">
            <dt className="text-zinc-400">Finalizado</dt>
            <dd className="mt-1 font-medium text-zinc-100">
              {formatFinishedAt(game.finishedAt)}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-3">
            <dt className="text-zinc-400">Nota</dt>
            <dd className="mt-1 font-medium text-zinc-100">{game.rating}/10</dd>
          </div>
        </dl>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onEdit(game)}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-zinc-100 shadow-md transition-all duration-200 ease-in-out hover:bg-indigo-500"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(game)}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-zinc-100 shadow-md transition-all duration-200 ease-in-out hover:bg-red-400"
          >
            Deletar
          </button>
        </div>
      </div>
    </article>
  );
}

export default GameCard;
