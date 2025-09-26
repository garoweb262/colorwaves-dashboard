import {
    company,
    newsletter,
    social,
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
} from './content';
import { createI18nContent } from './content-i18n';
import { i18n } from './config';

const renderContent = (t) => {
    if (i18n) {
        return createI18nContent(t);
    } else {
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
    }
};

export { renderContent };