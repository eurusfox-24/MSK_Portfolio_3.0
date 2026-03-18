import { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = '> Min Set Ko';
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Typewriter effect
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, []);

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-green/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-green/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-green/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
        {/* Changed to 12-column grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column - Identity (Now taking 7/12 of the space) */}
          <div className={`lg:col-span-7 space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-2">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                <span className="text-cyber-green">{typedText}</span>
                <span className="terminal-cursor" />
              </h1>
              <p className="font-heading text-lg sm:text-xl text-white/60 font-light tracking-wide">
                Security Analyst Trainee
              </p>
            </div>

            <div className="space-y-4 text-white/50 leading-relaxed max-w-2xl text-sm sm:text-base">
              <p>
                This website is a dedicated space to showcase my professional certifications, 
                hands-on technical projects, and homelab research. It documents my active 
                participation in the tech community through hackathons and continuous 
                experimentation with hardware and software integration.
              </p>
              <p className="text-sm text-white/40">
                While this portfolio highlights my independent and academic projects, my 
                practical work experience is detailed in full on my LinkedIn profile and 
                my downloadable CV.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={scrollToProjects}
                className="group px-5 py-2.5 bg-cyber-green text-cyber-black font-mono text-sm font-medium rounded-lg hover:bg-cyber-green-dim transition-all duration-300 flex items-center gap-2"
              >
                VIEW_PROJECTS
                <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-white/20 text-white/80 font-mono text-sm rounded-lg hover:border-cyber-green/50 hover:text-cyber-green transition-all duration-300"
              >
                LINKEDIN
              </a>
            </div>
          </div>

          {/* Right Column - Badge Card (Now taking 5/12 of the space) */}
          <div 
            className={`lg:col-span-5 relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative group max-w-md ml-auto"> {/* Added ml-auto and max-w to keep it neat */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-green/20 via-cyber-green/40 to-cyber-green/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative glass rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-cyber-green/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-mono text-xs text-white/40">tryhackme.com</span>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-cyber-black/50 py-6 px-2 flex items-center justify-center w-full">
                  <iframe
                    src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=884096"
                    style={{
                      border: 'none',
                      width: '329px',
                      height: '88px',
                    }}
                    scrolling="no"
                    loading="lazy"
                    title="TryHackMe Badge"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-white/50">Verified Profile</span>
                  <span className="font-mono text-xs text-cyber-green/60">ID: 884096</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-white/30 tracking-widest">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-cyber-green/50 to-transparent" />
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
