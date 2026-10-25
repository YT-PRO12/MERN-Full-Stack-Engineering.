import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
test('adds, completes and validates tasks through the form', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Add task' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Write a task');
  await user.type(screen.getByLabelText('New task'), 'Read about effects');
  await user.click(screen.getByRole('button', { name: 'Add task' }));
  await user.click(screen.getByRole('checkbox'));
  expect(screen.getByRole('status')).toHaveTextContent('1 of 1 completed');
});
