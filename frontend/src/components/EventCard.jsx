import { formatDate, formatDuration } from "../utils/format";

export default function EventCard({ title, date, category, seatsLeft, fee, durationMin }) {
  const isFull = seatsLeft === 0;
  return (
    <article className={`card${isFull ? " is-full" : ""}`}>
      <div className="card-top"><span className={`category category-${category}`}>{category}</span>{fee === 0 && <span className="free-badge">Free entry</span>}</div>
      <h3>{title}</h3>
      <p className="card-date"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M7.5 3v4M16.5 3v4M4 9.5h16" /></svg>{formatDate(date)}</p>
      <div className="card-details">
        <div><span className="detail-label">Duration</span><span className="detail-value">{durationMin == null ? "Not specified" : formatDuration(durationMin)}</span></div>
        <div><span className="detail-label">Entry fee</span><span className="detail-value">{fee === 0 ? "Free" : `₹${Number(fee).toFixed(2)}`}</span></div>
      </div>
      <div className={`seat-status${isFull ? " full" : ""}`}><span className="seat-indicator" />{isFull ? "Full" : `${seatsLeft} seats left`}</div>
    </article>
  );
}
