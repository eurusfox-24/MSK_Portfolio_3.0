import { useState } from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import cmsSnapshot from '../data/cms-data.json';

interface ProfileItem {
  name: string;
  role: string;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  cvUrl: string;
}

interface CmsSnapshot {
  profile: ProfileItem;
}

function getInitialProfile(): ProfileItem | null {
  return (cmsSnapshot as unknown as CmsSnapshot).profile || null;
}

export default function Footer() {
  const [profile] = useState<ProfileItem | null>(getInitialProfile());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!profile) return null;

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: profile.githubUrl
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: profile.linkedinUrl
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:${profile.email}`
    },
  ];

  return (
    <footer className="relative py-20 bg-cyber-black overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight">Get in Touch</h3>
            <p className="text-white/40 max-w-md mx-auto text-sm sm:text-base leading-relaxed font-mono">
              Open to opportunities in Cybersecurity and Enterprise Networking. 
              Let's connect and build something secure together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={`mailto:${profile.email}`}
              className="group relative px-10 py-4 bg-cyber-green text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] hover:scale-105"
            >
              Send Message
            </a>
            
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.name === 'Email' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:border-cyber-green/50 hover:bg-cyber-green/10 transition-all duration-300 group"
                  aria-label={link.name}
                >
                  <link.icon className="w-5 h-5 text-white/40 group-hover:text-cyber-green transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.4em]">
                © {new Date().getFullYear()} {profile.name} // SYSTEM SECURED
              </p>
            </div>
            
            <button
              onClick={scrollToTop}
              className="group flex flex-col items-center gap-2 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyber-green/50 group-hover:bg-cyber-green/5 transition-all">
                <ArrowUp className="w-4 h-4 text-white/20 group-hover:text-cyber-green transition-colors" />
              </div>
              <span className="font-mono text-[8px] text-white/10 uppercase tracking-[0.3em] group-hover:text-white/30 transition-colors">
                Return to Top
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
