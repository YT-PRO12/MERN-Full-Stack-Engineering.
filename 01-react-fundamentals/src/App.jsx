import { useState } from 'react';
function Task({ task, onToggle }) {
  return (
    <li>
      <label>
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />{' '}
        <span>{task.text}</span>
      </label>
    </li>
  );
}
export default function App() {
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  function add(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Write a task first.');
      return;
    }
    setTasks((current) => [
      ...current,
      { id: crypto.randomUUID(), text: name.trim(), done: false },
    ]);
    setName('');
    setError('');
  }
  function toggle(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }
  return (
    <main>
      <p className="eyebrow">01 / REACT FUNDAMENTALS</p>
      <h1>A small plan for today.</h1>
      <p>
        Components, props, controlled forms, immutable state, and stable list keys in one small
        application.
      </p>
      <form onSubmit={add}>
        <label htmlFor="task">New task</label>
        <div className="row">
          <input id="task" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
          <button>Add task</button>
        </div>
      </form>
      {error && <p role="alert">{error}</p>}
      {tasks.length ? (
        <ul>
          {tasks.map((task) => (
            <Task key={task.id} task={task} onToggle={toggle} />
          ))}
        </ul>
      ) : (
        <p>Your list is empty. Start with one useful thing.</p>
      )}
      <p role="status">
        {tasks.filter((task) => task.done).length} of {tasks.length} completed
      </p>
      <small>State lasts for this page session. Refreshing resets the exercise.</small>
    </main>
  );
}
