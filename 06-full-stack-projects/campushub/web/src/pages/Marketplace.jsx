import { Link, useSearchParams } from 'react-router-dom';
import { useResource } from '../useResource.js';
import { ItemArt, ListingCard, ResourceState, Pagination } from '../components.jsx';
export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const resource = useResource(`/listings?${params.toString()}`);
  function change(key, value) {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  }
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow accent">LESS WASTE. MORE POSSIBILITY.</p>
          <h1>
            Good finds.
            <br />
            <em>Better campus.</em>
          </h1>
          <p className="hero-copy">
            Books for your next semester. Essentials for your first room. Give useful things a new
            chapter, right here on campus.
          </p>
          <div className="actions">
            <a className="button" href="#browse">
              Explore the marketplace <span>↗</span>
            </a>
            <Link className="text-link" to="/sell">
              Have something to pass on?
            </Link>
          </div>
          <div className="hero-note">
            <span className="round-icon">↻</span>
            <span>
              A small exchange.
              <br />
              <strong>A little less left behind.</strong>
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-caption">
            <span>THE CAMPUS EDIT</span>
            <span>01 / EVERYDAY FINDS</span>
          </div>
          <div className="hero-book">
            <ItemArt category="books" />
          </div>
          <div className="note-card">
            <span>Made for a second chapter.</span>
            <strong>Pass it forward.</strong>
          </div>
          <div className="circle-label">
            USE IT.
            <br />
            LOVE IT.
            <br />
            PASS IT ON.
          </div>
        </div>
      </section>
      <section className="market-section" id="browse">
        <div className="section-title">
          <div>
            <p className="eyebrow">THE NOTICEBOARD, REIMAGINED</p>
            <h2>Find your next useful thing.</h2>
          </div>
          <span className="muted">Browse locally. Choose thoughtfully.</span>
        </div>
        <form
          className="search-bar"
          onSubmit={(event) => {
            event.preventDefault();
            change('q', new FormData(event.currentTarget).get('search').trim());
          }}
        >
          <label className="sr-only" htmlFor="search">
            Search listings
          </label>
          <input
            id="search"
            name="search"
            type="search"
            key={params.get('q') || ''}
            defaultValue={params.get('q') || ''}
            placeholder="Try books, headphones, a desk lamp…"
            maxLength={80}
          />
          <button>Search</button>
        </form>
        <div className="filters">
          <div className="chips" aria-label="Categories">
            {[
              ['', 'All finds'],
              ['books', 'Books'],
              ['electronics', 'Electronics'],
              ['essentials', 'Room essentials'],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={(params.get('category') || '') === value}
                onClick={() => change('category', value)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="status-filter">
            Status
            <select
              value={params.get('status') || ''}
              onChange={(e) => change('status', e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="active">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </label>
        </div>
        <ResourceState resource={resource}>
          {resource.data && (
            <>
              <p className="result-count">
                {resource.data.total} {resource.data.total === 1 ? 'listing' : 'listings'} found
              </p>
              {resource.data.items.length ? (
                <div className="listing-grid">
                  {resource.data.items.map((item) => (
                    <ListingCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="notice">
                  <h3>No finds just yet.</h3>
                  <p>Try another search or be the first to add a listing.</p>
                  <Link to="/sell">Create a listing →</Link>
                </div>
              )}
              <Pagination data={resource.data} onPage={(page) => change('page', String(page))} />
            </>
          )}
        </ResourceState>
      </section>
      <section className="closing-note">
        <span className="eyebrow">START A SMALL CIRCLE</span>
        <h2>
          Your old favourite.
          <br />
          Someone’s new beginning.
        </h2>
        <Link className="button light" to="/sell">
          List something useful ↗
        </Link>
      </section>
    </>
  );
}
