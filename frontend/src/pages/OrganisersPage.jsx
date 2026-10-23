import { useEffect, useState } from "react";

const URL = "https://jsonplaceholder.typicode.com/users?_limit=10";

export default function OrganisersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadOrganisers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const organisers = await response.json();
        if (!Array.isArray(organisers)) throw new Error("Invalid organisers response");
        organisers.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
        if (isActive) setData(organisers);
      } catch {
        if (isActive) setError("Could not load organisers");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadOrganisers();
    return () => {
      isActive = false;
    };
  }, [retryCount]);

  if (loading) return (
    <main className="page-shell">
      <PageIntro />
      <p className="loading-label" role="status">Loading organisers...</p>
      <div className="organiser-grid skeleton-grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => <div className="organiser-skeleton" key={index}><span /><div><i /><i /><i /></div></div>)}
      </div>
    </main>
  );
  if (error) {
    return (
      <main className="page-shell">
        <PageIntro />
        <div className="error-state"><span className="error-icon" aria-hidden="true">!</span><div><h2>We couldn’t reach the organisers.</h2><p role="alert">{error}</p><button className="button" onClick={() => setRetryCount((count) => count + 1)}>Retry <span aria-hidden="true">↻</span></button></div></div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <PageIntro count={data.length} />
      {data.length ? <div className="organiser-grid">
        {data.map((o) => (
          <article className="organiser-card" key={o.id}>
            <span className="avatar" aria-hidden="true">{o.name?.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
            <div><span className="organiser-name">{o.name}</span><span className="organiser-company">{o.company?.name ?? "Campus organiser"}</span><a className="organiser-email" href={`mailto:${o.email}`}>{o.email}</a></div>
          </article>
        ))}
      </div> : <div className="empty-state organiser-empty"><strong>No organisers to show yet</strong><span>Check back soon for the people behind upcoming events.</span></div>}
    </main>
  );
}

function PageIntro({ count }) {
  return <div className="page-intro"><p className="eyebrow">The people behind the moments</p><h1>Meet the organisers.</h1><p className="lead">Say hello to the people bringing campus together.</p>{Number.isInteger(count) && <span className="count-pill organiser-count">{count} organisers</span>}</div>;
}
