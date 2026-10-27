import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResourceState } from './components.jsx';

test('resource loading displays progress rather than stale children', () => {
  render(
    <ResourceState resource={{ loading: true }}>
      <p>Content</p>
    </ResourceState>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Loading listings');
  expect(screen.queryByText('Content')).not.toBeInTheDocument();
});

test('resource errors offer an explicit retry action', async () => {
  const user = userEvent.setup();
  const retry = vi.fn();
  render(
    <ResourceState resource={{ error: 'Offline', retry }}>
      <p>Content</p>
    </ResourceState>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Offline');
  await user.click(screen.getByRole('button', { name: 'Try again' }));
  expect(retry).toHaveBeenCalledOnce();
});
