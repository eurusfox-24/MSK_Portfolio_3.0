import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import CurrentFocus from './sections/CurrentFocus';
import Projects from './sections/Projects';
import Certifications from './sections/Certifications';
import Homelab from './sections/Homelab';
import Experience from './sections/Experience';
import Archive from './sections/Archive';
import Footer from './sections/Footer';
import PrifinaChat from './components/PrifinaChat';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <CurrentFocus />
      <Certifications />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cyber-black text-white selection:bg-cyber-green/30 selection:text-cyber-green">
        <ScrollToTop />
        <Navigation />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/homelab" element={<Homelab />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/certifications" element={<Certifications />} />
          </Routes>
        </main>

        <Footer />
        <PrifinaChat />
      </div>
    </Router>
  );
}

export default App;
