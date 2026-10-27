import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './components.jsx';

test('pagination remains hidden for a single results page', () => {
  const { container } = render(<Pagination data={{ page: 1, pages: 1 }} onPage={() => {}} />);
  expect(container.querySelector('nav')).toBeNull();
});

test('pagination disables edges and sends the next page', async () => {
  const user = userEvent.setup();
  const onPage = vi.fn();
  render(<Pagination data={{ page: 1, pages: 3 }} onPage={onPage} />);
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Next' }));
  expect(onPage).toHaveBeenCalledWith(2);
});
