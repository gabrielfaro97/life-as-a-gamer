import Header from '../components/Header';

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
                  Comece adicionando o primeiro jogo para montar sua biblioteca.
                </p>
              </div>
              <span className="rounded-xl border border-zinc-700 px-3 py-1 text-sm text-zinc-400">
                0 jogos
              </span>
            </div>

            <div className="mt-8 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 p-8 text-center">
              <p className="text-base font-medium text-zinc-100">
                Nenhum jogo cadastrado ainda
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Use o botão &quot;Adicionar jogo&quot; para começar a preencher seu dashboard.
              </p>
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
