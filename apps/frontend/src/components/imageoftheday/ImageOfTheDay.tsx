import 'react-medium-image-zoom/dist/styles.css';

import { useTranslation } from 'react-i18next';
import Zoom from 'react-medium-image-zoom';

import type { NasaApodDataType } from '../../types/NasaApodDataType.ts';
import { getUTCDateString } from '../../utils/dateUtils.ts';
import style from './ImageOfTheDay.module.css';

interface ImageOfTheDayProps {
    data?: NasaApodDataType;
}

function ImageOfTheDay(props: ImageOfTheDayProps) {
    const { t } = useTranslation();

    const data = props.data;
    const today = new Date();
    const todayString = getUTCDateString(today);

    return (
        <div className={`imageOfTheDay ${style.imageOfTheDayContainer}`}>
            <div className={style.leftDiv}>
                {data?.date === todayString ? (
                    <>
                        <p className={'section-tagline'}>{t('imageOfTheDay.today')}</p>
                        <h1>{t('imageOfTheDay.title')}</h1>
                    </>
                ) : (
                    <h2 className={'section-tagline'}>{data?.date}</h2>
                )}
                <h3>{data?.title}</h3>
                <p>{data?.explanation}</p>
            </div>
            <div className={style.rightDiv}>
                {data?.media_type === 'image' ? (
                    <Zoom>
                        <img className={style.image} src={data?.hdurl} alt={data?.title} />
                    </Zoom>
                ) : data?.media_type === 'video' ? (
                    <iframe
                        width="560"
                        height="315"
                        src={data?.url}
                        title={data?.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <p>{t('imageOfTheDay.errorImage')}</p>
                )}
            </div>
        </div>
    );
}

export default ImageOfTheDay;
