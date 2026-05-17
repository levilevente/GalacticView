import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import SafeHtml from '../components/search/SafeHtml.tsx';
import { useNasaItem } from '../hooks/useNasaItem.ts';
import style from './SearchItem.module.css';

function SearchItemPage() {
    const { t } = useTranslation();

    const { nasaId } = useParams();
    const { metadata, image, loading, error } = useNasaItem(nasaId);

    if (loading) {
        return (
            <div className={style.searchItemContainer}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className={style.searchItemContainer}>
            {error ? <p>Error</p> : null}
            <div className={style.leftDiv}>
                <h3>{metadata?.['AVAIL:Title']}</h3>
                <SafeHtml htmlContent={metadata?.['AVAIL:Description']} />
            </div>
            <div className={style.rightDiv}>
                {image ? (
                    <div>
                        <img className={style.image} src={image} alt={metadata?.['AVAIL:Title']} />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default SearchItemPage;
