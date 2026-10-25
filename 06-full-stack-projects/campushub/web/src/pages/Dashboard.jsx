import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useResource } from '../useResource.js';
import { ListingCard, ResourceState, Pagination } from '../components.jsx';
export default function Dashboard() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const resource = useResource(`/my/listings?${params.toString()}`);
  return (
    <section className="page">
      <div className="section-title">
        <div>
          <p className="eyebrow">YOUR LITTLE CORNER</p>
          <h1>Hello, {user.name}.</h1>
          <p className="muted">Keep track of what you’re passing forward.</p>
        </div>
        <Link className="button" to="/sell">
          Create a listing ↗
        </Link>
      </div>
      <ResourceState resource={resource}>
        {resource.data && (
          <>
            {resource.data.items.length ? (
              <div className="listing-grid">
                {resource.data.items.map((item) => (
                  <ListingCard key={item.id} item={item} manage />
                ))}
              </div>
            ) : (
              <div className="notice">
                <h2>Your first listing starts here.</h2>
                <p>That book or spare desk lamp could be someone else’s next find.</p>
                <Link to="/sell">Create a listing →</Link>
              </div>
            )}
            <Pagination data={resource.data} onPage={(page) => setParams({ page: String(page) })} />
          </>
        )}
      </ResourceState>
    </section>
  );
}
