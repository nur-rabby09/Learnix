import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Login from './login.jsx';
import Signup from './Signup.jsx';
import StudySpaces from './StudySpaces.jsx';
import StudyBuddy from './StudyBuddy.jsx';
import Accessories from './Accessories.jsx';
import Profile from './Profile.jsx';

// Global "leave site?" guard - registered once here so it applies no
// matter which page the user is currently on, not just Home. This only
// fires when the browser is actually about to unload the document (e.g.
// closing the tab, refreshing, or pressing Back past the very first
// history entry the app added) - it never fires for in-app navigation
// between routes, since the SPA doesn't reload the document for those.
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  e.returnValue = '';
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
    </BrowserRouter>
  </StrictMode>
)