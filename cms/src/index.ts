import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Grant public access to our new APIs
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const permissionsToAdd = [
        'api::project.project.find',
        'api::project.project.findOne',
        'api::certification.certification.find',
        'api::certification.certification.findOne',
        'api::homelab.homelab.find',
        'api::homelab.homelab.findOne',
      ];
      
      for (const action of permissionsToAdd) {
        const existingPermission = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { role: publicRole.id, action } });
          
        if (!existingPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action,
              role: publicRole.id,
            },
          });
        }
      }
    }

    // 2. Seed Projects
    const projects = [
      {
        title: 'IoT Biometric Pulse & Oxygen Tracker',
        description: 'Developed a biometric monitoring system using a Raspberry Pi and a Pulse Oximeter sensor to capture and analyze real-time heart rate and oxygen saturation (SpO₂) data.',
        tags: 'Raspberry Pi, IoT, Python, Sensors',
        color: 'from-emerald-500/20 to-teal-500/20',
      },
      {
        title: 'Adaptive Seismic Alert System',
        description: 'Successfully pivoted from a sign-language translation glove to a functional earthquake detector in under 48 hours after hardware failure. Re-engineered motion sensors hardware logic to meet presentation requirements.',
        tags: 'Hardware, Arduino, C++, Rapid Prototyping',
        color: 'from-blue-500/20 to-cyan-500/20',
      },
      {
        title: 'Projekti Honeypot',
        description: 'Led a team of six to architect a multi-node honeynet using Cowrie, Suricata, and OpenWrt, conducting a full-scale Red Team/Blue Team simulation to analyze real-time intrusion detection and adversary behavior.',
        tags: 'Cybersecurity, Honeypot, Suricata, Team Lead',
        color: 'from-red-500/20 to-orange-500/20',
      },
    ];

    const projectUID = 'api::project.project' as any;
    const projectCount = await strapi.documents(projectUID).count({});
    if (projectCount === 0) {
      for (const project of projects) {
        await strapi.documents(projectUID).create({
          data: project,
          status: 'published',
        });
      }
      console.log('Successfully seeded projects data.');
    }

    // 3. Seed Certifications
    const certifications = [
      {
        name: 'Fortinet NSE3',
        issuer: 'Fortinet',
        date: '2026',
        category: 'Network Security',
        description: 'Network Security Associate certification demonstrating expertise in Fortinet Firewall administration.',
      },
      {
        name: 'AWS Cloud Practitioner Essentials',
        issuer: 'Amazon Web Services',
        date: '2025',
        category: 'Cloud Computing',
        description: 'Foundational cloud computing knowledge and AWS services understanding.',
      },
      {
        name: 'Cisco Introduction to Cybersecurity',
        issuer: 'Cisco',
        date: '2025',
        category: 'Cybersecurity',
        description: 'Comprehensive introduction to cybersecurity concepts and best practices.',
      },
      {
        name: 'Junction Hackathon 2025',
        issuer: 'Junction',
        date: '2025',
        category: 'Hackathon',
        description: "Participation in one of Europe's largest hackathon events.",
      },
      {
        name: 'Google Prompting Essentials',
        issuer: 'Google',
        date: '2026',
        category: 'AI/ML',
        description: 'Mastering effective prompt engineering for large language models.',
      },
    ];

    const certUID = 'api::certification.certification' as any;
    const certCount = await strapi.documents(certUID).count({});
    if (certCount === 0) {
      for (const cert of certifications) {
        await strapi.documents(certUID).create({
          data: cert,
          status: 'published',
        });
      }
      console.log('Successfully seeded certifications data.');
    }

    // 4. Seed Homelabs
    const homelabs = [
      {
        title: 'Live Attack Surface Monitoring with T-Pot',
        description: 'Deployed a containerized T-Pot honeypot environment to monitor real-world cyberattacks, utilizing the Elastic Stack for log analysis while mastering network security via firewall configuration and Docker orchestration.',
        status: 'Active',
        onlineText: 'Online',
        features: [
          { title: 'Real-time Monitoring', description: 'Live attack surface visualization' },
          { title: 'Global Honeypot', description: 'Multi-node deployment worldwide' },
          { title: 'Security Analysis', description: 'Deep packet inspection' },
          { title: 'Log Management', description: 'Centralized Elasticsearch logging' },
        ],
        stats: [
          { label: 'Containers', value: '20+' },
          { label: 'Attack Types', value: '50+' },
          { label: 'Uptime', value: '99.9%' },
          { label: 'Logs/Day', value: '10K+' },
        ]
      }
    ];

    const homelabUID = 'api::homelab.homelab' as any;
    const homelabCount = await strapi.documents(homelabUID).count({});
    if (homelabCount === 0) {
      for (const h of homelabs) {
        await strapi.documents(homelabUID).create({
          data: h,
          status: 'published',
        });
      }
      console.log('Successfully seeded homelab data.');
    }
  },
};


