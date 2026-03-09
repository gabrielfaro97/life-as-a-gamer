type HeaderProps = {
  onAddGame: () => void;
};

function Header({ onAddGame }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
            Life as a Gamer
          </p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-100">Dashboard</h1>
        </div>
        <button
          type="button"
          onClick={onAddGame}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-zinc-100 shadow-md transition-all duration-200 ease-in-out hover:bg-indigo-500"
        >
          Adicionar jogo
        </button>
      </div>
    </header>
  );
}

export default Header;
