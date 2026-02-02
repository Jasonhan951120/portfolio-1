import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import Facilities from './components/Facilities';
import Reviews from './components/Reviews';
import Team from './components/Team';
import Pricing from './components/Pricing';
import Booking from './components/Booking';
import Location from './components/Location';
import Footer from './components/Footer';
import ResultsTimeline from './components/ResultsTimeline';
import CinematicIntro from './components/CinematicIntro';

const App: React.FC = () => {
  return (
    <div className="font-sans text-darkText bg-page min-h-screen selection:bg-smile-mid selection:text-black">
      <Navbar />
      <div id="home">
        <Hero />
      </div>
      <Stats />
      <div id="services">
        <Services />
      </div>
      <Facilities />
      <CinematicIntro />
      <ResultsTimeline />
      <div id="reviews">
        <Reviews />
      </div>
      <div id="doctors">
        <Team />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="booking">
        <Booking />
      </div>
      <div id="location">
        <Location />
      </div>
      <Footer />
    </div>
  );
};

export default App;