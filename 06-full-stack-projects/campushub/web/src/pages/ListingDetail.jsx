import { Link, useParams } from 'react-router-dom';
import { useResource } from '../useResource.js';
import { useAuth } from '../AuthContext.jsx';
import { ResourceState, ItemArt, money } from '../components.jsx';
export default function ListingDetail() {
  const { id } = useParams();
  const resource = useResource(`/listings/${id}`);
  const { user } = useAuth();
  const item = resource.data?.item;
  return (
    <section className="page">
      <Link to="/" className="text-link">
        ← Back to all finds
      </Link>
      <ResourceState resource={resource}>
        {item && (
          <div className="detail-grid">
            <ItemArt category={item.category} />
            <div>
              <p className="eyebrow">
                {item.category} / {item.condition.replace('-', ' ')}
              </p>
              <h1>{item.title}</h1>
              <p className="detail-price">{money(item.price)}</p>
              <span className={`status ${item.status}`}>{item.status}</span>
              <p className="description">{item.description}</p>
              <dl>
                <dt>Pickup area</dt>
                <dd>{item.location}</dd>
                <dt>Listed by</dt>
                <dd>{item.owner.name}</dd>
              </dl>
              {user?.id === item.owner.id && item.status !== 'sold' && (
                <Link className="button" to={`/listings/${id}/edit`}>
                  Manage listing
                </Link>
              )}
              <p className="notice">
                This portfolio demo supports listing management. Contact, payments, and order
                fulfilment are not implemented.
              </p>
            </div>
          </div>
        )}
      </ResourceState>
    </section>
  );
}
