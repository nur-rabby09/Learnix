import { useState, useEffect } from "react";
import "./App.css";
import "./StudyBuddy.css";
import "./StudySpaces.css";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import heroImg from "./assets/studySpace.jpg";
import { API_URL } from "./Config.js";

// Same pattern as heroImg above - a plain import per photo.
import austLibraryImg from "./assets/studySpaces/austlibrary.jpg";
import austCseImg from "./assets/studySpaces/austcse.jpg";
import campusCafeImg from "./assets/studySpaces/campuscafe.jpg";
import studyRoomImg from "./assets/studySpaces/studyroom.jpeg";
import rooftopImg from "./assets/studySpaces/rooftop.jpeg";
import cafeImg from "./assets/studySpaces/cafe.webp";

// Matches each space by its name (already in every document from
// MongoDB) to the photo imported above.
const PHOTO_BY_NAME = {
  "AUST Central Library": austLibraryImg,
  "CSE Building Lounge": austCseImg,
  "Campus Cafe": campusCafeImg,
  "Quiet Study Room": studyRoomImg,
  "Rooftop Lounge": rooftopImg,
  "Coffee Corner": cafeImg,
};

// Builds a Google Maps search link straight from THIS space's own
// name + location, so every card points to itself correctly.
// No API key needed - this just opens Maps' normal search page.
function getMapsUrl(space) {
  const query = `${space.name}, ${space.location}, Ahsanullah University of Science and Technology, Dhaka`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const CATEGORIES = ["All", "Library", "Cafe", "Lounge"];

function ReserveModal({ space, onClose, onConfirm }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    reservationDate: "",
    seats: "1",
  });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Name, phone number, and email are all required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.reservationDate.trim()) {
      setError("Please enter a reservation date.");
      return;
    }

    const seatsNum = Number(form.seats) || 1;
    if (seatsNum < 1 || seatsNum > space.seatsAvailable) {
      setError(`You can reserve between 1 and ${space.seatsAvailable} seat(s).`);
      return;
    }

    setSubmitting(true);
    const serverError = await onConfirm({ ...form, seats: String(seatsNum) });
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
            Reservation date
            <input
              type="text"
              placeholder="e.g. 2026-12-09"
              value={form.reservationDate}
              onChange={handleChange("reservationDate")}
            />
          </label>

          <label>
            Number of seats
            <input
              type="text"
              placeholder="e.g. 2"
              value={form.seats}
              onChange={handleChange("seats")}
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
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authNotice, setAuthNotice] = useState(false);

  // Same auth check used in Navbar.jsx - a logged-in user has a valid
  // session cookie, so GET /users/profile succeeds; otherwise it 401s.
  useEffect(() => {
    fetch(`${API_URL}/users/profile`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data);
        setAuthChecked(true);
      });
  }, []);

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

  const handleReserveClick = (space) => {
    if (!user) {
      setAuthNotice(true);
      setTimeout(() => setAuthNotice(false), 4000);
      return;
    }
    setReservingSpace(space);
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

    setSpaces((prev) =>
      prev.map((s) => (s._id === data.space._id ? data.space : s))
    );
    setReservingSpace(null);
    return null;
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

      {/* Page header */}
      <div className="sb-header">
        <div>
          <h1>Study Spaces</h1>
          <p>See where seats are open right now.</p>
        </div>
      </div>
      {loadError && <div className="ss-confirm-banner ss-error-banner">{loadError}</div>}
      {authNotice && (
        <div className="auth-banner-wrap">
          <span className="auth-banner-pill">Please log in to reserve a seat.</span>
        </div>
      )}

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
              <img
                className="sb-card-photo"
                src={PHOTO_BY_NAME[space.name]}
                alt={space.name}
              />

              <h3 className="sb-card-title">{space.name}</h3>
              <p className="sb-card-desc">{space.location}</p>

              {/* Opens Google Maps in a new tab, searching for this
                  exact space's name + location */}
              <a
                href={getMapsUrl(space)}
                target="_blank"
                rel="noopener noreferrer"
                className="sb-map-link"
                onClick={(e) => e.stopPropagation()}
              >
                📍 View on Google Maps
              </a>

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
                  onClick={() => handleReserveClick(space)}
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