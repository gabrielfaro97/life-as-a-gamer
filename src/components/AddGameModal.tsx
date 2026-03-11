import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import type { Game } from '../types/Game';
import AddGameForm from './AddGameForm';

type AddGameModalProps = {
  open: boolean;
  initialGame?: Game | null;
  onSubmit: (game: Game) => void;
  onClose: () => void;
};

function AddGameModal({ open, initialGame, onSubmit, onClose }: AddGameModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  const isEditMode = Boolean(initialGame);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function handleSubmit(game: Game) {
    onSubmit(game);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {isEditMode ? t('addGameForm.editTitle') : t('addGameForm.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
            aria-label={t('addGameModal.close')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          <AddGameForm
            initialGame={initialGame}
            onSubmit={handleSubmit}
            onCancel={onClose}
            hideHeader
          />
        </div>
      </div>
    </div>
  );
}

export default AddGameModal;
