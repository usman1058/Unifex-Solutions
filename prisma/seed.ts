import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.blogPostTagJoin.deleteMany()
  await prisma.blogPostTag.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.blogCategory.deleteMany()
  await prisma.caseStudyTagJoin.deleteMany()
  await prisma.caseStudyTag.deleteMany()
  await prisma.caseStudy.deleteMany()
  await prisma.service.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.fAQCategory.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.client.deleteMany()
  await prisma.stat.deleteMany()
  await prisma.certification.deleteMany()
  await prisma.pricingPackage.deleteMany()
  await prisma.contactSubmission.deleteMany()
  await prisma.newsletterSubscription.deleteMany()
  await prisma.siteContent.deleteMany()
  await prisma.scheduledPost.deleteMany()
  await prisma.socialAccount.deleteMany()
  await prisma.appSetting.deleteMany()
  await prisma.orderPayment.deleteMany()
  await prisma.serviceOrder.deleteMany()

  console.log('Creating services...')
  const services = await Promise.all([
    prisma.service.create({
      data: {
        slug: 'web-development',
        title: 'Web Development',
        description: 'High-performance, scalable web applications built with modern frontend frameworks and optimal SEO.',
        content: '<p>We build scalable, high-performance web applications using the latest web technologies. Our team specializes in React, Next.js, TypeScript, and modern web standards.</p>',
        icon: '🌐',
        features: JSON.stringify([
          'Custom Web Applications',
          'Responsive UI Architecture',
          'Progressive Web Apps (PWA)',
          'SEO & Performance Tuning'
        ]),
        techStack: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js']),
        process: JSON.stringify(['Discovery', 'UI/UX Architecture', 'Development', 'QA & Launch']),
        faqs: JSON.stringify([
          { question: 'What tech stack do you use for web development?', answer: 'We build with React, Next.js, TypeScript, and Node.js.' }
        ]),
        featured: true,
        displayOrder: 1,
        published: true
      }
    }),
    prisma.service.create({
      data: {
        slug: 'full-stack-development',
        title: 'Full-Stack Development',
        description: 'End-to-end custom software architecture, cloud microservices, and robust API integrations.',
        content: '<p>End-to-end software development combining modern frontend applications with scalable backend microservices, database management, and cloud APIs.</p>',
        icon: '⚡',
        features: JSON.stringify([
          'Enterprise Architecture',
          'RESTful & GraphQL APIs',
          'Database Design & Optimization',
          'Cloud Microservices'
        ]),
        techStack: JSON.stringify(['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'AWS']),
        process: JSON.stringify(['Requirements', 'Architecture Design', 'Agile Sprints', 'Deployment']),
        faqs: JSON.stringify([
          { question: 'Do you build custom API backends?', answer: 'Yes, we architect RESTful and GraphQL microservices.' }
        ]),
        featured: true,
        displayOrder: 2,
        published: true
      }
    }),
    prisma.service.create({
      data: {
        slug: 'crm-development-integration',
        title: 'CRM Development & Integration',
        description: 'Custom CRM systems, workflow automation, and enterprise database integrations.',
        content: '<p>Streamline business operations with tailor-made CRM solutions and seamless data synchronization across Salesforce, HubSpot, and proprietary databases.</p>',
        icon: '🔄',
        features: JSON.stringify([
          'Custom CRM Platforms',
          'Salesforce & HubSpot Integration',
          'Workflow Automation',
          'Analytics Dashboards'
        ]),
        techStack: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Salesforce API', 'Zapier']),
        process: JSON.stringify(['Workflow Audit', 'System Mapping', 'Integration', 'Staff Training']),
        faqs: JSON.stringify([
          { question: 'Can you integrate existing CRMs?', answer: 'Yes, we specialize in bidirectional CRM data sync.' }
        ]),
        featured: true,
        displayOrder: 3,
        published: true
      }
    }),
    prisma.service.create({
      data: {
        slug: 'cybersecurity-penetration-testing',
        title: 'Cybersecurity & Penetration Testing',
        description: 'Threat assessments, vulnerability testing, data encryption, and compliance audits.',
        content: '<p>Protect your digital assets with comprehensive vulnerability audits, penetration testing, automated threat detection, and compliance advisory.</p>',
        icon: '🛡️',
        features: JSON.stringify([
          'Penetration Testing',
          'Vulnerability Assessments',
          'Data Encryption Standards',
          'Compliance Audits (SOC 2 / GDPR)'
        ]),
        techStack: JSON.stringify(['Kali Linux', 'OWASP ZAP', 'Burp Suite', 'OpenSSL', 'AWS Shield']),
        process: JSON.stringify(['Security Audit', 'Penetration Test', 'Remediation Plan', 'Certification']),
        faqs: JSON.stringify([
          { question: 'How often should penetration testing be conducted?', answer: 'We recommend annual or post-major-release assessments.' }
        ]),
        featured: true,
        displayOrder: 4,
        published: true
      }
    }),
    prisma.service.create({
      data: {
        slug: 'digital-marketing',
        title: 'Digital Marketing',
        description: 'Data-driven growth marketing, performance campaigns, search optimization, and analytics.',
        content: '<p>Drive measurable ROI and customer acquisition with targeted digital marketing, SEO engineering, conversion optimization, and growth campaigns.</p>',
        icon: '📈',
        features: JSON.stringify([
          'Technical SEO & Growth',
          'Performance Campaign Management',
          'Conversion Rate Optimization (CRO)',
          'Analytics & Attribution Tracking'
        ]),
        techStack: JSON.stringify(['Google Analytics 4', 'Google Tag Manager', 'Semrush', 'HubSpot']),
        process: JSON.stringify(['Audit & Research', 'Strategy', 'Campaign Execution', 'Analytics & CRO']),
        faqs: JSON.stringify([
          { question: 'What channels do you focus on?', answer: 'We specialize in SEO, search marketing, and data-driven CRO.' }
        ]),
        featured: true,
        displayOrder: 5,
        published: true
      }
    })
  ])

  console.log('Creating case studies...')
  const caseStudies = await Promise.all([
    prisma.caseStudy.create({
      data: {
        slug: 'ecommerce-platform',
        title: 'E-Commerce Platform for Retail Giant',
        clientName: 'RetailMax Inc.',
        industry: 'E-Commerce',
        projectUrl: 'https://example.com',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
        overview: 'We built a modern, scalable e-commerce platform that increased sales by 150% and improved user experience significantly.',
        problem: 'RetailMax was struggling with an outdated e-commerce platform that was slow, difficult to maintain, and couldn\'t handle peak traffic during sales events.',
        solution: 'We built a headless e-commerce solution using Next.js, a custom API, and modern payment integrations. The new platform is 3x faster and can handle 10x the traffic.',
        process: JSON.stringify([
          'Analyzed existing platform and identified bottlenecks',
          'Designed new architecture for scalability',
          'Built headless commerce solution',
          'Integrated payment gateways and inventory systems',
          'Implemented performance optimizations',
          'Conducted load testing and launched'
        ]),
        results: JSON.stringify([
          { label: 'Sales Increase', value: '150%' },
          { label: 'Page Load Time', value: '-67%' },
          { label: 'Conversion Rate', value: '+45%' },
          { label: 'Traffic Capacity', value: '10x' }
        ]),
        techStack: JSON.stringify(['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'AWS']),
        screenshots: JSON.stringify([
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          'https://images.unsplash.com/photo-1557821552-17105176677c?w=800'
        ]),
        featured: true,
        displayOrder: 1,
        published: true,
        serviceId: services[0].id
      }
    }),
    prisma.caseStudy.create({
      data: {
        slug: 'mobile-banking-app',
        title: 'Mobile Banking App',
        clientName: 'SecureBank',
        industry: 'FinTech',
        projectUrl: 'https://example.com',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
        overview: 'A secure, user-friendly mobile banking application that serves over 500,000 users daily.',
        problem: 'SecureBank needed a modern mobile banking solution that provided excellent user experience while maintaining the highest security standards.',
        solution: 'We developed a React Native app with biometric authentication, real-time notifications, and seamless integration with existing banking systems.',
        process: JSON.stringify([
          'Security requirements analysis',
          'User experience design',
          'Secure development practices',
          'Integration with banking systems',
          'Security testing and certification',
          'Rollout to 500k+ users'
        ]),
        results: JSON.stringify([
          { label: 'Active Users', value: '500K+' },
          { label: 'App Store Rating', value: '4.8/5' },
          { label: 'Transaction Speed', value: '< 2s' },
          { label: 'Security Breaches', value: '0' }
        ]),
        techStack: JSON.stringify(['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Firebase', 'AWS']),
        screenshots: JSON.stringify([
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800'
        ]),
        featured: true,
        displayOrder: 2,
        published: true,
        serviceId: services[1].id
      }
    }),
    prisma.caseStudy.create({
      data: {
        slug: 'cybersecurity-compliance-platform',
        title: 'Enterprise Cybersecurity Compliance Dashboard',
        clientName: 'Northbridge Holdings',
        industry: 'Security',
        projectUrl: 'https://example.com',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        heroImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200',
        overview: 'A centralized threat-monitoring and compliance dashboard that cut audit preparation time by 70% for a multi-national enterprise.',
        problem: 'Northbridge managed security and compliance across six countries but relied on fragmented spreadsheets and manual audits that took weeks to compile.',
        solution: 'We engineered a real-time compliance platform aggregating threat telemetry from 40+ sources with automated SOC 2 and GDPR evidence collection, remediation tracking, and executive reporting.',
        process: JSON.stringify([
          'Mapped regulatory obligations and data sources',
          'Designed a unified threat & compliance data model',
          'Built automated evidence-gathering pipelines',
          'Developed executive dashboards and alerting',
          'Rolled out role-based access and audit trails'
        ]),
        results: JSON.stringify([
          { label: 'Audit Prep Time', value: '-90%' },
          { label: 'Threat Detection', value: 'Real-time' },
          { label: 'Compliance Gaps', value: '+38% Found' },
          { label: 'Integrations', value: '40+' }
        ]),
        techStack: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'ClickHouse', 'Python', 'AWS']),
        screenshots: JSON.stringify([
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'
        ]),
        featured: false,
        displayOrder: 3,
        published: true,
        serviceId: services[3].id
      }
    })
  ])

  // Add tags to case studies
  const tags = await Promise.all([
    prisma.caseStudyTag.create({ data: { name: 'E-Commerce', slug: 'ecommerce' } }),
    prisma.caseStudyTag.create({ data: { name: 'React', slug: 'react' } }),
    prisma.caseStudyTag.create({ data: { name: 'Next.js', slug: 'nextjs' } }),
    prisma.caseStudyTag.create({ data: { name: 'Mobile', slug: 'mobile' } }),
    prisma.caseStudyTag.create({ data: { name: 'FinTech', slug: 'fintech' } })
  ])

  await Promise.all([
    prisma.caseStudyTagJoin.create({
      data: { caseStudyId: caseStudies[0].id, tagId: tags[0].id }
    }),
    prisma.caseStudyTagJoin.create({
      data: { caseStudyId: caseStudies[0].id, tagId: tags[1].id }
    }),
    prisma.caseStudyTagJoin.create({
      data: { caseStudyId: caseStudies[0].id, tagId: tags[2].id }
    }),
    prisma.caseStudyTagJoin.create({
      data: { caseStudyId: caseStudies[1].id, tagId: tags[3].id }
    }),
    prisma.caseStudyTagJoin.create({
      data: { caseStudyId: caseStudies[1].id, tagId: tags[4].id }
    })
  ])

  console.log('Creating blog categories and posts...')
  const blogCategories = await Promise.all([
    prisma.blogCategory.create({
      data: { name: 'Technology', slug: 'technology', description: 'Latest in technology' }
    }),
    prisma.blogCategory.create({
      data: { name: 'Design', slug: 'design', description: 'Design insights and trends' }
    }),
    prisma.blogCategory.create({
      data: { name: 'Business', slug: 'business', description: 'Business and strategy' }
    })
  ])

  const blogTags = await Promise.all([
    prisma.blogPostTag.create({ data: { name: 'Web Development', slug: 'web-development' } }),
    prisma.blogPostTag.create({ data: { name: 'React', slug: 'react' } }),
    prisma.blogPostTag.create({ data: { name: 'UI/UX', slug: 'ui-ux' } }),
    prisma.blogPostTag.create({ data: { name: 'Startup', slug: 'startup' } })
  ])

  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        slug: 'why-nextjs-is-perfect-for-your-next-project',
        title: 'Why Next.js is Perfect for Your Next Project',
        excerpt: 'Discover why Next.js has become the go-to framework for modern web applications.',
        content: '<p>Next.js has emerged as one of the most popular React frameworks for building modern web applications. In this article, we explore why...</p>',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        author: 'John Doe',
        readTime: 5,
        featured: true,
        published: true,
        publishedAt: new Date(),
        categoryId: blogCategories[0].id
      }
    }),
    prisma.blogPost.create({
      data: {
        slug: 'designing-for-accessibility',
        title: 'Designing for Accessibility: A Complete Guide',
        excerpt: 'Learn how to create inclusive designs that work for everyone.',
        content: '<p>Accessibility is not just a nice-to-have feature—it\'s essential. In this comprehensive guide, we cover...</p>',
        coverImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800',
        author: 'Jane Smith',
        readTime: 8,
        featured: true,
        published: true,
        publishedAt: new Date(),
        categoryId: blogCategories[1].id
      }
    }),
    prisma.blogPost.create({
      data: {
        slug: 'how-to-build-scalable-applications',
        title: 'How to Build Scalable Applications from Day One',
        excerpt: 'Best practices for building applications that can grow with your business.',
        content: '<p>Building for scalability from the start saves time and resources in the long run. Here\'s our approach...</p>',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=800',
        author: 'Mike Johnson',
        readTime: 6,
        featured: false,
        published: true,
        publishedAt: new Date(),
        categoryId: blogCategories[0].id
      }
    })
  ])

  // Add tags to blog posts
  await Promise.all([
    prisma.blogPostTagJoin.create({ data: { postId: blogPosts[0].id, tagId: blogTags[0].id } }),
    prisma.blogPostTagJoin.create({ data: { postId: blogPosts[0].id, tagId: blogTags[1].id } }),
    prisma.blogPostTagJoin.create({ data: { postId: blogPosts[1].id, tagId: blogTags[2].id } }),
    prisma.blogPostTagJoin.create({ data: { postId: blogPosts[2].id, tagId: blogTags[0].id } }),
    prisma.blogPostTagJoin.create({ data: { postId: blogPosts[2].id, tagId: blogTags[3].id } })
  ])

  console.log('Creating FAQ categories and FAQs...')
  const faqCategories = await Promise.all([
    prisma.fAQCategory.create({
      data: { name: 'General', slug: 'general', description: 'General questions' }
    }),
    prisma.fAQCategory.create({
      data: { name: 'Services', slug: 'services', description: 'Questions about our services' }
    }),
    prisma.fAQCategory.create({
      data: { name: 'Pricing', slug: 'pricing', description: 'Pricing related questions' }
    })
  ])

  await Promise.all([
    prisma.fAQ.create({
      data: {
        question: 'What industries do you work with?',
        answer: 'We work with clients across various industries including e-commerce, fintech, healthcare, education, and more.',
        displayOrder: 1,
        published: true,
        categoryId: faqCategories[0].id
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'How long does a typical project take?',
        answer: 'Project timelines vary based on complexity. A simple website might take 4-6 weeks, while complex applications can take 3-6 months.',
        displayOrder: 2,
        published: true,
        categoryId: faqCategories[1].id
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do you offer ongoing support?',
        answer: 'Yes, we offer various maintenance and support packages to ensure your application runs smoothly after launch.',
        displayOrder: 3,
        published: true,
        categoryId: faqCategories[1].id
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'What is your pricing model?',
        answer: 'We offer both fixed-price and hourly billing depending on the project. Contact us for a detailed quote tailored to your needs.',
        displayOrder: 1,
        published: true,
        categoryId: faqCategories[2].id
      }
    }),
    prisma.fAQ.create({
      data: {
        question: 'Do you require a deposit?',
        answer: 'Yes, we typically require a 30-50% deposit to begin work, with the remaining balance due upon completion.',
        displayOrder: 2,
        published: true,
        categoryId: faqCategories[2].id
      }
    })
  ])

  console.log('Creating testimonials...')
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Sarah Johnson',
        role: 'CEO',
        company: 'TechStart Inc.',
        content: 'Unifex Solutions transformed our digital presence. Their expertise and dedication exceeded our expectations.',
        rating: 5,
        featured: true,
        displayOrder: 1,
        published: true
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Michael Chen',
        role: 'CTO',
        company: 'GrowthHub',
        content: 'The team at Unifex delivered a complex project on time and within budget. Highly recommend their services.',
        rating: 5,
        featured: true,
        displayOrder: 2,
        published: true
      }
    }),
    prisma.testimonial.create({
      data: {
        name: 'Emily Rodriguez',
        role: 'Product Manager',
        company: 'RetailMax',
        content: 'Our new e-commerce platform has significantly boosted our sales. Great work by the Unifex team!',
        rating: 5,
        featured: true,
        displayOrder: 3,
        published: true
      }
    })
  ])

  console.log('Creating team members...')
  await Promise.all([
    prisma.teamMember.create({
      data: {
        name: 'Alex Thompson',
        role: 'CEO & Founder',
        bio: '15+ years of experience in technology and business leadership.',
        featured: true,
        displayOrder: 1,
        published: true
      }
    }),
    prisma.teamMember.create({
      data: {
        name: 'Sarah Williams',
        role: 'CTO',
        bio: 'Expert in scalable architecture and cloud technologies.',
        featured: true,
        displayOrder: 2,
        published: true
      }
    }),
    prisma.teamMember.create({
      data: {
        name: 'David Park',
        role: 'Lead Designer',
        bio: 'Award-winning designer with a passion for user experience.',
        featured: true,
        displayOrder: 3,
        published: true
      }
    }),
    prisma.teamMember.create({
      data: {
        name: 'Maria Garcia',
        role: 'Senior Developer',
        bio: 'Full-stack developer specializing in React and Node.js.',
        featured: false,
        displayOrder: 4,
        published: true
      }
    })
  ])

  console.log('Creating clients...')
  await Promise.all([
    prisma.client.create({
      data: { name: 'TechStart Inc.', featured: true, displayOrder: 1, published: true }
    }),
    prisma.client.create({
      data: { name: 'GrowthHub', featured: true, displayOrder: 2, published: true }
    }),
    prisma.client.create({
      data: { name: 'RetailMax', featured: true, displayOrder: 3, published: true }
    }),
    prisma.client.create({
      data: { name: 'SecureBank', featured: true, displayOrder: 4, published: true }
    }),
    prisma.client.create({
      data: { name: 'HealthPlus', featured: false, displayOrder: 5, published: true }
    }),
    prisma.client.create({
      data: { name: 'EduTech Solutions', featured: false, displayOrder: 6, published: true }
    })
  ])

  console.log('Creating stats...')
  await Promise.all([
    prisma.stat.create({
      data: { label: 'Projects Completed', value: '150+', displayOrder: 1, published: true }
    }),
    prisma.stat.create({
      data: { label: 'Happy Clients', value: '100+', displayOrder: 2, published: true }
    }),
    prisma.stat.create({
      data: { label: 'Team Members', value: '25+', displayOrder: 3, published: true }
    }),
    prisma.stat.create({
      data: { label: 'Years Experience', value: '8+', displayOrder: 4, published: true }
    })
  ])

  console.log('Creating certifications...')
  await Promise.all([
    prisma.certification.create({
      data: { name: 'AWS Certified Partner', issuer: 'Amazon Web Services', displayOrder: 1, published: true }
    }),
    prisma.certification.create({
      data: { name: 'Google Cloud Partner', issuer: 'Google', displayOrder: 2, published: true }
    }),
    prisma.certification.create({
      data: { name: 'Microsoft Gold Partner', issuer: 'Microsoft', displayOrder: 3, published: true }
    })
  ])

  console.log('Creating pricing packages...')
  await Promise.all([
    prisma.pricingPackage.create({
      data: {
        name: 'Starter',
        description: 'Perfect for small projects and startups',
        price: '$2,999',
        currency: 'USD',
        features: JSON.stringify([
          'Responsive Website',
          '5 Pages',
          'Contact Form',
          'Basic SEO',
          '1 Month Support',
          'Domain Setup'
        ]),
        popular: false,
        displayOrder: 1,
        published: true
      }
    }),
    prisma.pricingPackage.create({
      data: {
        name: 'Professional',
        description: 'Ideal for growing businesses',
        price: '$7,999',
        currency: 'USD',
        features: JSON.stringify([
          'Custom Web Application',
          '15 Pages',
          'CMS Integration',
          'Advanced SEO',
          '3 Months Support',
          'E-commerce Ready',
          'Payment Integration',
          'Analytics Setup'
        ]),
        popular: true,
        displayOrder: 2,
        published: true
      }
    }),
    prisma.pricingPackage.create({
      data: {
        name: 'Enterprise',
        description: 'For large-scale projects',
        price: 'Custom Quote',
        currency: 'USD',
        features: JSON.stringify([
          'Full-Stack Application',
          'Unlimited Pages',
          'Custom CMS',
          'Enterprise SEO',
          '12 Months Support',
          'Custom Integrations',
          'Advanced Analytics',
          'Dedicated Team',
          'Priority Support',
          'SLA Guarantee'
        ]),
        popular: false,
        displayOrder: 3,
        published: true
      }
    })
  ])

  console.log('Creating site content...')
  await Promise.all([
    prisma.siteContent.create({
      data: {
        key: 'home-hero-title',
        value: 'Transform Your Digital Presence',
        type: 'text',
        section: 'home-hero',
        description: 'Home page hero title'
      }
    }),
    prisma.siteContent.create({
      data: {
        key: 'home-hero-subtitle',
        value: 'We build innovative digital solutions that drive growth and success for your business.',
        type: 'text',
        section: 'home-hero',
        description: 'Home page hero subtitle'
      }
    }),
    prisma.siteContent.create({
      data: {
        key: 'home-cta-text',
        value: 'Start Your Project',
        type: 'text',
        section: 'home-cta',
        description: 'Home page CTA button text'
      }
    }),
    prisma.siteContent.create({
      data: {
        key: 'contact-email',
        value: 'hello@unifexsolutions.com',
        type: 'text',
        section: 'contact',
        description: 'Contact email address'
      }
    }),
    prisma.siteContent.create({
      data: {
        key: 'contact-phone',
        value: '+1 (555) 123-4567',
        type: 'text',
        section: 'contact',
        description: 'Contact phone number'
      }
    })
  ])

  console.log('Creating app settings...')
  await Promise.all([
    prisma.appSetting.create({
      data: {
        key: 'ai_provider',
        value: 'openai',
        type: 'text',
        category: 'ai',
        description: 'Primary AI provider (openai, anthropic, google, custom)',
      },
    }),
    prisma.appSetting.create({
      data: {
        key: 'ai_model',
        value: 'gpt-4o-mini',
        type: 'text',
        category: 'ai',
        description: 'Default model used for AI content generation',
      },
    }),
    prisma.appSetting.create({
      data: {
        key: 'ai_tone',
        value: 'professional',
        type: 'text',
        category: 'ai',
        description: 'Tone of AI-generated content',
      },
    }),
    prisma.appSetting.create({
      data: {
        key: 'ai_brand',
        value: 'Unifex Solutions',
        type: 'text',
        category: 'ai',
        description: 'Agency/brand name used as AI context',
      },
    }),
  ])

  console.log('Creating bank account settings...')
  await Promise.all([
    prisma.appSetting.create({
      data: {
        key: 'bank_account_name',
        value: 'Unifex Solutions Ltd',
        type: 'text',
        category: 'bank',
        description: 'Account holder / beneficiary name',
      },
    }),
    prisma.appSetting.create({
      data: {
        key: 'bank_account_number',
        value: '0123456789',
        type: 'text',
        category: 'bank',
        description: 'Bank account number',
      },
    }),
    prisma.appSetting.create({
      data: {
        key: 'bank_sort_code',
        value: '12-34-56',
        type: 'text',
        category: 'bank',
        description: 'Bank sort code / routing',
      },
    }),
    prisma.appSetting.create({
      data: {
        key: 'bank_iban',
        value: '',
        type: 'text',
        category: 'bank',
        description: 'IBAN (international)',
      },
    }),
    prisma.appSetting.create({
      data: {
        key: 'bank_swift',
        value: '',
        type: 'text',
        category: 'bank',
        description: 'SWIFT / BIC code',
      },
    }),
    prisma.appSetting.create({
      data: {
        key: 'bank_address',
        value: '',
        type: 'text',
        category: 'bank',
        description: 'Bank address',
      },
    }),
    prisma.appSetting.create({
      data: {
        key: 'bank_instructions',
        value: 'Please use your order number as the payment reference.',
        type: 'text',
        category: 'bank',
        description: 'Instructions shown to clients when making a transfer',
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
