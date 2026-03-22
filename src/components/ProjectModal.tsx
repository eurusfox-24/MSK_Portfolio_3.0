import { useState, useEffect, useCallback } from 'react';
import { X, FileText, ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    image: string;
    gallery?: string[];
    documentation?: string | null;
    githubUrl?: string;
    tags: string[];
    features?: { title: string; description: string }[];
    stats?: { label: string; value: string }[];
  } | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(prev => prev !== newIndex ? newIndex : prev);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !project) return null;

  const allImages = [project.image, ...(project.gallery || [])];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-cyber-black/95 backdrop-blur-xl transition-all duration-300">
      <div 
        className="relative w-full max-w-4xl max-h-[85vh] bg-cyber-dark rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Navigation Bar */}
        <div className="flex items-center justify-between px-4 py-2 z-20">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse shadow-[0_0_5px_#00ff41]" />
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Detail View</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side: Image Viewer (Instagram Style) */}
          <div className="lg:w-[55%] relative bg-black flex flex-col">
            <div className="flex-1 overflow-hidden" ref={emblaRef}>
              <div className="flex h-full">
                {allImages.map((img, idx) => (
                  <div key={idx} className="flex-[0_0_100%] h-full relative flex items-center justify-center p-2">
                    <img 
                      src={img} 
                      className="max-w-full max-h-full object-contain rounded-lg" 
                      alt={`Slide ${idx}`} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={scrollPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/5 transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={scrollNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/5 transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Pagination Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
              {allImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    idx === selectedIndex ? 'bg-cyber-green w-3 shadow-[0_0_5px_#00ff41]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Content Area */}
          <div className="lg:w-[45%] overflow-y-auto p-5 sm:p-6 bg-gradient-to-b from-cyber-dark to-cyber-black">
            <div className="space-y-6">
              {/* Title & Tags */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">{project.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-cyber-green bg-cyber-green/5 rounded border border-cyber-green/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links Section */}
              <div className="flex flex-col gap-3">
                {project.documentation && (
                  <div className="p-3 bg-cyber-green/5 border border-cyber-green/10 rounded-lg group/doc">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-cyber-green/10 rounded flex items-center justify-center border border-cyber-green/10">
                          <FileText className="w-4 h-4 text-cyber-green" />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Reference</p>
                          <p className="text-xs font-bold text-white">Documentation</p>
                        </div>
                      </div>
                      <a 
                        href={project.documentation} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-cyber-green text-black font-bold text-[10px] uppercase rounded transition-colors flex items-center gap-1.5 hover:bg-white"
                      >
                        Open <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                )}

                {project.githubUrl && (
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg group/github">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center border border-white/10">
                          <Github className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Source</p>
                          <p className="text-xs font-bold text-white">GitHub Repo</p>
                        </div>
                      </div>
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white/10 text-white font-bold text-[10px] uppercase rounded transition-colors flex items-center gap-1.5 hover:bg-cyber-green hover:text-black"
                      >
                        View <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] mb-2">Overview</h4>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Features Grid (If applicable) */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h4 className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] mb-3">Specs</h4>
                  <div className="grid gap-2">
                    {project.features.map((f, i) => (
                      <div key={i} className="p-2.5 bg-white/5 border border-white/5 rounded-lg">
                        <p className="text-[10px] font-bold text-white/80 mb-0.5">{f.title}</p>
                        <p className="text-[10px] text-white/30">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Grid (If applicable) */}
              {project.stats && project.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {project.stats.map((s, i) => (
                    <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-lg text-center">
                      <p className="text-[10px] font-mono text-white/40 mb-1">{s.label}</p>
                      <p className="text-lg font-bold text-cyber-green">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
