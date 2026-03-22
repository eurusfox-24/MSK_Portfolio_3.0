import { useEffect, useState, useRef } from "react";
import { Github, Linkedin, ExternalLink, Download } from "lucide-react";
import cmsSnapshot from "../data/cms-data.json";

interface ProfileItem {
  name: string;
  role: string;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  tryHackMeId: string;
  cvUrl: string;
}

interface CmsSnapshot {
  profile: ProfileItem;
}

function getInitialProfile(): ProfileItem | null {
  return (cmsSnapshot as unknown as CmsSnapshot).profile || null;
}

export default function Hero() {
  const [profile] = useState<ProfileItem | null>(getInitialProfile());
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const heroRef = useRef<HTMLElement>(null);

  const fullText = profile ? `> ${profile.name}` : "";

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
  }, [fullText]);

  if (!profile) return null;

  const socials = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      href: profile.githubUrl,
      color: "hover:text-white hover:border-white/40",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      href: profile.linkedinUrl,
      color: "hover:text-[#0077b5] hover:border-[#0077b5]/40",
    },
    {
      name: "Download CV",
      icon: <Download className="w-5 h-5" />,
      href: profile.cvUrl,
      color: "hover:text-cyber-green hover:border-cyber-green/40",
      download: true,
    },
  ];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cyber-black pt-16"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-green/5 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column - Identity */}
          <div
            className={`lg:col-span-7 space-y-10 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-4">
              <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold text-white tracking-tighter">
                <span className="text-cyber-green glow-text">{typedText}</span>
                <span className="terminal-cursor text-cyber-green" />
              </h1>
              <p className="font-heading text-xl sm:text-2xl text-white/40 font-light tracking-wide max-w-xl">
                {profile.role}
              </p>
            </div>

            <div className="space-y-8 text-white/50 leading-relaxed max-w-2xl text-sm sm:text-base">
              <p className="text-lg">{profile.description}</p>

              {/* Social Icons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.download ? undefined : "_blank"}
                    rel={social.download ? undefined : "noopener noreferrer"}
                    download={social.download}
                    className={`group flex items-center gap-3 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl transition-all duration-500 ${social.color} hover:bg-white/[0.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-1`}
                  >
                    <div className="transition-transform duration-500 group-hover:scale-110">
                      {social.icon}
                    </div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest">
                      {social.name}
                    </span>
                    {social.download ? (
                      <div className="w-3 h-3 flex items-center justify-center">
                        <div className="w-1 h-1 bg-cyber-green rounded-full animate-ping" />
                      </div>
                    ) : (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - TryHackMe Badge */}
          <div
            className={`lg:col-span-5 relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative group max-w-md ml-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-green/40 via-cyber-green/60 to-cyber-green/40 rounded-3xl blur-2xl opacity-40 animate-pulse-slow" />

              <div className="relative bg-cyber-dark/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-cyber-green/40 shadow-[0_0_40px_rgba(0,255,65,0.2)]">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] text-cyber-green/60 uppercase tracking-[0.3em] font-bold">
                    TryHackMe Profile
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-black/60 p-4 border border-white/5 flex items-center justify-center min-h-[130px] shadow-inner group-hover:border-cyber-green/30 transition-all duration-500">
                  <iframe
                    src={`https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${profile.tryHackMeId}`}
                    className="w-full max-w-[329px] h-[88px] group-hover:scale-105 transition-transform duration-700"
                    scrolling="no"
                    loading="lazy"
                    title="TryHackMe Badge"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full animate-scan" />
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <p className="font-mono text-xs text-white/40 font-bold tracking-widest uppercase">
                    User ID: {profile.tryHackMeId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-16 bg-gradient-to-b from-cyber-green/60 via-cyber-green/20 to-transparent animate-pulse" />
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
