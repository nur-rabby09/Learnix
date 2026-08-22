import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Login from './login.jsx';
import Signup from './Signup.jsx';
import StudySpaces from './StudySpaces.jsx';
import StudyBuddy from './StudyBuddy.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/study-spaces" element={<StudySpaces />} />
        <Route path="/study-buddy" element={<StudyBuddy />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)