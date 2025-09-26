// Base URL for the application (from environment variable with fallback)
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'amaltech.com.ng'

// Internationalization configuration
const i18nOptions = {
    locales: ['en'],
    defaultLocale: 'en'
}

// Password protected routes (only routes that need authentication)
const protectedRoutes = {
    '/work/automate-design-handovers-with-a-figma-to-code-pipeline': true,
    '/work/reaps': true,
    '/work/blockbait-phishing-detection-chrome-extension': true,
}

export { protectedRoutes, baseURL, i18nOptions };