/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useCarbonFootprint } from 'react-carbon-footprint';

import App from './App.jsx'
import Login from './login.jsx';
import Signup from './Signup.jsx';
import StudySpaces from './StudySpaces.jsx';
import StudyBuddy from './StudyBuddy.jsx';
import Accessories from './Accessories.jsx';
import Profile from './Profile.jsx';

const SHOW_SECONDS = 3;

// Small box that shows the carbon footprint for a few seconds, then hides
function CarbonBox() {
  const [gCO2, bytesTransferred] = useCarbonFootprint();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), SHOW_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '13px',
        zIndex: 1000,
      }}
    >
      <strong>Carbon Footprint</strong>
      <p style={{ margin: '4px 0' }}>Data: {(bytesTransferred / 1024).toFixed(1)} KB</p>
      <p style={{ margin: '4px 0' }}>CO2: {gCO2.toFixed(4)} grams</p>
    </div>
  );
}

// A new key on every page makes the box pop up again for each page the user opens
function CarbonFootprintDisplay() {
  const location = useLocation();

  return <CarbonBox key={location.pathname} />;
}

window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  //e.returnValue = '';
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/study-spaces" element={<StudySpaces />} />
        <Route path="/study-buddy" element={<StudyBuddy />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <CarbonFootprintDisplay />
    </BrowserRouter>
  </StrictMode>
)