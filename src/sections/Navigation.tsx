import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Exp', href: '/experience' },
  { name: 'Projects', href: '/projects' },
  { name: 'Lab', href: '/homelab' },
  { name: 'Archive', href: '/archive' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Futuristic Floating Navigation */}
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 w-[95%] max-w-2xl ${
          isScrolled
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-100 translate-y-0 scale-105 sm:scale-100'
        }`}
      >
        <div className="relative group">
          {/* Cyberpunk Glow Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-green/0 via-cyber-green/30 to-cyber-green/0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative bg-black/60 backdrop-blur-2xl border border-cyber-green/30 p-1 flex items-center shadow-[0_0_30px_rgba(0,255,65,0.1)] overflow-hidden"
               style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
            
            {/* Animated Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyber-green/5 to-transparent h-1/2 w-full animate-scan opacity-20" />

            {/* Nav Links Container - Centered and Filling */}
            <div className="flex-1 flex items-center justify-around md:justify-evenly py-1 px-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    relative px-4 py-3 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.2em] transition-all duration-500 flex-1 text-center
                    ${isActive 
                      ? 'text-cyber-green font-bold glow-text' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {link.name}
                  <div className={`absolute bottom-1 left-1/4 right-1/4 h-0.5 bg-cyber-green transition-all duration-500 ${pathname === link.href ? 'opacity-100 shadow-[0_0_10px_#00ff41]' : 'opacity-0'}`} />
                </NavLink>
              ))}

              {/* Mobile Toggle (only shown on small screens) */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-cyber-green/60 hover:text-cyber-green transition-all duration-300"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Futuristic Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl transition-all duration-700 md:hidden flex flex-col items-center justify-center gap-8 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }} />

        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `
              text-4xl font-black tracking-[0.15em] transition-all duration-500 uppercase font-heading
              ${isActive 
                ? 'text-cyber-green glow-text scale-110' 
                : 'text-white/20 hover:text-white'}
            `}
          >
            {link.name}
          </NavLink>
        ))}

        
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="w-12 h-px bg-cyber-green/30 animate-pulse" />
          <span className="font-mono text-[10px] text-cyber-green/40 tracking-[0.5em] uppercase">System Online</span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </>
  );
}
