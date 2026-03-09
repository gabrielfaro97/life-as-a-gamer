type StatsBarProps = {
  total: number;
};

function StatsBar({ total }: StatsBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2">
      <span className="text-2xl font-bold tabular-nums text-indigo-500 dark:text-indigo-400">
        {total}
      </span>
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {total === 1 ? 'jogo zerado' : 'jogos zerados'}
      </span>
    </div>
  );
}

export default StatsBar;
