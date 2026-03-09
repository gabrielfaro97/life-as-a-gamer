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
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <Header onAddGame={() => undefined} />
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
                1 jogo
              </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <GameCard
                game={sampleGame}
                onEdit={() => undefined}
                onDelete={() => undefined}
              />
            </div>
          </div>

          <aside className="rounded-xl bg-zinc-800 p-6 shadow-md">
            <h2 className="text-lg font-semibold text-zinc-100">
              Próximos passos
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-400">
              <li>Definir o modelo de dados dos jogos</li>
              <li>Criar o card visual de cada item</li>
              <li>Montar o formulário de cadastro</li>
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
