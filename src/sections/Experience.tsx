import { useEffect, useRef, useState } from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import cmsSnapshot from '../data/cms-data.json';

interface ExperienceItem {
  id: number | string;
  title: string;
  company: string;
  location: string;
  dateRange: string;
  description: string;
  logo: string | null;
  tags: string[];
}

interface CmsExperience {
  id: number | string;
  title: string;
  company: string;
  location: string;
  dateRange: string;
  description: string;
  logo: string | null;
  tags: string | string[];
}

interface CmsSnapshot {
  experiences: CmsExperience[];
}

function getInitialExperiences(): ExperienceItem[] {
  const snapshot = (cmsSnapshot as unknown as CmsSnapshot).experiences;
  if (snapshot) {
    return snapshot.map((e: CmsExperience) => ({
      id: e.id,
      title: e.title,
      company: e.company,
      location: e.location,
      dateRange: e.dateRange,
      description: e.description || '',
      logo: e.logo,
      tags: typeof e.tags === 'string' && e.tags.trim() 
        ? e.tags.split(',').map((t: string) => t.trim()) 
        : (Array.isArray(e.tags) ? e.tags : []),
    }));
  }
  return [];
}

export default function Experience() {
  const [experiences] = useState<ExperienceItem[]>(getInitialExperiences());
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

  return (
    <section id="experience" ref={sectionRef} className="relative py-16 lg:py-24 bg-cyber-black min-h-screen pt-32">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-cyber-green/50" />
            <span className="font-mono text-xs text-cyber-green/60 tracking-widest uppercase">Career Path</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">Work Experience</h2>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div 
              key={exp.id}
              className={`relative pl-8 sm:pl-12 border-l border-white/10 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-cyber-green rounded-full shadow-[0_0_10px_rgba(0,255,157,0.5)]" />
              
              <div className="bg-cyber-dark/50 border border-white/5 rounded-xl p-6 hover:border-cyber-green/30 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {exp.logo ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center p-2 border border-white/10">
                        <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-cyber-green/10 flex items-center justify-center border border-cyber-green/20">
                        <Briefcase className="w-6 h-6 text-cyber-green" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyber-green transition-colors">{exp.title}</h3>
                      <p className="text-cyber-green/80 font-medium">{exp.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-sm text-white/40 font-mono">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.dateRange}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </div>
                  </div>
                </div>

                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-[10px] font-mono text-white/40 bg-white/5 rounded border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
