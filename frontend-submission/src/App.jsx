import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shorterner from './shorterner/Shorterner';
import Redirect from './redirect/Redirect';
import Statistics from './statistics/Statistics';
import Analytics from './analytics/Analytics';
import './App.css'; 
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Shorterner />} />
      <Route path="/stats" element={<Statistics />} />
      <Route path="/:shortcode" element={<Redirect />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  </Router>
);

export default App;
