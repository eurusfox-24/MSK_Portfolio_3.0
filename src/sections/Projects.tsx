import { useEffect, useRef, useState } from 'react';
import { Layout, Maximize2 } from 'lucide-react';
import cmsSnapshot from '../data/cms-data.json';
import ProjectModal from '../components/ProjectModal';

interface ProjectItem {
  id: number | string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  documentation: string | null;
  githubUrl?: string;
  tags: string[];
  color: string;
  category: string;
}

interface CmsProject {
  id: number | string;
  title: string;
  description: string;
  image: string;
  gallery?: string[];
  documentation?: string;
  githubUrl?: string;
  tags: string | string[];
  color?: string;
  category?: string;
}

interface CmsSnapshot {
  projects: CmsProject[];
}

function getInitialProjects(): ProjectItem[] {
  const snapshot = (cmsSnapshot as unknown as CmsSnapshot).projects;
  if (snapshot && snapshot.length > 0) {
    return snapshot.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      gallery: p.gallery || [],
      documentation: p.documentation || null,
      githubUrl: p.githubUrl,
      tags: typeof p.tags === 'string' ? p.tags.split(',').map((t: string) => t.trim()) : p.tags || [],
      color: p.color || 'from-blue-500/20 to-cyan-500/20',
      category: p.category || 'Tech Project'
    }));
  }
  return [];
}

export default function Projects() {
  const [projects] = useState<ProjectItem[]>(getInitialProjects());
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-index');
            if (indexStr) {
              const index = parseInt(indexStr);
              setVisibleCards((prev) => [...new Set([...prev, index])]);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.project-card').forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [projects]);

  return (
    <section id="projects" ref={sectionRef} className="relative py-16 lg:py-24 bg-cyber-black min-h-screen pt-32">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-cyber-green/50" />
            <span className="font-mono text-xs text-cyber-green/60 tracking-widest uppercase">Portfolio</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">Featured Projects</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <ProjectModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject} 
      />
    </section>
  );
}

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  isVisible: boolean;
  onExpand: () => void;
}

function ProjectCard({ project, index, isVisible, onExpand }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      data-index={index}
      className={`project-card group relative transition-all duration-700 cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onExpand}
    >
      <div className="relative bg-cyber-dark rounded-xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col h-full hover:border-cyber-green/30 border border-white/5">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <Layout className="w-3.5 h-3.5 text-cyber-green" />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{project.category}</span>
          </div>
        </div>

        {/* Image Area */}
        <div className="relative h-48 overflow-hidden bg-cyber-black/40">
          <img
            src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent opacity-60" />
          
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-mono font-bold tracking-widest uppercase text-white flex items-center gap-2">
              <Maximize2 size={12} className="text-cyber-green" /> View Details
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyber-green transition-colors line-clamp-2">{project.title}</h3>
          <p className="text-sm text-white/50 mb-4 line-clamp-3 leading-relaxed flex-1">{project.description}</p>
          
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 text-[9px] font-mono text-white/40 bg-white/5 rounded border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
