import { useState, useEffect } from "react";
import "./App.css";
import "./StudyBuddy.css";
import "./Accessories.css";
import heroImg from "./assets/accessories.jpg";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import { API_URL } from "./Config.js";

const EMPTY_FORM = {
  name: "",
  item: "",
  model: "",
  date: "",
  time: "",
  location: "",
  phone: "",
};

function Accessories() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const [guestMessage, setGuestMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = Boolean(currentUser);

  useEffect(() => {
    fetch(`${API_URL}/users/profile`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setCurrentUser(data);
        setCheckingAuth(false);
      });
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoadingItems(true);
    fetch(`${API_URL}/accessories`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setItems(data))
      .finally(() => setLoadingItems(false));
  };

  const handleAddItem = () => {
    if (!isLoggedIn) {
      setGuestMessage("Please log in to add an item.");
      return;
    }
    setFormError("");
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/accessories`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Something went wrong");
        setSubmitting(false);
        return;
      }

      setShowForm(false);
      setSubmitting(false);
      fetchItems();
    } catch {
      setFormError("Something went wrong");
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    const response = await fetch(`${API_URL}/accessories/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      setItems(items.filter((item) => item._id !== itemId));
    }
  };

  return (
    <div>
      <Navbar active="Accessories" />

      <div
        className="sb-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${heroImg})`,
        }}
      >
        <h1>
          Everything you need, <span className="sb-highlight">shared by someone nearby</span>
        </h1>
        <p>Borrow a calculator, a charger, or a textbook — no need to buy what someone already has.</p>
      </div>

      <div className="sb-header">
        <div>
          <h1>Share Accessories</h1>
          <p>Borrow or lend items with students nearby.</p>
        </div>
        <div className="sb-header-actions">
          {guestMessage && <span className="sb-guest-message">{guestMessage}</span>}
          <button className="btn-solid sb-create-btn" onClick={handleAddItem}>
            + Add an item
          </button>
        </div>
      </div>

      <div className="sb-feed">
        {checkingAuth || loadingItems ? (
          <p className="sb-status-text">Loading items...</p>
        ) : items.length > 0 ? (
          <div className="sb-grid">
            {items.map((item) => (
              <div className="sb-card" key={item._id}>
                <h3 className="sb-card-title">{item.item}</h3>
                <p className="sb-card-desc">Shared by {item.name}</p>
                <p className="sb-card-desc">Model: {item.model}</p>

                <div className="sb-meta">
                  <span>📅 {item.date}</span>
                  <span>🕒 {item.time}</span>
                  <span>📍 {item.location}</span>
                </div>

                <div className="sb-contact">
                  <div className="sb-contact-info">
                    <span className="sb-phone">📞 {item.phone}</span>
                  </div>
                  <span className="acc-status available">Available</span>
                  {isLoggedIn && currentUser && item.createdBy === currentUser._id && (
                    <button
                      className="btn-outline sb-delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  )}
                  {isLoggedIn && currentUser && item.createdBy !== currentUser._id && (
                    <button className="btn-solid sb-interested-btn">Request</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sb-empty">
            <p>No items posted yet — be the first to add one!</p>
            <button className="btn-solid" onClick={handleAddItem}>
              + Add an item
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="sb-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add an Item</h3>

            {formError && <p className="sb-form-error">{formError}</p>}

            <form onSubmit={handleFormSubmit}>
              <label>Your name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />

              <label>Item</label>
              <input
                type="text"
                name="item"
                placeholder="e.g. Scientific Calculator"
                value={formData.item}
                onChange={handleFormChange}
                required
              />

              <label>Model</label>
              <input
                type="text"
                name="model"
                placeholder="e.g. Casio fx-991EX"
                value={formData.model}
                onChange={handleFormChange}
                required
              />

              <label>Date</label>
              <input
                type="text"
                name="date"
                placeholder="e.g. 25/12/2025"
                value={formData.date}
                onChange={handleFormChange}
                required
              />

              <label>Time</label>
              <input
                type="text"
                name="time"
                placeholder="e.g. 6:00 PM"
                value={formData.time}
                onChange={handleFormChange}
                required
              />

              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                required
              />

              <label>Phone number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                required
              />

              <div className="sb-form-actions">
                <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-solid" disabled={submitting}>
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Accessories;