import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app content', () => {
  render(<App />);
  expect(screen.getByText(/verso gato pretinho fofinho/i)).toBeInTheDocument();
});
