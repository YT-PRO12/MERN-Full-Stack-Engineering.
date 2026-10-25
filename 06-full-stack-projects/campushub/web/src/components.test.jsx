import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ListingCard } from './components.jsx';
test('a sold listing has no management link and keeps its public detail link', () => {
  render(
    <MemoryRouter>
      <ListingCard
        manage
        item={{
          id: '1',
          title: 'Book for next semester',
          price: 0,
          category: 'books',
          status: 'sold',
          condition: 'good',
          location: 'Library',
        }}
      />
    </MemoryRouter>,
  );
  expect(screen.queryByText('Manage listing →')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Book for next semester' })).toHaveAttribute(
    'href',
    '/listings/1',
  );
  expect(screen.getByText('₹0')).toBeInTheDocument();
});
