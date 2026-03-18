import { useEffect, useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import cmsSnapshot from '../data/cms-data.json';

const fallbackProjects = [
  {
    id: 1,
    title: 'IoT Biometric Pulse & Oxygen Tracker',
    description: 'Developed a biometric monitoring system using a Raspberry Pi and a Pulse Oximeter sensor to capture and analyze real-time heart rate and oxygen saturation (SpO₂) data.',
    image: 'images/BiometricSensorProj.jpeg',
    tags: ['Raspberry Pi', 'IoT', 'Python', 'Sensors'],
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 2,
    title: 'Adaptive Seismic Alert System',
    description: 'Successfully pivoted from a sign-language translation glove to a functional earthquake detector in under 48 hours after hardware failure. Re-engineered motion sensors and hardware logic to meet presentation requirements.',
    image: 'images/earthquakeDetector.jpeg',
    tags: ['Hardware', 'Arduino', 'C++', 'Rapid Prototyping'],
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 3,
    title: 'Projekti Honeypot',
    description: 'Led a team of six to architect a multi-node honeynet using Cowrie, Suricata, and OpenWrt, conducting a full-scale Red Team/Blue Team simulation to analyze real-time intrusion detection and adversary behavior.',
    image: 'images/honeyPot.jpeg',
    tags: ['Cybersecurity', 'Honeypot', 'Suricata', 'Team Lead'],
    color: 'from-red-500/20 to-orange-500/20',
  },
];

function getInitialProjects() {
  // In production, use baked-in CMS snapshot if available
  if (!import.meta.env.DEV && cmsSnapshot.projects && cmsSnapshot.projects.length > 0) {
    return (cmsSnapshot.projects as any[]).map((p) => ({
      ...p,
      tags: typeof p.tags === 'string' ? p.tags.split(',').map((t: string) => t.trim()) : p.tags || [],
    }));
  }
  return fallbackProjects;
}

export default function Projects() {
  const [projects, setProjects] = useState(getInitialProjects());
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<typeof fallbackProjects[0] | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // In dev mode, fetch live from Strapi
  useEffect(() => {
    if (!import.meta.env.DEV) return; // Skip in production — using snapshot
    fetch('http://localhost:1337/api/projects?populate=*')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && data.data.length > 0) {
          const cmsProjects = data.data.map((item: any) => {
            const attrs = item.attributes || item;
            let imageUrl = attrs.image;
            if (attrs.image?.data?.attributes?.url) {
              imageUrl = `http://localhost:1337${attrs.image.data.attributes.url}`;
            } else if (attrs.image?.url) {
              imageUrl = `http://localhost:1337${attrs.image.url}`;
            }
            return {
              id: item.id || attrs.documentId,
              title: attrs.title,
              description: attrs.description,
              image: imageUrl,
              tags: attrs.tags ? attrs.tags.split(',').map((t: string) => t.trim()) : [],
              color: attrs.color || 'from-blue-500/20 to-cyan-500/20',
            };
          });
          setProjects(cmsProjects);
        }
      })
      .catch((err) => {
        console.log('Using fallback projects data (Strapi CMS not reachable)', err);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-50px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.project-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [projects]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-16 lg:py-24"
    >
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 lg:mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-cyber-green/50" />
            <span className="font-mono text-xs text-cyber-green/60 tracking-widest">
              FEATURED WORK
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Projects
          </h2>
          <p className="mt-3 text-white/50 max-w-2xl text-sm sm:text-base">
            A collection of hands-on technical projects demonstrating expertise in IoT, 
            cybersecurity, and rapid hardware prototyping.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={visibleCards.includes(index)}
              onExpand={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal for Enlarged Project */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] flex flex-col bg-cyber-dark rounded-xl border border-cyber-green/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-cyber-dark/80 hover:bg-cyber-green/20 border border-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto bg-gradient-to-br from-cyber-black to-cyber-dark">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            <div className="p-4 sm:p-6 border-t border-white/10 bg-cyber-dark">
              <h3 className="text-lg sm:text-xl font-bold text-cyber-green mb-2">{selectedProject.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedProject.tags?.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-[10px] font-mono text-white/40 bg-white/5 rounded border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{selectedProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ProjectCard({
  project,
  index,
  isVisible,
  onExpand,
}: {
  project: typeof fallbackProjects[0];
  index: number;
  isVisible: boolean;
  onExpand: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      data-index={index}
      className={`project-card group relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onExpand}
    >
      <div 
        className={`absolute -inset-0.5 bg-gradient-to-r ${project.color} rounded-xl blur-lg transition-opacity duration-500 ${
          isHovered ? 'opacity-50' : 'opacity-0'
        }`}
      />

      <div className="relative h-full bg-cyber-dark rounded-xl border border-white/10 overflow-hidden hover:border-cyber-green/30 transition-all duration-500 cursor-pointer">
        <div className="relative h-40 sm:h-44 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-40`} />
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
          <div className={`absolute inset-0 bg-cyber-black/50 transition-opacity duration-300 ${
            isHovered ? 'opacity-30' : 'opacity-50'
          }`} />

          {/* Click to enlarge hint */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className="text-white/80 text-xs font-mono bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
              Click to view
            </span>
          </div>

          <div className={`absolute top-3 right-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}>
            <div className="w-7 h-7 bg-cyber-black/80 backdrop-blur-sm rounded-md flex items-center justify-center border border-white/10 hover:border-cyber-green/50">
              <ExternalLink className="w-3.5 h-3.5 text-white/70" />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <h3 className="font-heading text-base sm:text-lg font-semibold text-white group-hover:text-cyber-green transition-colors duration-300 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-mono text-white/40 bg-white/5 rounded border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-green/50 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>
    </div>
  );
}