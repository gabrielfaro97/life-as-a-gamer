import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-BR': {
    translation: {
      app: {
        title: 'Life as a Gamer',
        dashboard: 'Dashboard',
      },
      header: {
        language: 'Idioma',
        addGame: 'Adicionar jogo',
        lightMode: 'Modo claro',
        darkMode: 'Modo escuro',
        lightModeAria: 'Ativar modo claro',
        darkModeAria: 'Ativar modo escuro',
      },
      dashboard: {
        gamesTitle: 'Seus jogos zerados',
        gamesDescription: 'Visualize os jogos finalizados e mantenha sua biblioteca organizada.',
        year: 'Ano',
        platform: 'Plataforma',
        sort: 'Ordenar',
        all: 'Todos',
        sortDateDesc: 'Data (mais recente)',
        sortDateAsc: 'Data (mais antiga)',
        sortNameAsc: 'Nome (A–Z)',
        sortNameDesc: 'Nome (Z–A)',
        sortRatingDesc: 'Nota (maior)',
        sortRatingAsc: 'Nota (menor)',
        others: 'Outros',
      },
      addGameForm: {
        title: 'Adicionar novo jogo',
        editTitle: 'Editar jogo',
        description: 'Cadastre um jogo finalizado para atualizar sua biblioteca.',
        editDescription: 'Atualize os dados do jogo e salve as alterações.',
        name: 'Nome',
        namePlaceholder: 'Ex: Hollow Knight',
        coverUrl: 'URL da capa',
        coverUrlOptional: '(opcional)',
        coverUrlPlaceholder: 'https://...',
        finishedAt: 'Data de finalização',
        rating: 'Nota',
        ratingPlaceholder: '1 a 10',
        platform: 'Plataforma',
        platformPlaceholder: 'Selecione uma plataforma',
        cancel: 'Cancelar',
        save: 'Salvar jogo',
        saveChanges: 'Salvar alterações',
        errorRequired: 'Preencha todos os campos obrigatórios.',
        errorRating: 'A nota precisa ser um número entre 1 e 10.',
        errorDate: 'Informe uma data de finalização válida.',
      },
      gameCard: {
        coverAlt: 'Capa de {{name}}',
        finished: 'Finalizado',
        rating: 'Nota',
        edit: 'Editar',
        delete: 'Deletar',
        invalidDate: 'Data inválida',
      },
      confirmDialog: {
        removeGame: 'Remover jogo',
        removeGameMessage: 'Tem certeza que deseja remover "{{name}}"?',
        remove: 'Remover',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
      },
      statsBar: {
        gameCompleted: 'jogo zerado',
        gamesCompleted: 'jogos zerados',
      },
    },
  },
  en: {
    translation: {
      app: {
        title: 'Life as a Gamer',
        dashboard: 'Dashboard',
      },
      header: {
        language: 'Language',
        addGame: 'Add game',
        lightMode: 'Light mode',
        darkMode: 'Dark mode',
        lightModeAria: 'Activate light mode',
        darkModeAria: 'Activate dark mode',
      },
      dashboard: {
        gamesTitle: 'Your completed games',
        gamesDescription: 'View your finished games and keep your library organized.',
        year: 'Year',
        platform: 'Platform',
        sort: 'Sort',
        all: 'All',
        sortDateDesc: 'Date (newest)',
        sortDateAsc: 'Date (oldest)',
        sortNameAsc: 'Name (A–Z)',
        sortNameDesc: 'Name (Z–A)',
        sortRatingDesc: 'Rating (highest)',
        sortRatingAsc: 'Rating (lowest)',
        others: 'Others',
      },
      addGameForm: {
        title: 'Add new game',
        editTitle: 'Edit game',
        description: 'Register a finished game to update your library.',
        editDescription: 'Update the game data and save the changes.',
        name: 'Name',
        namePlaceholder: 'E.g.: Hollow Knight',
        coverUrl: 'Cover URL',
        coverUrlOptional: '(optional)',
        coverUrlPlaceholder: 'https://...',
        finishedAt: 'Completion date',
        rating: 'Rating',
        ratingPlaceholder: '1 to 10',
        platform: 'Platform',
        platformPlaceholder: 'Select a platform',
        cancel: 'Cancel',
        save: 'Save game',
        saveChanges: 'Save changes',
        errorRequired: 'Please fill in all required fields.',
        errorRating: 'Rating must be a number between 1 and 10.',
        errorDate: 'Please enter a valid completion date.',
      },
      gameCard: {
        coverAlt: 'Cover of {{name}}',
        finished: 'Completed',
        rating: 'Rating',
        edit: 'Edit',
        delete: 'Delete',
        invalidDate: 'Invalid date',
      },
      confirmDialog: {
        removeGame: 'Remove game',
        removeGameMessage: 'Are you sure you want to remove "{{name}}"?',
        remove: 'Remove',
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
      statsBar: {
        gameCompleted: 'game completed',
        gamesCompleted: 'games completed',
      },
    },
  },
};

const STORAGE_KEY = 'life-as-a-gamer:language';

function loadLanguage(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'pt-BR' || stored === 'en')) return stored;
  } catch {
    // ignore
  }
  const browserLang = navigator.language;
  if (browserLang.startsWith('pt')) return 'pt-BR';
  return 'en';
}

i18n.use(initReactI18next).init({
  resources,
  lng: loadLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
    document.documentElement.lang = lng;
  } catch {
    // ignore
  }
});

export default i18n;
