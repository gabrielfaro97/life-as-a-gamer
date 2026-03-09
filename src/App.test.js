import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard header and add button', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /dashboard/i, level: 1 })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /adicionar jogo/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', {
      name: /the legend of zelda: tears of the kingdom/i,
      level: 3,
    })
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /deletar/i })).toBeInTheDocument();
});
