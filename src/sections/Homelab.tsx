import { useEffect, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import cmsSnapshot from '../data/cms-data.json';
import ProjectModal from '../components/ProjectModal';

interface HomelabStat {
  label: string;
  value: string;
}

interface HomelabFeature {
  title: string;
  description: string;
}

interface HomelabItem {
  title: string;
  description: string;
  image: string;
  gallery: string[];
  documentation: string | null;
  status: string;
  onlineText: string;
  features: HomelabFeature[];
  stats: HomelabStat[];
  tags: string[];
}

interface CmsSnapshot {
  homelabs: HomelabItem[];
}

function getInitialHomelab(): HomelabItem[] {
  const snapshot = (cmsSnapshot as unknown as CmsSnapshot).homelabs;
  if (snapshot && snapshot.length > 0) {
    return snapshot.map(lab => ({
      ...lab,
      tags: lab.tags || ['Cybersecurity', 'Docker', 'Elastic Stack', 'T-Pot']
    }));
  }
  return [
    {
      title: "Live Attack Surface Monitoring with T-Pot",
      description: "Deployed a containerized T-Pot honeypot environment to monitor real-world cyberattacks, utilizing the Elastic Stack for log analysis while mastering network security via firewall configuration and Docker orchestration.",
      image: "images/Tpot.jpeg",
      gallery: [],
      documentation: null,
      status: "published",
      onlineText: "Online",
      features: [
        { title: "Real-time Monitoring", description: "Live attack surface visualization" },
        { title: "Global Honeypot", description: "Multi-node deployment worldwide" },
        { title: "Security Analysis", description: "Deep packet inspection" },
        { title: "Log Management", description: "Centralized Elasticsearch logging" }
      ],
      stats: [
        { label: "Containers", value: "20+" },
        { label: "Attack Types", value: "50+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Logs/Day", value: "10K+" }
      ],
      tags: ['Cybersecurity', 'Docker', 'Elastic Stack', 'T-Pot']
    }
  ];
}

export default function Homelab() {
  const [homelabs] = useState<HomelabItem[]>(getInitialHomelab());
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<HomelabItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-index');
            if (indexStr) {
              const index = parseInt(indexStr);
              setVisibleItems(prev => [...new Set([...prev, index])]);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.homelab-item').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [homelabs]);

  if (homelabs.length === 0) return null;

  return (
    <section id="homelab" ref={sectionRef} className="relative py-20 lg:py-32 overflow-hidden bg-cyber-black min-h-screen pt-32">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-cyber-green/50" />
            <span className="font-mono text-xs text-cyber-green/60 tracking-widest uppercase">Research Environments</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight">Homelab & Infrastructure</h2>
        </div>

        <div className="space-y-32">
          {homelabs.map((lab, index) => (
            <div 
              key={index} 
              data-index={index}
              className={`homelab-item grid lg:grid-cols-12 gap-12 items-center transition-all duration-1000 ${
                visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
            >
              <div className={`lg:col-span-6 space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="space-y-4">
                  <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">{lab.title}</h3>
                  <p className="text-white/60 text-lg leading-relaxed max-w-xl">{lab.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {lab.stats.map((stat) => (
                    <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-cyber-green/30 transition-all duration-500 group">
                      <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white group-hover:text-cyber-green transition-colors">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {lab.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyber-green bg-cyber-green/5 border border-cyber-green/20 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 bg-cyber-dark/80 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/80 via-transparent to-transparent z-10" />
                  <img 
                    src={lab.image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000"} 
                    alt={lab.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-cyber-green/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                      <span className="font-mono text-[10px] text-cyber-green uppercase tracking-widest font-bold">{lab.onlineText}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <button 
                      onClick={() => setSelectedProject(lab)} 
                      className="p-4 bg-cyber-green text-black rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-500 shadow-[0_0_30px_rgba(0,255,65,0.4)]"
                    >
                      <Maximize2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedProject && <ProjectModal isOpen={!!selectedProject} project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
}
