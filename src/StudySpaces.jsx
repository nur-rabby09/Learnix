import { useState, useEffect } from "react";
import "./App.css";
import "./StudyBuddy.css";
import "./StudySpaces.css";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import heroImg from "./assets/studySpace.jpg";
import { API_URL } from "./Config.js";

const CATEGORIES = ["All", "Library", "Cafe", "Lounge"];

// A blank placeholder card shown where a space's photo will eventually
// live. Swap this for a real <img src={space.photo}> once Cloudinary
// image uploads are wired up on the "List a Space" (developer/admin) side.
function PhotoPlaceholder() {
  return (
    <div className="sb-card-photo sb-card-photo--empty">
      <span>Photo coming soon</span>
    </div>
  );
}

function ReserveModal({ space, onClose, onConfirm }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", seats: 1, reservationDate: "" });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.reservationDate) {
      setError("Name, phone number, email, and reservation date are all required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const seatsRequested = Number(form.seats) || 1;
    if (seatsRequested < 1 || seatsRequested > space.seatsAvailable) {
      setError(`You can reserve between 1 and ${space.seatsAvailable} seat(s).`);
      return;
    }

    setSubmitting(true);
    const serverError = await onConfirm({ ...form, seats: seatsRequested });
    setSubmitting(false);
    if (serverError) setError(serverError);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        <h2 className="modal-title">Reserve at {space.name}</h2>
        <p className="modal-subtitle">{space.location} · {space.seatsAvailable} seat(s) open</p>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Full name
            <input type="text" value={form.name} onChange={handleChange("name")} placeholder="Your name" />
          </label>

          <label>
            Phone number
            <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="01XXXXXXXXX" />
          </label>

          <label>
            Email
            <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" />
          </label>

          <label>
            Number of seats
            <input
              type="number"
              min="1"
              max={space.seatsAvailable}
              value={form.seats}
              onChange={handleChange("seats")}
            />
          </label>
          <label>
            Reservation date
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.reservationDate}
              onChange={handleChange("reservationDate")}
            />
          </label>

          {error && <p className="modal-error">{error}</p>}

          <button type="submit" className="btn-solid modal-submit" disabled={submitting}>
            {submitting ? "Reserving..." : "Confirm Reservation"}
          </button>
        </form>
      </div>
    </div>
  );
}

function StudySpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [reservingSpace, setReservingSpace] = useState(null);
  const [confirmedMessage, setConfirmedMessage] = useState("");

  useEffect(() => {
    const loadSpaces = async () => {
      try {
        const response = await fetch(`${API_URL}/study-spaces`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load study spaces");
        const data = await response.json();
        setSpaces(data);
      } catch (err) {
        setLoadError("Could not load study spaces. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    loadSpaces();
  }, []);

  const filteredSpaces = spaces.filter((space) => {
    const matchesCategory = activeCategory === "All" || space.category === activeCategory;
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleReserveConfirm = async (formValues) => {
    const response = await fetch(
      `${API_URL}/study-spaces/${reservingSpace._id}/reserve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formValues),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return data.error || "Something went wrong";
    }

    // Update this space's seat count in place with what the server confirmed.
    setSpaces((prev) =>
      prev.map((s) => (s._id === data.space._id ? data.space : s))
    );
     const formattedDate = new Date(formValues.reservationDate).toLocaleDateString(undefined, {
      month: "short", day: "numeric", year: "numeric",});
          setConfirmedMessage(`Reserved ${formValues.seats} seat(s) at ${reservingSpace.name} for ${formattedDate}.`);    setReservingSpace(null);
    setTimeout(() => setConfirmedMessage(""), 4000);
    return null; // no error
  };

  return (
    <div>
      <Navbar active="Study spaces" />

      {/* Hero banner with background image, quote, and search bar */}
      <div
        className="sb-hero ss-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${heroImg})`,
        }}
      >
        <h1>
          Find a seat, <span className="sb-highlight">not a headache</span>
        </h1>
        <p>Check real-time seat availability across libraries, cafes, and lounges.</p>
        <form className="sb-search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-solid">Search</button>
        </form>
      </div>

      {/* Page header - listing new spaces is developer-only (seeded/coded), not user-facing */}
      <div className="sb-header">
        <div>
          <h1>Study Spaces</h1>
          <p>See where seats are open right now.</p>
        </div>
      </div>

      {confirmedMessage && <div className="ss-confirm-banner">{confirmedMessage}</div>}
      {loadError && <div className="ss-confirm-banner ss-error-banner">{loadError}</div>}

      {/* Category filter */}
      <div className="acc-category-row">
        {CATEGORIES.map((category) => (
          <span
            key={category}
            className={activeCategory === category ? "acc-chip active" : "acc-chip"}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </span>
        ))}
      </div>

      {/* Spaces feed */}
      <div className="sb-feed">
        {loading && <p className="sb-empty">Loading study spaces...</p>}

        {!loading && !loadError && filteredSpaces.length === 0 && (
          <p className="sb-empty">No study spaces match your search.</p>
        )}

        <div className="sb-grid">
          {!loading && filteredSpaces.map((space) => (
            <div className="sb-card" key={space._id}>
              {space.photoUrl ? (
                <img className="sb-card-photo" src={space.photoUrl} alt={space.name} />
              ) : (
                <PhotoPlaceholder />
              )}

              <h3 className="sb-card-title">{space.name}</h3>
              <p className="sb-card-desc">{space.location}</p>

              <div className="sb-meta">
                <span
                  className={
                    space.seatsAvailable > 0 ? "acc-status available" : "acc-status borrowed"
                  }
                >
                  {space.seatsAvailable > 0
                    ? `${space.seatsAvailable} seats open`
                    : "Full"}
                </span>
                <span>Total capacity: {space.seatsTotal}</span>
              </div>

              <div className="sb-contact">
                <button
                  className="btn-solid sb-interested-btn"
                  disabled={space.seatsAvailable === 0}
                  onClick={() => setReservingSpace(space)}
                >
                  {space.seatsAvailable === 0 ? "Full" : "Reserve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {reservingSpace && (
        <ReserveModal
          space={reservingSpace}
          onClose={() => setReservingSpace(null)}
          onConfirm={handleReserveConfirm}
        />
      )}

      <Footer />
    </div>
  );
}

export default StudySpaces;