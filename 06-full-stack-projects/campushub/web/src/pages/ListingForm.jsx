import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useResource } from '../useResource.js';
import { useAuth } from '../AuthContext.jsx';
import { ResourceState } from '../components.jsx';
export function Editor({ item }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const body = Object.fromEntries(new FormData(event.currentTarget));
    body.price = Number(body.price);
    if (item) body.version = item.version;
    try {
      const data = await api(item ? `/listings/${item.id}` : '/listings', {
        method: item ? 'PATCH' : 'POST',
        body,
      });
      navigate(`/listings/${data.item.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="form-page wide">
      <p className="eyebrow">GIVE IT ANOTHER CHAPTER</p>
      <h1>{item ? 'A little update.' : 'List something useful.'}</h1>
      <form className="panel" onSubmit={submit}>
        <label>
          Title
          <input name="title" defaultValue={item?.title} required minLength={3} maxLength={100} />
        </label>
        <label>
          Description
          <textarea
            name="description"
            defaultValue={item?.description}
            required
            minLength={10}
            maxLength={2000}
            rows={4}
          />
        </label>
        <div className="form-row">
          <label>
            Price in rupees
            <input
              name="price"
              type="number"
              defaultValue={item?.price}
              required
              min={0}
              max={100000}
              step={1}
            />
          </label>
          <label>
            Category
            <select name="category" defaultValue={item?.category || 'books'}>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="essentials">Room essentials</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Condition
            <select name="condition" defaultValue={item?.condition || 'good'}>
              <option value="like-new">Like new</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </label>
          <label>
            Pickup area
            <input
              name="location"
              defaultValue={item?.location}
              required
              minLength={2}
              maxLength={80}
              placeholder="A public campus location"
            />
          </label>
        </div>
        {item && (
          <label>
            Status
            <select name="status" defaultValue={item.status}>
              <option value="active">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold (cannot be reopened)</option>
            </select>
          </label>
        )}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="actions">
          <button disabled={busy}>
            {busy ? 'Saving…' : item ? 'Save changes' : 'Publish listing'}
          </button>
          <Link to="/dashboard">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
export default function EditListing() {
  const { id } = useParams();
  const resource = useResource(`/listings/${id}`);
  const { user } = useAuth();
  const item = resource.data?.item;
  return (
    <ResourceState resource={resource}>
      {item &&
        (item.owner.id !== user.id ? (
          <p className="notice">You can only edit your own listings.</p>
        ) : item.status === 'sold' ? (
          <p className="notice">Sold listings cannot be changed.</p>
        ) : (
          <Editor key={`${item.id}-${item.version}`} item={item} />
        ))}
    </ResourceState>
  );
}
