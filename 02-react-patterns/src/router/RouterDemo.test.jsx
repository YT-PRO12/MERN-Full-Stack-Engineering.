import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';
test('uses nested product routes and renders missing products', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/router/products']}>
      <App />
    </MemoryRouter>,
  );
  await user.selectOptions(screen.getByLabelText('Category'), 'books');
  expect(screen.queryByText('Study headphones')).not.toBeInTheDocument();
  await user.click(screen.getByRole('link', { name: 'Algorithms textbook' }));
  expect(screen.getByRole('heading', { name: 'Algorithms textbook' })).toBeInTheDocument();
});
test('redirects a protected view and makes the simulated session explicit', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/router/profile']}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { name: 'Simulated sign-in' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Enable demo session' }));
  await user.click(screen.getByRole('link', { name: 'Profile' }));
  expect(screen.getByRole('heading', { name: 'Demo profile' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'End demo session' }));
  expect(screen.getByRole('heading', { name: 'Simulated sign-in' })).toBeInTheDocument();
});
test('handles a direct link to an unknown product', () => {
  render(
    <MemoryRouter initialEntries={['/router/products/missing']}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { name: 'Product not found' })).toBeInTheDocument();
});
