import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import type { Game } from '../types/Game';

type AddGameFormProps = {
  initialGame?: Game | null;
  onSubmit: (game: Game) => void;
  onCancel?: () => void;
};

type FormValues = {
  name: string;
  coverUrl: string;
  finishedAt: string;
  platform: string;
  rating: string;
};

const INITIAL_VALUES: FormValues = {
  name: '',
  coverUrl: '',
  finishedAt: '',
  platform: '',
  rating: '',
};

function generateGameId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `game-${Date.now()}`;
}

function buildIsoDate(date: string) {
  return new Date(`${date}T00:00:00`).toISOString();
}

function isoToDateInput(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function gameToFormValues(game: Game): FormValues {
  return {
    name: game.name,
    coverUrl: game.coverUrl,
    finishedAt: isoToDateInput(game.finishedAt),
    platform: game.platform,
    rating: String(game.rating),
  };
}

function AddGameForm({ initialGame, onSubmit, onCancel }: AddGameFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditMode = Boolean(initialGame);

  useEffect(() => {
    if (initialGame) {
      setValues(gameToFormValues(initialGame));
    } else {
      setValues(INITIAL_VALUES);
    }
    setErrorMessage('');
  }, [initialGame]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = values.name.trim();
    const coverUrl = values.coverUrl.trim();
    const platform = values.platform.trim();
    const rating = Number(values.rating);

    if (!name || !values.finishedAt || !platform || !values.rating) {
      setErrorMessage('Preencha todos os campos obrigatorios.');
      return;
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
      setErrorMessage('A nota precisa ser um numero entre 1 e 10.');
      return;
    }

    const finishedAt = buildIsoDate(values.finishedAt);

    if (Number.isNaN(new Date(finishedAt).getTime())) {
      setErrorMessage('Informe uma data de finalizacao valida.');
      return;
    }

    const game: Game = {
      id: initialGame?.id ?? generateGameId(),
      name,
      coverUrl: coverUrl || '',
      finishedAt,
      platform,
      rating,
    };

    onSubmit(game);
    setValues(INITIAL_VALUES);
    setErrorMessage('');
  }

  return (
    <form id="add-game-form" className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {isEditMode ? 'Editar jogo' : 'Adicionar novo jogo'}
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {isEditMode
            ? 'Atualize os dados do jogo e salve as alterações.'
            : 'Cadastre um jogo finalizado para atualizar sua biblioteca.'}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200" htmlFor="name">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-indigo-500"
          placeholder="Ex: Hollow Knight"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
          htmlFor="coverUrl"
        >
          URL da capa <span className="text-zinc-500 dark:text-zinc-500">(opcional)</span>
        </label>
        <input
          id="coverUrl"
          name="coverUrl"
          type="url"
          value={values.coverUrl}
          onChange={handleChange}
          className="w-full rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-indigo-500"
          placeholder="https://..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
            htmlFor="finishedAt"
          >
            Data de finalizacao
          </label>
          <input
            id="finishedAt"
            name="finishedAt"
            type="date"
            value={values.finishedAt}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
            htmlFor="rating"
          >
            Nota
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min="1"
            max="10"
            step="1"
            value={values.rating}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-indigo-500"
            placeholder="1 a 10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
          htmlFor="platform"
        >
          Plataforma
        </label>
        <select
          id="platform"
          name="platform"
          value={values.platform}
          onChange={handleChange}
          className="w-full rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 pl-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition focus:border-indigo-500"
          required
        >
          <option value="">Selecione uma plataforma</option>
          <option value="PC">PC</option>
          <option value="PlayStation 5">PlayStation 5</option>
          <option value="Xbox Series">Xbox Series</option>
          <option value="Nintendo Switch">Nintendo Switch</option>
          <option value="Mobile">Mobile</option>
        </select>
      </div>

      {errorMessage ? (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex gap-3">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-zinc-300 bg-transparent dark:border-zinc-600 px-4 py-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300 transition-all duration-200 ease-in-out hover:border-zinc-400 hover:text-zinc-900 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
          >
            Cancelar
          </button>
        ) : null}
        <button
          type="submit"
          className={`rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-in-out hover:bg-indigo-500 ${onCancel ? 'flex-1' : 'w-full'}`}
        >
          {isEditMode ? 'Salvar alterações' : 'Salvar jogo'}
        </button>
      </div>
    </form>
  );
}

export default AddGameForm;
