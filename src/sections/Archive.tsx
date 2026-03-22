import { useEffect, useRef, useState } from 'react';
import { Maximize2, Users, Calendar, MapPin } from 'lucide-react';
import cmsSnapshot from '../data/cms-data.json';
import ProjectModal from '../components/ProjectModal';

interface MembershipItem {
  id: number | string;
  title: string;
  description?: string;
}

interface EventItem {
  id: number | string;
  title: string;
  description?: string;
  image: string;
  gallery: string[];
  date?: string;
  location?: string;
}

interface CmsSnapshot {
  memberships: MembershipItem[];
  events: EventItem[];
}

function getInitialData() {
  const snapshot = (cmsSnapshot as unknown as CmsSnapshot);
  
  const memberships = (snapshot.memberships && snapshot.memberships.length > 0) 
    ? snapshot.memberships 
    : [
        { id: 1, title: "KuoSec", description: "Active member of the Kuopio Information Security community." },
        { id: 2, title: "Tietoala ry", description: "Association of IT sector Employees." }
      ];

  const events = (snapshot.events && snapshot.events.length > 0)
    ? snapshot.events
    : [
        {
          id: 101,
          title: "Junction Hackathon 2025",
          description: "Europe's largest hackathon. Worked on AI-driven security challenges.",
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
          gallery: [],
          date: "2025",
          location: "Espoo"
        },
        {
          id: 102,
          title: "Helsinki AI Startup",
          description: "Networking and exploring AI innovations at Helsinki XR Center.",
          image: "https://images.unsplash.com/photo-1591115765373-520b70982c59?q=80&w=800",
          gallery: [],
          date: "2025",
          location: "Helsinki XR Center"
        },
        {
          id: 103,
          title: "HelSec Meetup",
          description: "Monthly meetup for the Helsinki information security community.",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
          gallery: [],
          date: "2025",
          location: "Helsinki"
        },
        {
          id: 104,
          title: "KuoSec Meetup",
          description: "Local security community meetup in Kuopio.",
          image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800",
          gallery: [],
          date: "2025",
          location: "Kuopio"
        }
      ];

  return { memberships, events };
}

export default function Archive() {
  const { memberships, events } = getInitialData();
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-index');
            if (indexStr) {
              const index = parseInt(indexStr);
              setVisibleEvents(prev => [...new Set([...prev, index])]);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.event-photo-card').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="archive" ref={sectionRef} className="relative py-20 lg:py-32 overflow-hidden bg-cyber-black min-h-screen pt-32">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Memberships Section - Experience Style Rows */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-cyber-green/50" />
            <span className="font-mono text-xs text-cyber-green/60 tracking-widest uppercase">Professional Affiliations</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-12 tracking-tight">Memberships</h2>
          
          <div className="grid gap-4">
            {memberships.map((member) => (
              <div key={member.id} className="group relative bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-cyber-green/30 transition-all duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-cyber-green/10 rounded-lg">
                      <Users size={20} className="text-cyber-green" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyber-green transition-colors">{member.title}</h3>
                      <p className="text-sm text-white/40 font-mono mt-1">{member.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Section - Photo Grid */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-cyber-green/50" />
            <span className="font-mono text-xs text-cyber-green/60 tracking-widest uppercase">History & Engagement</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-12 tracking-tight">Events & Hackathons</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                data-index={index}
                onClick={() => setSelectedEvent(event)}
                className={`event-photo-card group relative cursor-pointer border border-white/5 bg-cyber-dark/40 rounded-3xl overflow-hidden transition-all duration-700 ${
                  visibleEvents.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } hover:border-cyber-green/30`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-cyber-green/60 uppercase tracking-widest">
                    {event.date && <span className="flex items-center gap-1.5"><Calendar size={12} /> {event.date}</span>}
                    {event.location && <span className="flex items-center gap-1.5"><MapPin size={12} /> {event.location}</span>}
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-cyber-green transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/50 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    {event.description}
                  </p>
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                  <div className="p-3 bg-cyber-green text-black rounded-full shadow-[0_0_20px_rgba(0,255,65,0.4)]">
                    <Maximize2 size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <ProjectModal 
          isOpen={!!selectedEvent} 
          project={{
            title: selectedEvent.title,
            description: selectedEvent.description || "",
            image: selectedEvent.image,
            gallery: selectedEvent.gallery,
            tags: [selectedEvent.location || "Event"]
          }} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </section>
  );
}
