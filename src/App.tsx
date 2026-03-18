import { useEffect, useState, useRef } from 'react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Homelab from './sections/Homelab';
import Certifications from './sections/Certifications';
import Footer from './sections/Footer';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen bg-cyber-black">
      {/* Progress Bar */}
      <div 
        className="progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <Projects />
        <Homelab />
        <Certifications />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Animated Background Component
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-black via-[#0d1117] to-cyber-black" />
      
      {/* Animated Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite',
        }}
      />
      
      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyber-green/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particleFloat ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      
      {/* Glow Orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 65, 0.1) 0%, transparent 70%)',
          animation: 'orbPulse 8s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 65, 0.08) 0%, transparent 70%)',
          animation: 'orbPulse 10s ease-in-out infinite reverse',
        }}
      />
      
      {/* Scan Lines */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px)',
        }}
      />

      {/* Custom Styles */}
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes particleFloat {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.2;
          }
          25% { 
            transform: translate(30px, -30px); 
            opacity: 0.6;
          }
          50% { 
            transform: translate(-20px, -50px); 
            opacity: 0.4;
          }
          75% { 
            transform: translate(40px, 20px); 
            opacity: 0.8;
          }
        }
        
        @keyframes orbPulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.2;
          }
          50% { 
            transform: scale(1.2); 
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
