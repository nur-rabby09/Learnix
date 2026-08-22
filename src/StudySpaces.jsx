import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "./StudyBuddy.css";
import "./StudySpaces.css";
import Footer from "./Footer.jsx";
import heroImg from "./assets/studySpace.jpg";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Study spaces", path: "/study-spaces" },
  { label: "Study buddy", path: "/study-buddy" },
  { label: "Accessories", path: "/accessories" },
];

const CATEGORIES = ["All", "Library", "Cafe", "Lounge"];

const SPACES = [
  { name: "AUST Central Library", location: "3rd Floor, Main Building", category: "Library", seatsAvailable: 12, seatsTotal: 40 },
  { name: "CSE Building Lounge", location: "Ground Floor, CSE Building", category: "Lounge", seatsAvailable: 0, seatsTotal: 20 },
  { name: "Campus Cafe", location: "Near West Gate", category: "Cafe", seatsAvailable: 5, seatsTotal: 15 },
  { name: "Quiet Study Room", location: "4th Floor, Library", category: "Library", seatsAvailable: 3, seatsTotal: 10 },
  { name: "Rooftop Lounge", location: "6th Floor, Academic Block", category: "Lounge", seatsAvailable: 8, seatsTotal: 25 },
  { name: "Coffee Corner", location: "1st Floor, Student Center", category: "Cafe", seatsAvailable: 0, seatsTotal: 12 },
];

function StudySpaces() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredSpaces = SPACES.filter((space) => {
    const matchesCategory = activeCategory === "All" || space.category === activeCategory;
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      {/* Top navbar */}
      <div className="navbar">
        <span className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Learnix
        </span>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <span
              key={item.label}
              className={item.label === "Study spaces" ? "active" : ""}
              onClick={() => item.path && navigate(item.path)}
            >
              {item.label}
            </span>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn-solid" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </div>
      </div>

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
        <button className="btn-solid sb-create-btn">+ List a Space</button>
      </div>

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
        <div className="sb-grid">
          {filteredSpaces.map((space) => (
            <div className="sb-card" key={space.name}>
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
                <button className="btn-solid sb-interested-btn" disabled={space.seatsAvailable === 0}>
                  Reserve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default StudySpaces;