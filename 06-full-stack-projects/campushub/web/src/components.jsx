import { Link } from 'react-router-dom';
export const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
export function ItemArt({ category = 'books' }) {
  return (
    <div className={`item-art ${category}`} role="img" aria-label={`${category} illustration`}>
      {category === 'books' ? (
        <div className="book">
          <span>
            THE NEXT
            <br />
            CHAPTER
          </span>
          <i />
        </div>
      ) : category === 'electronics' ? (
        <div className="headphones">
          <i />
          <b />
        </div>
      ) : (
        <div className="lamp">
          <i />
          <b />
          <em />
        </div>
      )}
    </div>
  );
}
export function ListingCard({ item, manage = false }) {
  return (
    <article className="listing-card">
      <Link to={`/listings/${item.id}`} aria-label={`View ${item.title}`}>
        <ItemArt category={item.category} />
      </Link>
      <div className="card-body">
        <div className="row">
          <span className="eyebrow">{item.category}</span>
          <span className={`status ${item.status}`}>{item.status}</span>
        </div>
        <h3>
          <Link to={`/listings/${item.id}`}>{item.title}</Link>
        </h3>
        <div className="row">
          <strong className="price">{money(item.price)}</strong>
          <span className="muted">{item.condition.replace('-', ' ')}</span>
        </div>
        <p className="location">↗ {item.location}</p>
        {manage && item.status !== 'sold' && (
          <Link className="text-link" to={`/listings/${item.id}/edit`}>
            Manage listing →
          </Link>
        )}
      </div>
    </article>
  );
}
export function ResourceState({ resource, children }) {
  if (resource.loading)
    return (
      <p className="notice" role="status">
        Loading listings…
      </p>
    );
  if (resource.error)
    return (
      <div className="notice error" role="alert">
        <p>{resource.error}</p>
        <button onClick={resource.retry}>Try again</button>
      </div>
    );
  return children;
}
export function Pagination({ data, onPage }) {
  if (data.pages < 2) return null;
  return (
    <nav className="pagination" aria-label="Listing pages">
      <button disabled={data.page <= 1} onClick={() => onPage(data.page - 1)}>
        Previous
      </button>
      <span>
        Page {data.page} of {data.pages}
      </span>
      <button disabled={data.page >= data.pages} onClick={() => onPage(data.page + 1)}>
        Next
      </button>
    </nav>
  );
}
