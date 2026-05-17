import DOMPurify from 'dompurify';

import style from './SafeHtml.module.css';

interface SafeHtmlProps {
    htmlContent?: string;
}

interface DomPurifyConfig {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    [key: string]: unknown;
}

const SafeHtml = ({ htmlContent }: SafeHtmlProps) => {
    const sanitizeFn = (
        DOMPurify as unknown as {
            sanitize: (dirty: string, config?: DomPurifyConfig) => string;
        }
    ).sanitize;

    const DOMPURIFY_CONFIG: DomPurifyConfig = {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'br', 'span', 'code', 'pre'],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
    };

    const cleanHtml: string = sanitizeFn(htmlContent ?? '', DOMPURIFY_CONFIG);

    return <div className={style.formattedText} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

export default SafeHtml;
