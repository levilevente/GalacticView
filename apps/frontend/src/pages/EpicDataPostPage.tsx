import 'react-medium-image-zoom/dist/styles.css';

import { Carousel, Spinner } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useTranslation } from 'react-i18next';
import Zoom from 'react-medium-image-zoom';
import { useParams } from 'react-router';

import { useNasaEpicDataByDate } from '../query/nasaEpicData.query.ts';
import type { NasaEpicDataType } from '../types/NasaEpicDataTypes.ts';
import style from './EpicDataPostPage.module.css';

function imageUrl(item: NasaEpicDataType) {
    return `https://epic.gsfc.nasa.gov/archive/natural/${item.date.slice(0, 4)}/${item.date.slice(5, 7)}/${item.date.slice(8, 10)}/png/${item.image}.png`;
}

function EpicDataPostPage() {
    const { epicDataDate } = useParams<{ epicDataDate: string }>();
    const { data, isLoading, isError, error } = useNasaEpicDataByDate(epicDataDate ?? '');
    const { t } = useTranslation();

    return (
        <div>
            {isError ? <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p> : null}
            {data ? (
                <div className={style.centerContainer}>
                    {isLoading ? <Spinner animation="border" /> : null}
                    <div className={style.mainContainer}>
                        <div className={style.leftContainer}>
                            <h2>{t('epicDataPost.title')}</h2>
                            <p className={style.paragraphUnderHeading}>{t('epicDataPost.description')}</p>
                            <h3>{t('epicDataPost.cameraAndSatelliteTitle')}</h3>
                            <p>{t('epicDataPost.cameraAndSatelliteDescription')}</p>
                            <h3>{t('epicDataPost.locationTitle')}</h3>
                            <p>{t('epicDataPost.locationDescription')}</p>
                            <h3>{t('epicDataPost.imageCaptureTitle')}</h3>
                            <p>{t('epicDataPost.imageCaptureDescription')}</p>
                        </div>
                        <div className={style.rightContainer}>
                            <Carousel fade className={style.carouselContainer}>
                                {data.map((item: NasaEpicDataType) => (
                                    <Carousel.Item key={item.identifier}>
                                        <Zoom>
                                            <Image rounded src={imageUrl(item)} alt="epic" className={style.image} />
                                        </Zoom>
                                        <Carousel.Caption className={style.carouselCaption}>
                                            <p>{item.date}</p>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default EpicDataPostPage;
