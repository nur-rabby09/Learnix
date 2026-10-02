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

const EMPTY_REQUEST_FORM = {
  phone: "",
  location: "",
};

function Accessories() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [myRequests, setMyRequests] = useState({});

  const [guestMessage, setGuestMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [requestTarget, setRequestTarget] = useState(null);
  const [requestForm, setRequestForm] = useState(EMPTY_REQUEST_FORM);
  const [requestError, setRequestError] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  const [listItem, setListItem] = useState(null);
  const [requestList, setRequestList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [responding, setResponding] = useState(false);

  const isLoggedIn = Boolean(currentUser);

  const fetchItems = () => {
    fetch(`${API_URL}/accessories`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setItems(data))
      .finally(() => setLoadingItems(false));
  };

  const fetchMyRequests = () => {
    fetch(`${API_URL}/accessories/my-requests`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const statusById = {};
        for (const entry of data) {
          statusById[entry.accessoryId] = entry.status;
        }
        setMyRequests(statusById);
      });
  };

  useEffect(() => {
    fetch(`${API_URL}/users/profile`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setCurrentUser(data);
        setCheckingAuth(false);
        if (data) {
          fetchMyRequests();
        }
      });
    fetchItems();
  }, []);

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

  const askDelete = (item) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    const itemId = deleteTarget._id;
    setDeleting(true);

    try {
      const response = await fetch(`${API_URL}/accessories/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setItems(items.filter((item) => item._id !== itemId));
      }
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const openRequestForm = (item) => {
    setRequestError("");
    setRequestForm(EMPTY_REQUEST_FORM);
    setRequestTarget(item);
  };

  const closeRequestForm = () => {
    setRequestTarget(null);
  };

  const handleRequestFormChange = (e) => {
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestError("");
    setRequestSubmitting(true);
    const itemId = requestTarget._id;

    try {
      const response = await fetch(`${API_URL}/accessories/${itemId}/requests`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setRequestError(data.error || "Something went wrong");
        setRequestSubmitting(false);
        return;
      }

      setMyRequests({ ...myRequests, [itemId]: "pending" });
      setRequestTarget(null);
      setRequestSubmitting(false);
    } catch {
      setRequestError("Something went wrong");
      setRequestSubmitting(false);
    }
  };

  const openRequestList = async (item) => {
    setListItem(item);
    setRequestList([]);
    setListError("");
    setLoadingList(true);

    try {
      const response = await fetch(`${API_URL}/accessories/${item._id}/requests`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setListError(data.error || "Something went wrong");
      } else {
        setRequestList(data);
      }
    } catch {
      setListError("Something went wrong");
    }

    setLoadingList(false);
  };

  const closeRequestList = () => {
    setListItem(null);
  };

  const answerRequest = async (requestId, status) => {
    const itemId = listItem._id;
    setListError("");
    setResponding(true);

    try {
      const response = await fetch(
        `${API_URL}/accessories/${itemId}/requests/${requestId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setListError(data.error || "Something went wrong");
      } else {
        setRequestList(data);
        if (status === "accepted") {
          setItems(
            items.map((item) =>
              item._id === itemId ? { ...item, available: false } : item,
            ),
          );
        }
      }
    } catch {
      setListError("Something went wrong");
    }

    setResponding(false);
  };

  const renderActions = (item) => {
    if (!isLoggedIn) {
      return null;
    }

    if (item.createdBy === currentUser._id) {
      return (
        <div className="acc-actions">
          <button
            className="btn-solid sb-delete-btn"
            onClick={() => openRequestList(item)}
          >
            Request list
          </button>
          <button
            className="btn-outline sb-delete-btn"
            onClick={() => askDelete(item)}
          >
            Delete
          </button>
        </div>
      );
    }

    const myStatus = myRequests[item._id];

    if (!item.available) {
      return (
        <div className="acc-actions">
          <button className="btn-solid sb-interested-btn" disabled>
            {myStatus === "accepted" ? "Accepted" : "N/A"}
          </button>
        </div>
      );
    }

    if (myStatus === "pending") {
      return (
        <div className="acc-actions">
          <button className="btn-solid sb-interested-btn" disabled>
            Requested
          </button>
        </div>
      );
    }

    if (myStatus === "declined") {
      return (
        <div className="acc-actions">
          <button className="btn-solid sb-interested-btn" disabled>
            Declined
          </button>
        </div>
      );
    }

    return (
      <div className="acc-actions">
        <button
          className="btn-solid sb-interested-btn"
          onClick={() => openRequestForm(item)}
        >
          Request
        </button>
      </div>
    );
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
                  <span className={item.available ? "acc-status available" : "acc-status borrowed"}>
                    {item.available ? "Available" : "Not available"}
                  </span>
                  {renderActions(item)}
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

      {deleteTarget && (
        <div className="sb-modal-overlay" onClick={cancelDelete}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this item?</h3>
            <p className="acc-modal-text">
              Are you sure you want to delete "{deleteTarget.item}"? The post and all of its
              requests will be removed. This can't be undone.
            </p>
            <div className="sb-form-actions">
              <button type="button" className="btn-outline" onClick={cancelDelete}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-solid acc-confirm-delete-btn"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {requestTarget && (
        <div className="sb-modal-overlay" onClick={closeRequestForm}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Request {requestTarget.item}</h3>

            {requestError && <p className="sb-form-error">{requestError}</p>}

            <form onSubmit={handleRequestSubmit}>
              <label>Mobile number</label>
              <input
                type="text"
                name="phone"
                value={requestForm.phone}
                onChange={handleRequestFormChange}
                required
              />

              <label>Location</label>
              <input
                type="text"
                name="location"
                value={requestForm.location}
                onChange={handleRequestFormChange}
                required
              />

              <p className="sb-form-note">
                The owner will see these details in their request list.
              </p>

              <div className="sb-form-actions">
                <button type="button" className="btn-outline" onClick={closeRequestForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-solid" disabled={requestSubmitting}>
                  {requestSubmitting ? "Sending..." : "Send request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {listItem && (
        <div className="sb-modal-overlay" onClick={closeRequestList}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Requests for {listItem.item}</h3>

            {listError && <p className="sb-form-error">{listError}</p>}

            {loadingList ? (
              <p className="acc-list-message">Loading requests...</p>
            ) : requestList.length > 0 ? (
              <div>
                {requestList.map((request) => (
                  <div className="acc-request-row" key={request._id}>
                    <div className="acc-request-info">
                      <span className="acc-request-name">{request.name}</span>
                      <span>📞 {request.phone}</span>
                      <span>📍 {request.location}</span>
                    </div>

                    {request.status === "pending" ? (
                      <div className="acc-request-actions">
                        <button
                          type="button"
                          className="acc-accept-btn"
                          title="Accept"
                          aria-label="Accept request"
                          disabled={responding}
                          onClick={() => answerRequest(request._id, "accepted")}
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          className="acc-decline-btn"
                          title="Decline"
                          aria-label="Decline request"
                          disabled={responding}
                          onClick={() => answerRequest(request._id, "declined")}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className={`acc-request-status ${request.status}`}>
                        {request.status === "accepted" ? "Accepted" : "Declined"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              !listError && <p className="acc-list-message">No requests yet.</p>
            )}

            <div className="sb-form-actions">
              <button type="button" className="btn-outline" onClick={closeRequestList}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Accessories;