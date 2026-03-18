import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

const socialLinks = [
  { 
    name: 'GitHub', 
    icon: Github, 
    href: 'https://github.com/eurusfox-24' 
  },
  { 
    name: 'LinkedIn', 
    icon: Linkedin, 
    href: 'https://www.linkedin.com/in/min-set-ko-4342121b6' 
  },
  { 
    name: 'Email', 
    icon: Mail, 
    href: 'mailto:minnsetko@gmail.com' 
  },
];

const quickLinks = [
  { name: 'Projects', href: '#projects' },
  { name: 'Homelab', href: '#homelab' },
  { name: 'Certifications', href: '#certifications' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative py-12 lg:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-black">
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/30 to-transparent" />
      </div>

      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <h3 className="font-heading text-xl font-bold text-white">Min Set Ko</h3>
              <p className="font-mono text-xs text-white/40 mt-1">Security Analyst Trainee</p>
            </div>
            
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              From Homelab to Enterprise: Securing the future of Cloud, AI, and Network infrastructure. 
            </p>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  // Improved logic to ensure external links open in new tab
                  target={link.name === 'Email' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:border-cyber-green/50 hover:bg-cyber-green/10 transition-all duration-300 group"
                  aria-label={link.name}
                >
                  <link.icon className="w-4 h-4 text-white/60 group-hover:text-cyber-green transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-sm text-white/40 tracking-wider">NAVIGATION</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/60 hover:text-cyber-green transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="/cv.pdf"
                  download="Min_Set_Ko_CV.pdf"
                  className="text-white/60 hover:text-cyber-green transition-colors duration-300 text-sm"
                >
                  Download CV
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-mono text-sm text-white/40 tracking-wider">CONTACT</h4>
            <div className="space-y-2">
              <p className="text-white/50 text-sm">
                Open to opportunities in Cybersecurity and Enterprise Networking roles.
              </p>
              <a
                href="mailto:minnsetko@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-green/10 border border-cyber-green/30 rounded-lg text-cyber-green font-mono text-sm hover:bg-cyber-green/20 transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/30">
            © {new Date().getFullYear()} Min Set Ko. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:border-cyber-green/50 hover:bg-cyber-green/10 transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 text-white/60 group-hover:text-cyber-green transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
}