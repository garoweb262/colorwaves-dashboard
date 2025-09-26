const createI18nContent = (t) => {
    const company = {
        name: t("company.name"),
        tagline: t("company.tagline"),
        description: t("company.description"),
        logo: '/trademark/icon-dark.svg',
        location: 'Africa/Lagos',
        founded: '2009',
        employees: '150+',
        certifications: ['ISO 9001', 'CE', 'SON', 'FCC']
    }

    const newsletter = {
        display: true,
        title: <>{t("newsletter.title")}</>,
        description: <>{t("newsletter.description")}</>
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
        label: t("home.label"),
        title: t("home.title"),
        description: t("home.description"),
        headline: <>{t("home.headline")}</>,
        subline: <>{t("home.subline")}</>,
        hero: {
            title: t("home.hero.title"),
            subtitle: t("home.hero.subtitle"),
            description: t("home.hero.description"),
            tagline: t("home.hero.tagline"),
            cta: {
                text: t("home.hero.cta.text"),
                href: t("home.hero.cta.href"),
                variant: t("home.hero.cta.variant")
            },
            secondaryCta: {
                text: t("home.hero.secondaryCta.text"),
                href: t("home.hero.secondaryCta.href"),
                variant: t("home.hero.secondaryCta.variant")
            },
            background: {
                type: t("home.hero.background.type"),
                gradient: t("home.hero.background.gradient"),
                overlay: t("home.hero.background.overlay")
            },
            stats: [
                {
                    value: t("home.hero.stats.innovation.value"),
                    label: t("home.hero.stats.innovation.label")
                },
                {
                    value: t("home.hero.stats.projects.value"),
                    label: t("home.hero.stats.projects.label")
                },
                {
                    value: t("home.hero.stats.countries.value"),
                    label: t("home.hero.stats.countries.label")
                },
                {
                    value: t("home.hero.stats.certification.value"),
                    label: t("home.hero.stats.certification.label")
                }
            ]
        },
        stats: {
            title: t("home.stats.title"),
            years: t("home.stats.years"),
            products: t("home.stats.products"),
            countries: t("home.stats.countries"),
            certifications: t("home.stats.certifications")
        },
        sections: {
            featuredProducts: t("home.sections.featuredProducts"),
            capabilities: t("home.sections.capabilities"),
            partners: t("home.sections.partners"),
            rd: t("home.sections.rd"),
            latestNews: t("home.sections.latestNews")
        }
    }

    const about = {
        label: t("about.label"),
        title: t("about.title"),
        description: t("about.description"),
        tableOfContent: {
            display: true,
            subItems: false
        },
        overview: {
            display: true,
            title: t("about.overview.title"),
            description: t("about.overview.description")
        },
        mission: {
            display: true,
            title: t("about.mission.title"),
            mission: t("about.mission.mission"),
            vision: t("about.mission.vision")
        },
        leadership: {
            display: true,
            title: t("about.leadership.title"),
            description: t("about.leadership.description"),
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
            title: t("about.csr.title"),
            description: t("about.csr.description"),
            initiatives: [
                'Green manufacturing practices',
                'Community education programs',
                'Renewable energy adoption',
                'Waste reduction initiatives'
            ]
        },
        timeline: {
            display: true,
            title: t("about.timeline.title"),
            description: t("about.timeline.description"),
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
        label: t("products.label"),
        title: t("products.title"),
        description: t("products.description"),
        categories: {
            consumer: {
                title: t("products.categories.consumer"),
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
                title: t("products.categories.industrial"),
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
                title: t("products.categories.smart"),
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
                title: t("products.categories.medical"),
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
        label: t("services.label"),
        title: t("services.title"),
        description: t("services.description"),
        rd: {
            title: t("services.rd.title"),
            description: t("services.rd.description"),
            capabilities: [
                'Product concept development',
                'Prototype design and testing',
                'Technology feasibility studies',
                'Patent research and filing'
            ]
        },
        hardware: {
            title: t("services.hardware.title"),
            description: t("services.hardware.description"),
            capabilities: [
                'Circuit board design',
                'Component selection and optimization',
                'Thermal management design',
                'EMC compliance testing'
            ]
        },
        pcb: {
            title: t("services.pcb.title"),
            description: t("services.pcb.description"),
            capabilities: [
                'Multi-layer PCB design',
                'High-speed signal integrity',
                'Manufacturing optimization',
                'Quality control processes'
            ]
        },
        embedded: {
            title: t("services.embedded.title"),
            description: t("services.embedded.description"),
            capabilities: [
                'Real-time operating systems',
                'IoT protocol implementation',
                'Security and encryption',
                'Over-the-air updates'
            ]
        }
    }

    const solutions = {
        label: t("solutions.label"),
        title: t("solutions.title"),
        description: t("solutions.description"),
        overview: {
            title: t("solutions.overview.title"),
            description: t("solutions.overview.description")
        },
        industries: {
            healthcare: {
                title: t("solutions.industries.healthcare"),
                description: 'Medical device solutions and health monitoring systems',
                applications: ['Patient monitoring', 'Diagnostic equipment', 'Health data management']
            },
            industrial: {
                title: t("solutions.industries.industrial"),
                description: 'Smart manufacturing and process automation solutions',
                applications: ['Production monitoring', 'Quality control', 'Predictive maintenance']
            },
            communications: {
                title: t("solutions.industries.communications"),
                description: 'Network infrastructure and communication systems',
                applications: ['Network monitoring', 'Signal processing', 'Data transmission']
            },
            infrastructure: {
                title: t("solutions.industries.infrastructure"),
                description: 'Smart city and infrastructure management solutions',
                applications: ['Traffic management', 'Energy monitoring', 'Environmental sensing']
            },
            consumer: {
                title: t("solutions.industries.consumer"),
                description: 'Smart home and personal technology solutions',
                applications: ['Home automation', 'Personal health', 'Entertainment systems']
            },
            sensors: {
                title: t("solutions.industries.sensors"),
                description: 'Advanced sensing and measurement technologies',
                applications: ['Environmental monitoring', 'Industrial sensing', 'Safety systems']
            },
            transportation: {
                title: t("solutions.industries.transportation"),
                description: 'Smart transportation and logistics solutions',
                applications: ['Fleet management', 'Traffic monitoring', 'Logistics optimization']
            }
        }
    }

    const expertise = {
        label: t("expertise.label"),
        title: t("expertise.title"),
        description: t("expertise.description"),
        npi: {
            title: t("expertise.npi.title"),
            description: t("expertise.npi.description"),
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
            title: t("expertise.certifications.title"),
            description: t("expertise.certifications.description"),
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
            title: t("expertise.quality.title"),
            description: t("expertise.quality.description"),
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
        label: t("capabilities.label"),
        title: t("capabilities.title"),
        description: t("capabilities.description"),
        manufacturing: {
            title: t("capabilities.manufacturing.title"),
            description: t("capabilities.manufacturing.description"),
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
            title: t("capabilities.testing.title"),
            description: t("capabilities.testing.description"),
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
            title: t("capabilities.supply.title"),
            description: t("capabilities.supply.description"),
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
        label: t("newsroom.label"),
        title: t("newsroom.title"),
        description: t("newsroom.description"),
        filters: {
            all: t("newsroom.filters.all"),
            press: t("newsroom.filters.press"),
            events: t("newsroom.filters.events"),
            insights: t("newsroom.filters.insights"),
            whitePapers: t("newsroom.filters.whitePapers")
        }
    }

    const careers = {
        label: t("careers.label"),
        title: t("careers.title"),
        description: t("careers.description"),
        life: {
            title: t("careers.life.title"),
            description: t("careers.life.description"),
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
            title: t("careers.positions.title"),
            description: t("careers.positions.description"),
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
            title: t("careers.internships.title"),
            description: t("careers.internships.description"),
            programs: [
                'Engineering Internship',
                'Business Development Internship',
                'Quality Assurance Internship',
                'Research Internship'
            ]
        }
    }

    const contact = {
        label: t("contact.label"),
        title: t("contact.title"),
        description: t("contact.description"),
        form: {
            title: t("contact.form.title"),
            description: t("contact.form.description"),
            fields: {
                name: t("contact.form.name"),
                email: t("contact.form.email"),
                company: t("contact.form.company"),
                inquiry: t("contact.form.inquiry"),
                message: t("contact.form.message"),
                submit: t("contact.form.submit")
            }
        },
        inquiryTypes: {
            sales: t("contact.inquiryTypes.sales"),
            support: t("contact.inquiryTypes.support"),
            partnership: t("contact.inquiryTypes.partnership"),
            general: t("contact.inquiryTypes.general")
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
        label: t("partners.label"),
        title: t("partners.title"),
        description: t("partners.description"),
        distributor: {
            title: t("partners.distributor.title"),
            description: t("partners.distributor.description"),
            benefits: [
                'Exclusive territory rights',
                'Technical training and support',
                'Marketing materials and resources',
                'Competitive pricing structure',
                'Sales and technical support'
            ]
        },
        reseller: {
            title: t("partners.reseller.title"),
            description: t("partners.reseller.description"),
            benefits: [
                'Product training and certification',
                'Marketing support and materials',
                'Technical support and resources',
                'Competitive margins',
                'Lead generation support'
            ]
        },
        support: {
            title: t("partners.support.title"),
            description: t("partners.support.description"),
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
        label: t("support.label"),
        title: t("support.title"),
        description: t("support.description"),
        quality: t("support.quality"),
        regulatory: t("support.regulatory"),
        technical: t("support.technical"),
        contact: t("support.contact")
    }

    const legal = {
        privacy: t("legal.privacy"),
        terms: t("legal.terms"),
        cookies: t("legal.cookies"),
        accessibility: t("legal.accessibility"),
        sitemap: t("legal.sitemap")
    }

    const navigation = {
        store: t("navigation.store"),
        getQuote: t("navigation.getQuote"),
        exploreProducts: t("navigation.exploreProducts")
    }

    const footer = {
        quickLinks: t("footer.quickLinks"),
        company: t("footer.company"),
        legal: t("footer.legal"),
        social: t("footer.social"),
        newsletter: t("footer.newsletter")
    }

    return {
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
    }
};

export { createI18nContent };