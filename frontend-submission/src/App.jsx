import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shorterner from './shorterner/Shorterner';
import Redirect from './redirect/Redirect';
import Statistics from './statistics/Statistics';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Shorterner />} />
      <Route path="/stats" element={<Statistics />} />
      <Route path="/:shortcode" element={<Redirect />} />
    </Routes>
  </Router>
);

export default App;
