import { useEffect, useRef, useState } from 'react';
import { Cpu, Shield } from 'lucide-react';
import cmsSnapshot from '../data/cms-data.json';

interface FocusData {
  title: string;
  subtitle: string;
  description: string;
  tags: string | string[];
  status: string;
  defenseStrategy: string;
  aiIntegration: string;
}

interface DisplayFocusData {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: string;
  defenseStrategy: string;
  aiIntegration: string;
}

interface CmsSnapshot {
  currentFocus: FocusData;
}

function getInitialFocus(): DisplayFocusData | null {
  const snapshot = (cmsSnapshot as unknown as CmsSnapshot).currentFocus;
  if (snapshot) {
    return {
      title: snapshot.title,
      subtitle: snapshot.subtitle,
      description: snapshot.description,
      tags: typeof snapshot.tags === 'string' ? snapshot.tags.split(',').map((t: string) => t.trim()) : snapshot.tags || [],
      status: snapshot.status,
      defenseStrategy: snapshot.defenseStrategy,
      aiIntegration: snapshot.aiIntegration,
    };
  }
  return null;
}

export default function CurrentFocus() {
  const [focus] = useState<DisplayFocusData | null>(getInitialFocus());
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!focus) return null;

  return (
    <section id="focus" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-cyber-black">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-cyber-green/50" />
                <span className="font-mono text-xs text-cyber-green/60 tracking-widest uppercase">Ongoing Project</span>
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight">{focus.title}</h2>
              <p className="text-cyber-green/80 font-mono text-sm uppercase tracking-wider font-bold">{focus.subtitle}</p>
            </div>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">{focus.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {focus.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 text-[10px] font-mono text-white/40 bg-white/5 rounded border border-white/10 uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
            <div className="pt-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-cyber-green/5 border border-cyber-green/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                <span className="font-mono text-xs text-cyber-green/80 uppercase tracking-[0.2em] font-bold">{focus.status}</span>
              </div>
            </div>
          </div>
          <div className={`grid gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] hover:border-cyber-green/30 transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="p-3 bg-cyber-green/10 rounded-2xl border border-cyber-green/20 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-6 h-6 text-cyber-green" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-white tracking-wide uppercase">Defense Strategy</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{focus.defenseStrategy}</p>
                </div>
              </div>
            </div>
            <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] hover:border-cyber-green/30 transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Cpu className="w-6 h-6 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-white tracking-wide uppercase">AI Integration</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{focus.aiIntegration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
