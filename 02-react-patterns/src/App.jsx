import { Link, Routes, Route, Navigate } from 'react-router-dom';
import CurrencyConverter from './currency/CurrencyConverter.jsx';
import RouterDemo from './router/RouterDemo.jsx';
export default function App() {
  return (
    <main>
      <nav aria-label="Projects">
        <Link to="/currency">Currency converter</Link>
        <Link to="/router">Router lab</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/currency" replace />} />
        <Route path="/currency" element={<CurrencyConverter />} />
        <Route path="/router/*" element={<RouterDemo />} />
        <Route
          path="*"
          element={
            <>
              <h1>Page not found</h1>
              <Link to="/">Back to projects</Link>
            </>
          }
        />
      </Routes>
    </main>
  );
}
