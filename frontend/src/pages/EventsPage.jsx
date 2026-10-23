import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import { events as starterEvents } from "../data/events";
import { formatDate } from "../utils/format";

const API_URL = "/api/v1/catalog/events";

function eventIdentity(event) {
  const date = new Date(event.date);
  const dateKey = Number.isNaN(date.getTime()) ? String(event.date ?? "") : date.toISOString().slice(0, 10);
  return `${String(event.title ?? "").trim().toLocaleLowerCase()}|${dateKey}`;
}

function combineEvents(databaseEvents) {
  const byIdentity = new Map(starterEvents.map((event) => [eventIdentity(event), event]));
  databaseEvents.forEach((event) => byIdentity.set(eventIdentity(event), event));
  return [...byIdentity.values()].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    return (Number.isNaN(aDate) ? Infinity : aDate) - (Number.isNaN(bDate) ? Infinity : bDate);
  });
}

export default function EventsPage() {
  const [databaseEvents, setDatabaseEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const displayedEvents = combineEvents(databaseEvents);

  useEffect(() => {
    let isActive = true;

    async function loadEvents() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (!Array.isArray(result)) throw new Error("Invalid events response");
        if (isActive) setDatabaseEvents(result);
      } catch {
        if (isActive) setError("Could not load MongoDB events. Showing the starter events instead.");
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadEvents();
    return () => { isActive = false; };
  }, [retryCount]);

  const featuredEvent = displayedEvents[0];

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> Your campus, in full colour</p>
          <h1>Discover events.<br /><span>Create memories.</span></h1>
          <p className="lead">Find a new interest, meet your people, and make more of campus life. Your next great story starts here.</p>
          <div className="hero-actions"><a className="button" href="#upcoming-events">Explore events <span aria-hidden="true">↓</span></a><Link className="hero-secondary" to="/organisers">Meet the organisers <span aria-hidden="true">↗</span></Link></div>
          <div className="hero-proof"><span className="proof-avatars" aria-hidden="true"><i>H</i><i>C</i><i>S</i></span><span><strong>{displayedEvents.length} events to explore</strong><small>Tech, culture, sport and more</small></span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <span className="art-spark spark-one" /><span className="art-spark spark-two" />
          <div className="feature-card">
            <span className="feature-label"><span className="feature-dot" /> FROM YOUR CAMPUS</span>
            <span className="feature-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M7.5 3v4M16.5 3v4M4 9.5h16M8 13h3M8 16.5h6" /></svg></span>
            <strong>{featuredEvent?.title ?? "Campus events"}</strong>
            <span className="feature-date">{featuredEvent ? formatDate(featuredEvent.date) : "Discover something new"} {featuredEvent?.category && <><span>·</span> {featuredEvent.category}</>}</span>
            <span className="feature-cta">A good day starts here <span aria-hidden="true">↗</span></span>
          </div>
        </div>
      </section>

      <section className="events-section" aria-labelledby="upcoming-events">
        <div className="section-heading" id="upcoming-events"><div><p className="eyebrow">Pick your next adventure</p><h2>What’s happening</h2></div><span className="count-pill">{displayedEvents.length} events</span></div>
        {loading && <p className="api-notice loading-notice" role="status">Loading events from MongoDB…</p>}
        {error && <div className="api-notice error-notice" role="alert"><span>{error}</span><button type="button" className="retry-button" onClick={() => setRetryCount((count) => count + 1)}>Retry</button></div>}
        {!loading && !error && databaseEvents.length === 0 && <p className="api-notice empty-notice">No saved MongoDB events yet. Your starter events are shown below.</p>}
        {displayedEvents.length > 0 ? <div className="grid">
          {displayedEvents.map((event) => (
            <EventCard key={event.id} title={event.title} date={event.date} category={event.category}
              seatsLeft={event.seatsLeft} fee={event.fee} durationMin={event.durationMin} />
          ))}
        </div> : !loading && !error && <div className="empty-state"><strong>No events yet</strong><span>Check back soon for new campus events.</span></div>}
      </section>
    </main>
  );
}
