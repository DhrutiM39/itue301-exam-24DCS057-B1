import { Link, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import EventsPage from "./pages/EventsPage";
import RegisterPage from "./pages/RegisterPage";
import OrganisersPage from "./pages/OrganisersPage";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/organisers" element={<OrganisersPage />} />
      </Routes>
      <footer><div className="footer-inner"><Link className="footer-brand" to="/"><span className="brand-mark">E</span> EventHub</Link><span>Find your people. Find your thing.</span><span className="footer-copy">Made for campus life</span></div></footer>
    </>
  );
}
