import { useEffect, useRef, useState } from 'react';
import cmsSnapshot from '../data/cms-data.json';

const fallbackFeatures = [
  { title: 'Real-time Monitoring', description: 'Live attack surface visualization' },
  { title: 'Global Honeypot', description: 'Multi-node deployment worldwide' },
  { title: 'Security Analysis', description: 'Deep packet inspection' },
  { title: 'Log Management', description: 'Centralized Elasticsearch logging' },
];

const fallbackStats = [
  { label: 'Containers', value: '20+' },
  { label: 'Attack Types', value: '50+' },
  { label: 'Uptime', value: '99.9%' },
  { label: 'Logs/Day', value: '10K+' },
];

const defaultHomelabData = {
  title: 'Live Attack Surface Monitoring with T-Pot',
  description: 'Deployed a containerized T-Pot honeypot environment to monitor real-world cyberattacks, utilizing the Elastic Stack for log analysis while mastering network security via firewall configuration and Docker orchestration.',
  image: 'images/Tpot.jpeg',
  status: 'Active',
  onlineText: 'Online',
  features: fallbackFeatures,
  stats: fallbackStats
};

function getInitialHomelab() {
  if (!import.meta.env.DEV && cmsSnapshot.homelabs && cmsSnapshot.homelabs.length > 0) {
    const h = cmsSnapshot.homelabs[0] as any;
    return {
      title: h.title || defaultHomelabData.title,
      description: h.description || defaultHomelabData.description,
      image: h.image || defaultHomelabData.image,
      status: h.status || defaultHomelabData.status,
      onlineText: h.onlineText || defaultHomelabData.onlineText,
      features: h.features || fallbackFeatures,
      stats: h.stats || fallbackStats,
    };
  }
  return defaultHomelabData;
}

export default function Homelab() {
  const [homelabData, setHomelabData] = useState(getInitialHomelab());
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    fetch('http://localhost:1337/api/homelabs?populate=*')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.length > 0) {
          const item = data.data[0];
          const attrs = item.attributes || item;
          let imageUrl = attrs.image;
          if (attrs.image?.data?.attributes?.url) {
            imageUrl = `http://localhost:1337${attrs.image.data.attributes.url}`;
          } else if (attrs.image?.url) {
            imageUrl = `http://localhost:1337${attrs.image.url}`;
          }

          setHomelabData({
            title: attrs.title || homelabData.title,
            description: attrs.description || homelabData.description,
            image: imageUrl || homelabData.image,
            status: attrs.status || homelabData.status,
            onlineText: attrs.onlineText || homelabData.onlineText,
            features: attrs.features || fallbackFeatures,
            stats: attrs.stats || fallbackStats
          });
        }
      })
      .catch(err => console.log('Homelab fallback used', err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="homelab"
      ref={sectionRef}
      className="relative py-16 lg:py-24 overflow-hidden"
    >
      {/* Section Divider */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 lg:mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-cyber-green/50" />
            <span className="font-mono text-xs text-cyber-green/60 tracking-widest">
              INFRASTRUCTURE
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Homelab
          </h2>
          <p className="mt-3 text-white/50 max-w-2xl text-sm sm:text-base">
            A containerized cybersecurity environment for monitoring real-world attacks, 
            analyzing threat patterns, and mastering network security.
          </p>
        </div>

        {/* Main Homelab Card */}
        <div 
          className={`relative transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Card Container */}
          <div 
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-cyber-dark transition-all duration-500 cursor-pointer ${
              isExpanded ? 'border-cyber-green/30' : 'hover:border-white/20'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-white/80">{homelabData.title.split('with')[1]?.trim() || 'T-Pot Honeypot'}</span>
                <span className="px-2 py-0.5 text-xs font-mono text-cyber-green bg-cyber-green/10 rounded">
                  {homelabData.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-cyber-green rounded-full status-pulse" />
                <span className="font-mono text-xs text-white/40">{homelabData.onlineText}</span>
              </div>
            </div>

            {/* Main Content */}
            <div className={`relative transition-all duration-700 ${
              isExpanded ? 'h-[400px] sm:h-[450px]' : 'h-[220px] sm:h-[260px]'
            }`}>
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={homelabData.image}
                  alt={homelabData.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isExpanded ? 'scale-105 opacity-100' : 'scale-100 opacity-60'
                  }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/80 to-transparent transition-opacity duration-500 ${
                  isExpanded ? 'opacity-80' : 'opacity-90'
                }`} />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                <div className={`transition-all duration-500 ${
                  isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}>
                  <h3 className="font-heading text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                    {homelabData.title}
                  </h3>
                  <p className="text-white/60 text-sm max-w-2xl mb-4">
                    {homelabData.description}
                  </p>
                </div>

                {/* Features Grid */}
                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 transition-all duration-500 ${
                  isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {homelabData.features.map((feature: any, index: number) => (
                    <div
                      key={feature.title}
                      className="p-2.5 sm:p-3 bg-cyber-black/70 backdrop-blur-sm rounded-lg border border-white/10"
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <h4 className="font-mono text-xs text-white/80 mb-0.5">{feature.title}</h4>
                      <p className="text-xs text-white/40">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Collapsed View Content */}
                <div className={`absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 transition-all duration-500 ${
                  isExpanded ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}>
                  <h3 className="font-heading text-base sm:text-xl font-bold text-white mb-1">
                    {homelabData.title}
                  </h3>
                  <p className="text-white/50 text-xs sm:text-sm max-w-xl">
                    Click to explore the honeypot infrastructure...
                  </p>
                </div>
              </div>
            </div>

            {/* Expand Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
              <span className="font-mono text-[10px] text-white/30">
                {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          {homelabData.stats.map((stat: any) => (
            <StatBox key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Stat Box Component
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 sm:p-4 bg-cyber-dark/50 rounded-lg border border-white/5">
      <p className="font-mono text-[10px] sm:text-xs text-white/40 mb-0.5">{label}</p>
      <p className="font-heading text-lg sm:text-xl font-bold text-cyber-green">{value}</p>
    </div>
  );
}

