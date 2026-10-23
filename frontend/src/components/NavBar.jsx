import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="EventHub home"><span className="brand-mark">E</span><span>Event<span className="brand-light">Hub</span></span></Link>
        <button
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
        <nav id="primary-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          <NavLink end to="/" onClick={closeMenu} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Events</NavLink>
          <NavLink to="/register" onClick={closeMenu} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Register</NavLink>
          <NavLink to="/organisers" onClick={closeMenu} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Organisers</NavLink>
        </nav>
      </div>
    </header>
  );
}
