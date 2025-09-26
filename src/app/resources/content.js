const company = {
    name: 'AmalTech',
    tagline: 'Enabling Digital Industries',
    description: 'Leading manufacturer of smart devices, IoT solutions, and industrial automation products',
    logo: '/trademark/icon-dark.svg',
    location: 'Africa/Lagos',
    founded: '2009',
    employees: '150+',
    certifications: ['ISO 9001', 'CE', 'SON', 'FCC']
}

const newsletter = {
    display: true,
    title: <>Subscribe to AmalTech Updates</>,
    description: <>Stay updated with our latest innovations, product launches, and industry insights</>
}

const social = [
    {
        name: 'LinkedIn',
        icon: 'linkedin',
        link: 'https://www.linkedin.com/company/amaltech',
    },
    {
        name: 'X',
        icon: 'x',
        link: 'https://twitter.com/amaltech',
    },
    {
        name: 'Facebook',
        icon: 'facebook',
        link: 'https://facebook.com/amaltech',
    },
    {
        name: 'Email',
        icon: 'email',
        link: 'mailto:info@amaltech.com',
    },
]

const home = {
    label: 'Home',
    title: `${company.name} - ${company.tagline}`,
    description: company.description,
    headline: <>Enabling Digital Industries</>,
    subline: <>AmalTech is a leading manufacturer of smart devices, IoT solutions, and industrial automation products. We specialize in PCB design, embedded systems, and innovative technology solutions that power the future.</>,
    hero: {
        title: 'WE ARE BUILDING THE FUTURE OF STEEL',
        subtitle: 'Leading the transformation of steel manufacturing through innovative technology solutions',
        description: 'From smart meters to industrial automation, we\'re building the technology that powers tomorrow\'s steel industries with cutting-edge IoT solutions and advanced manufacturing capabilities.',
        tagline: 'Founded in 1995',
        cta: {
            text: 'LEARN MORE',
            href: '/about',
            variant: 'primary'
        },
        secondaryCta: {
            text: 'Explore Solutions',
            href: '/solutions',
            variant: 'outline'
        },
        background: {
            type: 'gradient',
            gradient: 'bg-gradient-to-br from-orange-400 via-red-500 to-orange-600',
            overlay: false
        },
        stats: [
            {
                value: '25+',
                label: 'Years of Innovation'
            },
            {
                value: '100+',
                label: 'Steel Projects'
            },
            {
                value: '15+',
                label: 'Countries Served'
            },
            {
                value: 'ISO',
                label: 'Quality Certified'
            }
        ]
    },
    stats: {
        title: 'Our Impact',
        years: '15+ Years',
        products: '50+ Products',
        countries: '25+ Countries',
        certifications: 'ISO Certified'
    },
    sections: {
        featuredProducts: 'Featured Products',
        capabilities: 'Manufacturing Capabilities',
        partners: 'Partners & Certifications',
        rd: 'R&D Highlights',
        latestNews: 'Latest Updates'
    }
}

const about = {
    label: 'About Us',
    title: 'About AmalTech',
    description: `Learn about ${company.name}'s mission, vision, and commitment to innovation`,
    tableOfContent: {
        display: true,
        subItems: false
    },
    overview: {
        display: true,
        title: 'Company Overview',
        description: `${company.name} is a leading technology company specializing in smart devices, IoT solutions, and industrial automation. Founded with a vision to enable digital transformation across industries, we have grown into a trusted partner for businesses worldwide.`
    },
    mission: {
        display: true,
        title: 'Mission & Vision',
        mission: 'To enable digital industries through innovative technology solutions that drive efficiency, sustainability, and growth.',
        vision: 'To be the global leader in smart device manufacturing and IoT solutions, empowering industries to thrive in the digital age.'
    },
    leadership: {
        display: true,
        title: 'Leadership Team',
        description: 'Meet the executives and board members driving AmalTech\'s success',
        members: [
            {
                name: 'Dr. Sarah Johnson',
                role: 'Chief Executive Officer',
                bio: 'Leading AmalTech\'s strategic vision and global expansion.',
                image: '/images/leadership/ceo.jpg'
            },
            {
                name: 'Michael Chen',
                role: 'Chief Technology Officer',
                bio: 'Driving innovation in IoT and embedded systems development.',
                image: '/images/leadership/cto.jpg'
            },
            {
                name: 'Lisa Rodriguez',
                role: 'Chief Operations Officer',
                bio: 'Overseeing manufacturing excellence and supply chain optimization.',
                image: '/images/leadership/coo.jpg'
            }
        ]
    },
    csr: {
        display: true,
        title: 'CSR & Sustainability',
        description: 'Our commitment to social responsibility and environmental sustainability',
        initiatives: [
            'Green manufacturing practices',
            'Community education programs',
            'Renewable energy adoption',
            'Waste reduction initiatives'
        ]
    },
    timeline: {
        display: true,
        title: 'Company Milestones',
        description: 'Key moments in AmalTech\'s journey of innovation and growth',
        milestones: [
            {
                year: '2009',
                title: 'Company Founded',
                description: 'AmalTech established with focus on embedded systems'
            },
            {
                year: '2012',
                title: 'First Smart Meter Launch',
                description: 'Revolutionary smart energy meter hits the market'
            },
            {
                year: '2015',
                title: 'ISO Certification',
                description: 'Achieved ISO 9001 quality management certification'
            },
            {
                year: '2018',
                title: 'Global Expansion',
                description: 'Expanded operations to 25+ countries worldwide'
            },
            {
                year: '2021',
                title: 'IoT Platform Launch',
                description: 'Launched comprehensive IoT management platform'
            },
            {
                year: '2024',
                title: 'AI Integration',
                description: 'Integrated AI capabilities across product portfolio'
            }
        ]
    }
}

const products = {
    label: 'Products',
    title: 'Our Products',
    description: 'Explore AmalTech\'s comprehensive range of smart devices and IoT solutions',
    categories: {
        consumer: {
            title: 'Consumer Electronics',
            description: 'Smart devices for everyday use',
            products: [
                {
                    name: 'Amal Aero',
                    description: 'Advanced air quality monitoring device',
                    image: '/images/products/amal-aero.jpg',
                    specs: ['Real-time monitoring', 'Mobile app integration', 'Battery powered']
                },
                {
                    name: 'Smart Energy Meter',
                    description: 'Intelligent electricity consumption tracking',
                    image: '/images/products/smart-meter.jpg',
                    specs: ['Two-way communication', 'Real-time data', 'Tamper detection']
                },
                {
                    name: 'POS Terminal',
                    description: 'Modern point-of-sale solution',
                    image: '/images/products/pos-terminal.jpg',
                    specs: ['Contactless payment', 'Inventory management', 'Cloud sync']
                }
            ]
        },
        industrial: {
            title: 'Industrial Products',
            description: 'Robust solutions for industrial applications',
            products: [
                {
                    name: 'Industrial Gas Detector',
                    description: 'Advanced gas detection for industrial safety',
                    image: '/images/products/gas-detector.jpg',
                    specs: ['Multi-gas detection', 'ATEX certified', 'Wireless connectivity']
                },
                {
                    name: 'Flow Meter',
                    description: 'Precision flow measurement for industrial processes',
                    image: '/images/products/flow-meter.jpg',
                    specs: ['High accuracy', 'Corrosion resistant', 'Digital output']
                },
                {
                    name: 'Fire Control Panel',
                    description: 'Centralized fire detection and control system',
                    image: '/images/products/fire-panel.jpg',
                    specs: ['Multi-zone detection', 'Emergency protocols', 'Remote monitoring']
                }
            ]
        },
        smart: {
            title: 'Smart Devices & IoT',
            description: 'Connected solutions for the digital age',
            products: [
                {
                    name: 'Smart Irrigation System',
                    description: 'Automated irrigation with weather integration',
                    image: '/images/products/smart-irrigation.jpg',
                    specs: ['Weather forecasting', 'Soil moisture sensors', 'Mobile control']
                },
                {
                    name: 'IMSI Catcher',
                    description: 'Advanced mobile network monitoring',
                    image: '/images/products/imsi-catcher.jpg',
                    specs: ['Network analysis', 'Security monitoring', 'Portable design']
                }
            ]
        },
        medical: {
            title: 'Medical Devices',
            description: 'Healthcare technology solutions',
            products: [
                {
                    name: 'Fever Detector',
                    description: 'Non-contact temperature screening',
                    image: '/images/products/fever-detector.jpg',
                    specs: ['Non-contact operation', 'High accuracy', 'Rapid screening']
                },
                {
                    name: 'Glucose Monitor',
                    description: 'Smart glucose monitoring system',
                    image: '/images/products/glucose-monitor.jpg',
                    specs: ['Continuous monitoring', 'Mobile app', 'Data analytics']
                }
            ]
        }
    }
}

const services = {
    label: 'Services',
    title: 'Our Services',
    description: 'Comprehensive R&D, engineering, and manufacturing services',
    rd: {
        title: 'R&D Services',
        description: 'Innovation-driven research and development for next-generation products',
        capabilities: [
            'Product concept development',
            'Prototype design and testing',
            'Technology feasibility studies',
            'Patent research and filing'
        ]
    },
    hardware: {
        title: 'Hardware Engineering',
        description: 'Expert hardware design and engineering solutions',
        capabilities: [
            'Circuit board design',
            'Component selection and optimization',
            'Thermal management design',
            'EMC compliance testing'
        ]
    },
    pcb: {
        title: 'PCB Design & Manufacturing',
        description: 'Advanced PCB design and manufacturing capabilities',
        capabilities: [
            'Multi-layer PCB design',
            'High-speed signal integrity',
            'Manufacturing optimization',
            'Quality control processes'
        ]
    },
    embedded: {
        title: 'Embedded Software Development',
        description: 'Custom embedded software solutions for IoT and automation',
        capabilities: [
            'Real-time operating systems',
            'IoT protocol implementation',
            'Security and encryption',
            'Over-the-air updates'
        ]
    }
}

const solutions = {
    label: 'Business Solutions',
    title: 'Industry Solutions',
    description: 'How AmalTech enables various sectors through innovative technology',
    overview: 'AmalTech serves as an enabler of digital industries, providing technology solutions that drive efficiency and innovation across sectors.',
    industries: {
        healthcare: {
            title: 'Healthcare',
            description: 'Medical device solutions and health monitoring systems',
            applications: ['Patient monitoring', 'Diagnostic equipment', 'Health data management']
        },
        industrial: {
            title: 'Industrial Automation',
            description: 'Smart manufacturing and process automation solutions',
            applications: ['Production monitoring', 'Quality control', 'Predictive maintenance']
        },
        communications: {
            title: 'Communications',
            description: 'Network infrastructure and communication systems',
            applications: ['Network monitoring', 'Signal processing', 'Data transmission']
        },
        infrastructure: {
            title: 'Data Infrastructure',
            description: 'Smart city and infrastructure management solutions',
            applications: ['Traffic management', 'Energy monitoring', 'Environmental sensing']
        },
        consumer: {
            title: 'Consumer Devices',
            description: 'Smart home and personal technology solutions',
            applications: ['Home automation', 'Personal health', 'Entertainment systems']
        },
        sensors: {
            title: 'Sensors',
            description: 'Advanced sensing and measurement technologies',
            applications: ['Environmental monitoring', 'Industrial sensing', 'Safety systems']
        },
        transportation: {
            title: 'Transportation',
            description: 'Smart transportation and logistics solutions',
            applications: ['Fleet management', 'Traffic monitoring', 'Logistics optimization']
        }
    }
}

const expertise = {
    label: 'Expertise',
    title: 'Our Expertise',
    description: 'AmalTech\'s technical capabilities and industry certifications',
    npi: {
        title: 'New Product Introduction',
        description: 'Streamlined NPI process from concept to production',
        stages: [
            'Concept Development',
            'Design & Engineering',
            'Prototype & Testing',
            'Manufacturing Setup',
            'Quality Validation',
            'Market Launch'
        ]
    },
    certifications: {
        title: 'Certifications',
        description: 'ISO, CE, SON, and other industry certifications',
        list: [
            'ISO 9001:2015 Quality Management',
            'ISO 14001 Environmental Management',
            'CE Marking (European Conformity)',
            'SONCAP (Standards Organisation of Nigeria)',
            'FCC Certification (Federal Communications Commission)',
            'RoHS Compliance (Restriction of Hazardous Substances)'
        ]
    },
    quality: {
        title: 'Quality Assurance',
        description: 'Rigorous testing and quality control processes',
        processes: [
            'Incoming material inspection',
            'In-process quality checks',
            'Final product testing',
            'Reliability testing',
            'Environmental testing',
            'Compliance verification'
        ]
    }
}

const capabilities = {
    label: 'Capabilities',
    title: 'Manufacturing Capabilities',
    description: 'State-of-the-art manufacturing infrastructure and processes',
    manufacturing: {
        title: 'Manufacturing Infrastructure',
        description: 'SMT lines, PCB assembly, and automation capabilities',
        facilities: [
            'Surface Mount Technology (SMT) lines',
            'Through-hole assembly capabilities',
            'Automated optical inspection (AOI)',
            'X-ray inspection for BGA components',
            'Conformal coating application',
            'Box build and final assembly'
        ]
    },
    testing: {
        title: 'Testing & QA',
        description: 'Comprehensive testing and quality assurance processes',
        capabilities: [
            'Functional testing',
            'Environmental stress testing',
            'EMC/EMI testing',
            'Safety testing',
            'Reliability testing',
            'Performance validation'
        ]
    },
    supply: {
        title: 'Supply Chain',
        description: 'Efficient logistics and supply chain management',
        features: [
            'Global supplier network',
            'Just-in-time inventory management',
            'Quality supplier management',
            'Logistics optimization',
            'Warehouse management',
            'Distribution network'
        ]
    }
}

const newsroom = {
    label: 'Newsroom',
    title: 'Latest News & Updates',
    description: 'Stay updated with AmalTech\'s latest developments, product launches, and industry insights',
    filters: {
        all: 'All',
        press: 'Press Releases',
        events: 'Events',
        insights: 'Insights',
        whitePapers: 'White Papers'
    }
}

const careers = {
    label: 'Careers',
    title: 'Join Our Team',
    description: 'Build your career with AmalTech and be part of our innovation journey',
    life: {
        title: 'Life at AmalTech',
        description: 'Discover what makes AmalTech a great place to work',
        benefits: [
            'Competitive compensation',
            'Health and wellness programs',
            'Professional development',
            'Innovation culture',
            'Work-life balance',
            'Global opportunities'
        ]
    },
    positions: {
        title: 'Open Positions',
        description: 'Explore current job opportunities',
        departments: [
            'Engineering',
            'Manufacturing',
            'Sales & Marketing',
            'Research & Development',
            'Quality Assurance',
            'Supply Chain'
        ]
    },
    internships: {
        title: 'Internships',
        description: 'Gain valuable experience with our internship programs',
        programs: [
            'Engineering Internship',
            'Business Development Internship',
            'Quality Assurance Internship',
            'Research Internship'
        ]
    }
}

const contact = {
    label: 'Contact',
    title: 'Get in Touch',
    description: 'Connect with AmalTech for sales, support, or partnership inquiries',
    form: {
        title: 'Contact Us',
        description: 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
        fields: {
            name: 'Name',
            email: 'Email',
            company: 'Company',
            inquiry: 'Inquiry Type',
            message: 'Message',
            submit: 'Send Message'
        }
    },
    inquiryTypes: {
        sales: 'Sales Inquiry',
        support: 'Technical Support',
        partnership: 'Partnership',
        general: 'General Inquiry'
    },
    offices: [
        {
            location: 'Lagos, Nigeria',
            address: '123 Innovation Drive, Victoria Island',
            phone: '+234 1 234 5678',
            email: 'info@amaltech.com'
        },
        {
            location: 'Dubai, UAE',
            address: '456 Tech Park, Dubai Silicon Oasis',
            phone: '+971 4 123 4567',
            email: 'dubai@amaltech.com'
        }
    ]
}

const partners = {
    label: 'Partners',
    title: 'Partnership Programs',
    description: 'Join AmalTech\'s global network of distributors and resellers',
    distributor: {
        title: 'Distributor Program',
        description: 'Become an authorized AmalTech distributor',
        benefits: [
            'Exclusive territory rights',
            'Technical training and support',
            'Marketing materials and resources',
            'Competitive pricing structure',
            'Sales and technical support'
        ]
    },
    reseller: {
        title: 'Reseller Program',
        description: 'Partner with us as a reseller',
        benefits: [
            'Product training and certification',
            'Marketing support and materials',
            'Technical support and resources',
            'Competitive margins',
            'Lead generation support'
        ]
    },
    support: {
        title: 'Partner Support',
        description: 'Comprehensive support for our partners',
        services: [
            'Technical training programs',
            'Sales enablement resources',
            'Marketing campaign support',
            'Product demonstration tools',
            '24/7 technical support'
        ]
    }
}

const support = {
    label: 'Support',
    title: 'Technical Support',
    description: 'Comprehensive support and resources for AmalTech products',
    quality: 'Quality Management',
    regulatory: 'Regulatory Information',
    technical: 'Technical Resources',
    contact: 'Contact Support'
}

const legal = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    cookies: 'Cookie Policy',
    accessibility: 'Accessibility Statement',
    sitemap: 'Sitemap'
}

const navigation = {
    store: 'Visit Store',
    getQuote: 'Get Quotation',
    exploreProducts: 'Explore Products'
}

const footer = {
    quickLinks: 'Quick Links',
    company: 'Company',
    legal: 'Legal',
    social: 'Follow Us',
    newsletter: 'Stay Updated'
}

export {
    company,
    social,
    newsletter,
    home,
    about,
    products,
    services,
    solutions,
    expertise,
    capabilities,
    newsroom,
    careers,
    contact,
    partners,
    support,
    legal,
    navigation,
    footer
};