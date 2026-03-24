import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const fs = require('fs');
    const path = require('path');
    
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
        'api::profile.profile.find',
        'api::profile.profile.findOne',
        'api::current-focus.current-focus.find',
        'api::current-focus.current-focus.findOne',
        'api::experience.experience.find',
        'api::experience.experience.findOne',
        'api::membership.membership.find',
        'api::membership.membership.findOne',
        'api::event.event.find',
        'api::event.event.findOne',
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

    // 2. Seed Profile
    const profileUID = 'api::profile.profile' as any;
    let profile = await strapi.documents(profileUID).findFirst({
      populate: ['cv'],
    });
    
    if (!profile || !profile.cv) {
      const cvPath = path.join(process.cwd(), '..', 'public', 'cv', 'Min_Set_Ko_CV.pdf');
      let uploadedFile;

      if (fs.existsSync(cvPath)) {
        console.log(`📡 Attempting to upload CV from: ${cvPath}`);
        try {
          const stats = fs.statSync(cvPath);
          const fileData = {
            path: cvPath,
            tmpPath: cvPath,
            filepath: cvPath,
            name: 'Min_Set_Ko_CV.pdf',
            type: 'application/pdf',
            size: stats.size,
          };

          const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
            data: {},
            files: fileData,
          });
          uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;
          console.log('✅ Successfully uploaded CV file.');
        } catch (err) {
          console.error('❌ Failed to upload CV file:', err.message, err.stack);
        }
      } else {
        console.log(`⚠️  CV file not found at ${cvPath}`);
      }

      const profileData = {
        name: 'Min Set Ko',
        role: 'AI Security Researcher | 3rd Year IoT Student @ Savonia UAS',
        description: '3rd-year IoT student at Savonia UAS with a strong background in networking and IoT, now specializing in AI security. This website serves as a comprehensive archive of my journey, technical research, and projects.',
        githubUrl: 'https://github.com/eurusfox-24',
        linkedinUrl: 'https://www.linkedin.com/in/min-set-ko-4342121b6',
        tryHackMeId: '884096',
        email: 'minsetko@example.com',
        cv: uploadedFile ? uploadedFile.id : null,
        location: 'Kuopio, Finland',
      };

      if (!profile) {
        await strapi.documents(profileUID).create({
          data: profileData,
          status: 'published',
        });
        console.log('Successfully seeded profile data.');
      } else {
        await strapi.documents(profileUID).update({
          documentId: profile.documentId,
          data: profileData,
          status: 'published',
        });
        console.log('Successfully updated profile data with CV file.');
      }
    }

    // 3. Seed Current Focus
    const currentFocusUID = 'api::current-focus.current-focus' as any;
    const currentFocus = await strapi.documents(currentFocusUID).findFirst({});
    if (!currentFocus || currentFocus.title === 'jsnfi') {
      const data = {
        title: 'Agentic OT Honeynet for ICS/SCADA',
        subtitle: "Bachelor's Thesis Project",
        description: 'Developing a sophisticated agentic honeynet system designed for Industrial Control Systems (ICS) and SCADA environments. This research leverages AI-driven agents to create high-fidelity, interactive simulations of operational technology networks, enabling deep analysis of adversary tactics and automated threat response in industrial settings.',
        tags: 'ICS/SCADA, OT Security, Agentic AI, Honeynet, Threat Intelligence',
        status: 'In Progress / Thesis Phase',
        defenseStrategy: 'Implementing proactive deception mechanisms to safeguard critical infrastructure.',
        aiIntegration: 'Utilizing Large Language Models to drive autonomous agent behavior and realistic interaction.',
      };

      if (currentFocus) {
        await strapi.documents(currentFocusUID).update({
          documentId: currentFocus.documentId,
          data,
          status: 'published',
        });
      } else {
        await strapi.documents(currentFocusUID).create({
          data,
          status: 'published',
        });
      }
      console.log('Successfully seeded/updated current focus data.');
    }

    // 4. Seed Experiences
    const experienceUID = 'api::experience.experience' as any;
    const existingExps = await strapi.documents(experienceUID).findMany({});
    const hasTechDefense = existingExps.some(e => e.company === 'Tech Defense Solutions');
    
    if (!hasTechDefense) {
      const experiences = [
      ];
      for (const exp of experiences) {
        await strapi.documents(experienceUID).create({
          data: exp,
          status: 'published',
        });
      }
      console.log('Successfully seeded additional experiences data.');
    } else {
      // Migrate back to dateRange
      for (const exp of existingExps) {
        if (!exp.dateRange) {
          let dateRange = '2022 - Present';
          if (exp.company === 'Tech Defense Solutions') dateRange = 'Jan 2024 - Present';
          if (exp.company === 'Global Systems Inc.') dateRange = 'May 2022 - Dec 2023';
          
          await strapi.documents(experienceUID).update({
            documentId: exp.documentId,
            data: { dateRange },
            status: 'published',
          });
        }
      }
    }

    // 5. Seed Projects
    const projects = [
      {
        title: 'IoT Biometric Pulse & Oxygen Tracker',
        description: 'Developed a biometric monitoring system using a Raspberry Pi and a Pulse Oximeter sensor to capture and analyze real-time heart rate and oxygen saturation (SpO₂) data.',
        tags: 'Raspberry Pi, IoT, Python, Sensors',
        color: 'from-emerald-500/20 to-teal-500/20',
        githubUrl: 'https://github.com/eurusfox-24/iot-pulse-oximeter',
      },
      {
        title: 'Adaptive Seismic Alert System',
        description: 'Successfully pivoted from a sign-language translation glove to a functional earthquake detector in under 48 hours after hardware failure. Re-engineered motion sensors hardware logic to meet presentation requirements.',
        tags: 'Hardware, Arduino, C++, Rapid Prototyping',
        color: 'from-blue-500/20 to-cyan-500/20',
        githubUrl: 'https://github.com/eurusfox-24/seismic-alert',
      },
      {
        title: 'Projekti Honeypot',
        description: 'Led a team of six to architect a multi-node honeynet using Cowrie, Suricata, and OpenWrt, conducting a full-scale Red Team/Blue Team simulation to analyze real-time intrusion detection and adversary behavior.',
        tags: 'Cybersecurity, Honeypot, Suricata, Team Lead',
        color: 'from-red-500/20 to-orange-500/20',
        githubUrl: 'https://github.com/eurusfox-24/projekti-honeypot',
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
    } else {
      // Migrate existing projects
      const existingProjects = await strapi.documents(projectUID).findMany({});
      for (const proj of existingProjects) {
        if (!proj.githubUrl) {
          const matchingSeed = projects.find(p => p.title === proj.title);
          if (matchingSeed) {
            await strapi.documents(projectUID).update({
              documentId: proj.documentId,
              data: { githubUrl: matchingSeed.githubUrl },
              status: 'published',
            });
          }
        }
      }
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

    // 5. Seed Certification Images
    const certsWithNoImage = await strapi.documents(certUID).findMany({
      filters: { image: { $null: true } },
    });

    if (certsWithNoImage.length > 0) {
      console.log(`📡 Seeding images for ${certsWithNoImage.length} certifications...`);

      const imageMap = {
        'Fortinet NSE3': 'Fortinet_NSE3.jpeg',
        'AWS Cloud Practitioner Essentials': 'aws_cert.jpeg',
        'Cisco Introduction to Cybersecurity': 'Cisco_CysaIntro.jpeg',
        'Junction Hackathon 2025': 'junctionHackathonCertificate.jpeg',
        'Google Prompting Essentials': 'googleprompting.jpeg',
      };

      for (const cert of certsWithNoImage) {
        const fileName = (imageMap as any)[cert.name];
        if (fileName) {
          const filePath = path.join(process.cwd(), '..', 'public', 'certs', fileName);
          if (fs.existsSync(filePath)) {
            try {
              const stats = fs.statSync(filePath);
              const fileData = {
                path: filePath,
                tmpPath: filePath,
                filepath: filePath,
                name: fileName,
                type: 'image/jpeg',
                size: stats.size,
              };

              const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
                data: {},
                files: fileData,
              });

              const uploadedFile = Array.isArray(uploadedFiles) ? uploadedFiles[0] : uploadedFiles;

              if (uploadedFile) {
                await strapi.documents(certUID).update({
                  documentId: cert.documentId,
                  data: {
                    image: uploadedFile.id,
                  },
                  status: 'published',
                });
                console.log(`  ✅ Associated ${fileName} with ${cert.name}`);
              }
            } catch (err) {
              console.error(`  ❌ Failed to upload image for ${cert.name}:`, err);
            }
          } else {
            console.log(`  ⚠️  Image not found at ${filePath}`);
          }
        }
      }
    }

    // 6. Seed Memberships
    const membershipUID = 'api::membership.membership' as any;
    const membershipCount = await strapi.documents(membershipUID).count({});
    if (membershipCount === 0) {
      const memberships = [
        { title: "KuoSec", description: "Active member of the Kuopio Information Security community." },
        { title: "Tietoala ry", description: "Association of IT sector Employees." }
      ];
      for (const m of memberships) {
        await strapi.documents(membershipUID).create({
          data: m,
          status: 'published',
        });
      }
      console.log('Successfully seeded memberships data.');
    }

    // 7. Seed Events
    const eventUID = 'api::event.event' as any;
    const eventCount = await strapi.documents(eventUID).count({});
    if (eventCount === 0) {
      const events = [
        {
          title: "Junction Hackathon 2025",
          description: "Europe's largest hackathon. Worked on AI-driven security challenges.",
          date: "2025",
          location: "Espoo"
        },
        {
          title: "Helsinki AI Startup",
          description: "Networking and exploring AI innovations at Helsinki XR Center.",
          date: "2025",
          location: "Helsinki XR Center"
        },
        {
          title: "HelSec Meetup",
          description: "Monthly meetup for the Helsinki information security community.",
          date: "2025",
          location: "Helsinki"
        },
        {
          title: "KuoSec Meetup",
          description: "Local security community meetup in Kuopio.",
          date: "2025",
          location: "Kuopio"
        }
      ];
      for (const e of events) {
        await strapi.documents(eventUID).create({
          data: e,
          status: 'published',
        });
      }
      console.log('Successfully seeded events data.');
    }
  },
};


