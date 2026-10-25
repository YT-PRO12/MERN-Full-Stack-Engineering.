import { createContext, useContext, useReducer } from 'react';
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from 'react-router-dom';
const AuthContext = createContext(null);
const products = [
  { id: '1', name: 'Study headphones', category: 'electronics', price: 850 },
  { id: '2', name: 'Algorithms textbook', category: 'books', price: 350 },
];
function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category');
  const items = products.filter((item) => !category || item.category === category);
  return (
    <>
      <h2>Browse products</h2>
      <label>
        Category
        <select
          value={category || ''}
          onChange={(e) => setParams(e.target.value ? { category: e.target.value } : {})}
        >
          <option value="">All</option>
          <option value="books">Books</option>
          <option value="electronics">Electronics</option>
        </select>
      </label>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={item.id}>{item.name}</Link> — ₹{item.price}
          </li>
        ))}
      </ul>
      {!items.length && <p>No products match this category.</p>}
    </>
  );
}
function ProductDetails() {
  const { id } = useParams();
  const item = products.find((product) => product.id === id);
  return item ? (
    <>
      <h2>{item.name}</h2>
      <p>
        ₹{item.price} · {item.category}
      </p>
      <Link to="/router/products">Back to products</Link>
    </>
  ) : (
    <h2>Product not found</h2>
  );
}
function ProtectedRoute() {
  return useContext(AuthContext).signedIn ? <Outlet /> : <Navigate to="/router/login" replace />;
}
function Login() {
  const { dispatch } = useContext(AuthContext);
  return (
    <>
      <h2>Simulated sign-in</h2>
      <p>No password, server session, or authorization is involved in this routing exercise.</p>
      <button onClick={() => dispatch('login')}>Enable demo session</button>
    </>
  );
}
export default function RouterDemo() {
  const [signedIn, dispatch] = useReducer((_state, action) => action === 'login', false);
  return (
    <AuthContext.Provider value={{ signedIn, dispatch }}>
      <section>
        <p className="eyebrow">NESTED ROUTES / CONTEXT / REDUCERS</p>
        <h1>A route for every view.</h1>
        <p className="notice">
          Client-side routing practice. This demo session is not secure authentication.
        </p>
        <nav>
          <Link to="/router/products">Products</Link>
          <Link to="/router/profile">Profile</Link>
          {signedIn && <button onClick={() => dispatch('logout')}>End demo session</button>}
        </nav>
        <Routes>
          <Route index element={<Navigate to="products" replace />} />
          <Route
            path="products"
            element={
              <div className="panel">
                <Outlet />
              </div>
            }
          >
            <Route index element={<Products />} />
            <Route path=":id" element={<ProductDetails />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<h2>Demo profile</h2>} />
          </Route>
          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </section>
    </AuthContext.Provider>
  );
}
