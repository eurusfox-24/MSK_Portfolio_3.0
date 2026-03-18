import { useEffect, useRef, useState } from 'react';
import cmsSnapshot from '../data/cms-data.json';

const fallbackCertifications = [
  {
    id: 1,
    name: 'Fortinet NSE3',
    issuer: 'Fortinet',
    image: 'certs/Fortinet_NSE3.jpeg',
    date: '2026',
    category: 'Network Security',
    description: 'Network Security Associate certification demonstrating expertise in Fortinet Firewall administration.',
  },
  {
    id: 2,
    name: 'AWS Cloud Practitioner Essentials',
    issuer: 'Amazon Web Services',
    image: 'certs/aws_cert.jpeg',
    date: '2025',
    category: 'Cloud Computing',
    description: 'Foundational cloud computing knowledge and AWS services understanding.',
  },
  {
    id: 3,
    name: 'Cisco Introduction to Cybersecurity',
    issuer: 'Cisco',
    image: 'certs/Cisco_CysaIntro.jpeg',
    date: '2025',
    category: 'Cybersecurity',
    description: 'Comprehensive introduction to cybersecurity concepts and best practices.',
  },
  {
    id: 4,
    name: 'Junction Hackathon 2025',
    issuer: 'Junction',
    image: 'certs/junctionHackathonCertificate.jpeg',
    date: '2025',
    category: 'Hackathon',
    description: 'Participation in one of Europe\'s largest hackathon events.',
  },
  {
    id: 5,
    name: 'Google Prompting Essentials',
    issuer: 'Google',
    image: 'certs/googleprompting.jpeg',
    date: '2026',
    category: 'AI/ML',
    description: 'Mastering effective prompt engineering for large language models.',
  },
];

function getInitialCerts() {
  if (!import.meta.env.DEV && cmsSnapshot.certifications && cmsSnapshot.certifications.length > 0) {
    return cmsSnapshot.certifications as any;
  }
  return fallbackCertifications;
}

export default function Certifications() {
  const [certifications, setCertifications] = useState(getInitialCerts());
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCert, setSelectedCert] = useState<typeof fallbackCertifications[0] | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    fetch('http://localhost:1337/api/certifications?populate=*')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && data.data.length > 0) {
          const cmsCerts = data.data.map((item: any) => {
            const attrs = item.attributes || item;
            let imageUrl = attrs.image;
            if (attrs.image?.data?.attributes?.url) {
              imageUrl = `http://localhost:1337${attrs.image.data.attributes.url}`;
            } else if (attrs.image?.url) {
              imageUrl = `http://localhost:1337${attrs.image.url}`;
            }
            return {
              id: item.id || attrs.documentId,
              name: attrs.name,
              issuer: attrs.issuer,
              image: imageUrl,
              date: attrs.date,
              category: attrs.category,
              description: attrs.description,
            };
          });
          setCertifications(cmsCerts);
        }
      })
      .catch((err) => {
        console.log('Using fallback certification data (Strapi CMS not reachable)', err);
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

    const cards = sectionRef.current?.querySelectorAll('.cert-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [certifications]);

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCert]);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative py-16 lg:py-24"
    >
      {/* Section Divider */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 lg:mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-cyber-green/50" />
            <span className="font-mono text-xs text-cyber-green/60 tracking-widest">
              CREDENTIALS
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Certifications
          </h2>
          <p className="mt-3 text-white/50 max-w-2xl text-sm sm:text-base">
            Professional certifications and achievements demonstrating continuous learning 
            and expertise in cybersecurity, cloud computing, and emerging technologies.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {certifications.map((cert: any, index: number) => (
            <div
              key={cert.id}
              data-index={index}
              className={`cert-card group relative transition-all duration-700 ${
                visibleCards.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(cert.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Glow */}
              <div 
                className={`absolute -inset-0.5 bg-gradient-to-r from-cyber-green/20 to-cyber-green-dim/20 rounded-xl blur-lg transition-opacity duration-500 ${
                  hoveredCard === cert.id ? 'opacity-50' : 'opacity-0'
                }`}
              />

              {/* Card Content */}
              <div className="relative h-full bg-cyber-dark rounded-xl border border-white/10 overflow-hidden hover:border-cyber-green/30 transition-all duration-500">
                {/* Image Container */}
                <div 
                  className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-cyber-black to-cyber-dark cursor-pointer group"
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 pt-12 sm:pt-14">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className={`max-w-full max-h-full object-contain transition-all duration-500 ${
                        hoveredCard === cert.id ? 'scale-110' : 'scale-100'
                      }`}
                    />
                  </div>
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent transition-opacity duration-300 ${
                    hoveredCard === cert.id ? 'opacity-40' : 'opacity-60'
                  }`} />
                  
                  {/* Click to enlarge hint */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredCard === cert.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="text-center pointer-events-none">
                      <div className="text-white/80 text-xs font-mono">Click to enlarge</div>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 text-[10px] sm:text-xs font-mono text-cyber-green bg-cyber-green/10 border border-cyber-green/30 rounded-full">
                      {cert.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-white group-hover:text-cyber-green transition-colors duration-300 line-clamp-2">
                    {cert.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span>{cert.issuer}</span>
                    <span>•</span>
                    <span>{cert.date}</span>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                    {cert.description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-green/50 to-transparent transition-opacity duration-300 ${
                  hoveredCard === cert.id ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className={`mt-10 sm:mt-12 p-5 sm:p-6 bg-cyber-dark/50 rounded-xl border border-white/10 transition-all duration-1000 delay-500 ${
          visibleCards.length === certifications.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-heading text-2xl sm:text-3xl font-bold text-cyber-green mb-1">{certifications.length}</p>
              <p className="font-mono text-[10px] sm:text-xs text-white/40">Total Certs</p>
            </div>
            <div>
              <p className="font-heading text-2xl sm:text-3xl font-bold text-cyber-green mb-1">
                {new Set(certifications.map((c: any) => c.category)).size}
              </p>
              <p className="font-mono text-[10px] sm:text-xs text-white/40">Categories</p>
            </div>
            <div>
              <p className="font-heading text-2xl sm:text-3xl font-bold text-cyber-green mb-1">
                {(() => {
                  const years = certifications.map((c: any) => parseInt(c.date)).filter((y: number) => !isNaN(y));
                  if (years.length === 0) return 'N/A';
                  const min = Math.min(...years);
                  const max = Math.max(...years);
                  return min === max ? `${min}` : `${min}-${max.toString().slice(-2)}`;
                })()}
              </p>
              <p className="font-mono text-[10px] sm:text-xs text-white/40">Period</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] flex flex-col bg-cyber-dark rounded-xl border border-cyber-green/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-cyber-dark/80 hover:bg-cyber-green/20 border border-white/20 rounded-lg transition-colors duration-200"
            >
              <span className="text-white text-lg">×</span>
            </button>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto bg-gradient-to-br from-cyber-black to-cyber-dark">
              <img
                src={selectedCert.image}
                alt={selectedCert.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="p-4 sm:p-6 border-t border-white/10">
              <h3 className="text-lg sm:text-xl font-bold text-cyber-green mb-2">{selectedCert.name}</h3>
              <p className="text-sm text-white/70 mb-2">{selectedCert.issuer} • {selectedCert.date}</p>
              <p className="text-sm text-white/60">{selectedCert.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
