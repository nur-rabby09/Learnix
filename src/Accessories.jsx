import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Accessories.css';
import Footer from './Footer.jsx';

const CATEGORIES = ['All', 'Calculators', 'Chargers', 'Books', 'Other'];

const ITEMS = [
  { name: 'Scientific Calculator', owner: 'Rafi H.', category: 'Calculators', available: true },
  { name: 'Phone Charger', owner: 'Sarah K.', category: 'Chargers', available: true },
  { name: 'Calculus Textbook', owner: 'Meena T.', category: 'Books', available: false },
  { name: 'Laptop Charger', owner: 'Arif K.', category: 'Chargers', available: true },
  { name: 'Graph Calculator', owner: 'Nabila S.', category: 'Calculators', available: false },
  { name: 'Umbrella', owner: 'Tanvir A.', category: 'Other', available: true },
];

function Accessories() {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const filteredItems = activeCategory === 'All'
    ? ITEMS
    : ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="accessories-page">
      <div className="navbar">
        <span className="logo" onClick={() => navigate('/')}>Learnix</span>
        <button className="btn-solid">List an Item</button>
      </div>

      <div className="accessories-wrapper">
        <h2 className="accessories-title">Share Accessories</h2>

        <div className="category-row">
          {CATEGORIES.map((category) => (
            <span
              key={category}
              className={activeCategory === category ? 'category-chip active' : 'category-chip'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="accessories-grid">
          {filteredItems.map((item) => (
            <div className="accessory-card" key={item.name}>
              <h3>{item.name}</h3>
              <p className="shared-by">Shared by {item.owner}</p>
              <span className={item.available ? 'status available' : 'status borrowed'}>
                {item.available ? 'Available' : 'Borrowed'}
              </span>
              <button className="btn-outline request-btn" disabled={!item.available}>
                Request
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Accessories;