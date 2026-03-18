import { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';

const navLinks = [
  { name: 'Projects', href: '#projects' },
  { name: 'Homelab', href: '#homelab' },
  { name: 'Certifications', href: '#certifications' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    navLinks.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Navigation - Shows on scroll */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          isScrolled
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="glass rounded-full px-2 py-2 flex items-center gap-1 shadow-card">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 py-2 border-r border-white/10">
            <span className="font-mono text-sm text-white/80">MSK</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`relative px-4 py-2 text-xs font-mono tracking-wider transition-all duration-300 rounded-full ${
                  activeSection === link.href.slice(1)
                    ? 'text-cyber-green bg-cyber-green/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CV Download */}
          <a
            href="./cv/Min_Set_Ko_CV.pdf"
            download="Min_Set_Ko_CV.pdf"
            className="flex items-center gap-2 px-3 py-2 ml-1 bg-cyber-green/10 hover:bg-cyber-green/20 text-cyber-green rounded-full transition-all duration-300 border border-cyber-green/30 hover:border-cyber-green/50"
          >
            <Download className="w-3 h-3" />
            <span className="text-xs font-mono hidden sm:block">CV</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-cyber-black/98 backdrop-blur-xl transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="text-xl font-heading text-white/80 hover:text-cyber-green transition-colors"
            >
              {link.name}
            </button>
          ))}
          <a
            href="./cv/Min_Set_Ko_CV.pdf"
            download="Min_Set_Ko_CV.pdf"
            className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-cyber-green/10 text-cyber-green rounded-full border border-cyber-green/30"
          >
            <Download className="w-4 h-4" />
            <span className="font-mono text-sm">Download CV</span>
          </a>
        </div>
      </div>

      {/* Static Navigation for Hero Section */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <span className="font-mono text-xs sm:text-sm text-white/40">Min Set Ko</span>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-xs font-mono text-white/40 hover:text-cyber-green transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
          <a
            href="./cv/Min_Set_Ko_CV.pdf"
            download="Min_Set_Ko_CV.pdf"
            className="flex items-center gap-1.5 text-xs font-mono text-cyber-green/60 hover:text-cyber-green transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CV</span>
          </a>
        </div>
      </div>
    </>
  );
}
