import { useState } from "react";
import "./App.css";
import "./StudyBuddy.css";
import "./Accessories.css";
import heroImg from "./assets/accessories.jpg";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

const CATEGORIES = ["All", "Calculators", "Chargers", "Books", "Other"];

const ITEMS = [
  { name: "Scientific Calculator", owner: "Rafi H.", category: "Calculators", available: true },
  { name: "Phone Charger", owner: "Sarah K.", category: "Chargers", available: true },
  { name: "Calculus Textbook", owner: "Meena T.", category: "Books", available: false },
  { name: "Laptop Charger", owner: "Arif K.", category: "Chargers", available: true },
  { name: "Graph Calculator", owner: "Nabila S.", category: "Calculators", available: false },
  { name: "Umbrella", owner: "Tanvir A.", category: "Other", available: true },
];

function Accessories() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? ITEMS
      : ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div>
      <Navbar active="Accessories" />

      {/* Hero banner with background image and quote */}
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

      {/* Page header, styled like Study Buddy */}
      <div className="sb-header">
        <div>
          <h1>Share Accessories</h1>
          <p>Borrow or lend items with students nearby.</p>
        </div>
        <button className="btn-solid sb-create-btn">+ List an Item</button>
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

      {/* Items feed */}
      <div className="sb-feed">
        <div className="sb-grid">
          {filteredItems.map((item) => (
            <div className="sb-card" key={item.name}>
              <h3 className="sb-card-title">{item.name}</h3>
              <p className="sb-card-desc">Shared by {item.owner}</p>

              <div className="sb-meta">
                <span className={item.available ? "acc-status available" : "acc-status borrowed"}>
                  {item.available ? "Available" : "Borrowed"}
                </span>
              </div>

              <div className="sb-contact">
                <button className="btn-solid sb-interested-btn" disabled={!item.available}>
                  Request
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

export default Accessories;