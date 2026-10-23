import { useRef, useState } from "react";
import { events } from "../data/events";
import { formatDate } from "../utils/format";

const formatFee = (amount) => `₹${amount.toFixed(2)}`;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState(String(events[0]?.id ?? ""));
  const [regs, setRegs] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const nextRegistrationId = useRef(1);

  const selectedEvent = events.find((event) => String(event.id) === eventId);
  const registrationsForEvent = regs.filter((registration) => registration.eventId === eventId).length;
  const seatsLeft = selectedEvent ? Math.max(0, selectedEvent.seatsLeft - registrationsForEvent) : 0;
  const totalPayable = regs.reduce((total, registration) => total + registration.feePayable, 0);
  const discountApplies = email.trim().toLowerCase().endsWith("@charusat.edu.in");
  const estimatedFee = selectedEvent ? selectedEvent.fee * (discountApplies ? 0.8 : 1) : 0;

  const register = (event) => {
    event.preventDefault();
    const studentName = name.trim();
    const studentEmail = email.trim();
    if (!studentName || !studentEmail) return setFeedback({ type: "error", text: "Name and email are required" });
    if (!selectedEvent || seatsLeft === 0) return setFeedback({ type: "error", text: "Event is full" });

    const emailKey = studentEmail.toLowerCase();
    const emailRegistrations = regs.filter((registration) => registration.email.toLowerCase() === emailKey).length;
    if (emailRegistrations >= 3) return setFeedback({ type: "error", text: "Limit of 3 registrations reached" });

    const feePayable = emailKey.endsWith("@charusat.edu.in") ? selectedEvent.fee * 0.8 : selectedEvent.fee;
    setRegs((current) => [...current, {
      id: nextRegistrationId.current++, name: studentName, email: studentEmail,
      eventId, title: selectedEvent.title, feePayable,
    }]);
    setFeedback({ type: "success", text: "Registration added to your plans." });
    setName("");
    setEmail("");
  };

  const cancelRegistration = (id) => {
    setRegs((current) => current.filter((registration) => registration.id !== id));
    setFeedback({ type: "success", text: "Registration cancelled. Your seat is available again." });
  };

  return (
    <main className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">Your next campus memory</p>
        <h1>Save your spot.</h1>
        <p className="lead">Choose an event and tell us where to send your details. CHARUSAT students get 20% off.</p>
      </div>

      <section className="registration-layout" aria-label="Event registration">
        <div className="panel registration-panel">
          <div className="panel-heading"><span className="step-mark">01</span><div><h2>Your details</h2><p>Quick, easy, and you’re in</p></div></div>
          <form onSubmit={register}>
            <div className="form-grid">
              <div className="field full"><label htmlFor="student-name">Full name</label><input id="student-name" autoComplete="name" placeholder="e.g. Aanya Patel" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="field full"><label htmlFor="student-email">Email address</label><input id="student-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /><span className={`field-hint${discountApplies ? " discount-active" : ""}`}>{discountApplies ? "CHARUSAT student discount applied: 20% off" : "Use your @charusat.edu.in email for 20% off"}</span></div>
              <div className="field full"><label htmlFor="event-choice">Choose an event</label><select id="event-choice" value={eventId} onChange={(e) => { setEventId(e.target.value); setFeedback(null); }}>
                {events.map((event) => <option key={event.id} value={event.id}>{event.title} · {event.date}</option>)}
              </select></div>
            </div>
            {feedback && <p className={`form-feedback ${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>{feedback.text}</p>}
            <div className="form-footer"><span className="info-box"><span className="seat-dot" /> Seats left: <strong>{seatsLeft}</strong></span><button className="button" type="submit">Confirm registration <span aria-hidden="true">→</span></button></div>
          </form>
        </div>

        <aside className="booking-summary" aria-live="polite">
          <p className="summary-kicker">YOUR SELECTION</p>
          <h2>Event summary</h2>
          {selectedEvent ? <>
            <span className={`summary-category category-${selectedEvent.category}`}>{selectedEvent.category}</span>
            <h3>{selectedEvent.title}</h3>
            <p className="summary-date">{formatDate(selectedEvent.date)}</p>
            <div className="summary-line"><span>Seats available</span><strong>{seatsLeft}</strong></div>
            <div className="summary-line"><span>Entry fee</span><strong>{selectedEvent.fee === 0 ? "Free" : formatFee(selectedEvent.fee)}</strong></div>
            {discountApplies && <div className="summary-discount"><span>Student discount</span><strong>−20%</strong></div>}
            <div className="summary-total"><span>Your price</span><strong>{selectedEvent.fee === 0 ? "Free" : formatFee(estimatedFee)}</strong></div>
          </> : <p className="summary-empty">Choose an event to see its details.</p>}
          <p className="summary-note"><span className="lock-mark" aria-hidden="true">✓</span> Your registration stays on this page for this session.</p>
        </aside>
      </section>

      <section className="registrations" aria-label="Your registrations">
        <div className="registrations-heading"><div><p className="eyebrow">Your campus plans</p><h2>My registrations</h2></div><span className="count-pill">{regs.length} {regs.length === 1 ? "booking" : "bookings"}</span></div>
        {regs.length === 0 ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">+</span><strong>Your plans start here</strong><span>Your registrations will appear here once you reserve a seat.</span></div> : regs.map((registration) => (
          <article className="registration-row" key={registration.id}>
            <div><span className="registration-name">{registration.name}</span><span className="registration-event">{registration.title}</span></div>
            <div className="registration-actions"><strong>{formatFee(registration.feePayable)}</strong><button className="button secondary" type="button" onClick={() => cancelRegistration(registration.id)}>Cancel</button></div>
          </article>
        ))}
        <div className="total-bar"><span>Total payable:</span><span>{formatFee(totalPayable)}</span></div>
      </section>
    </main>
  );
}
