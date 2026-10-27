import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

test('task names are trimmed and task completion can be reversed', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByLabelText('New task'), '  Review React  ');
  await user.click(screen.getByRole('button', { name: 'Add task' }));
  expect(screen.getByText('Review React')).toBeInTheDocument();
  expect(screen.getByLabelText('New task')).toHaveValue('');
  const checkbox = screen.getByRole('checkbox');
  await user.click(checkbox);
  expect(screen.getByRole('status')).toHaveTextContent('1 of 1 completed');
  await user.click(checkbox);
  expect(screen.getByRole('status')).toHaveTextContent('0 of 1 completed');
});
