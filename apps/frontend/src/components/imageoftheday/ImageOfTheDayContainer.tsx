import { useTranslation } from 'react-i18next';

import { useNasaApodData } from '../../query/nasaApodData.query';
import ImageOfTheDay from './ImageOfTheDay.tsx';

interface ImageOfTheDayContainerProps {
    date?: Date | null;
}

function ImageOfTheDayContainer(props: ImageOfTheDayContainerProps) {
    const { t } = useTranslation();

    const { date } = props;
    const { data, isLoading, isError } = useNasaApodData(date);

    if (isLoading) return <p style={{ marginLeft: '10rem' }}>{t('imageOfTheDay.container.loading')}</p>;
    if (isError) return <p style={{ marginLeft: '10rem' }}>{t('imageOfTheDay.container.failed')}</p>;
    if (!data) return null;

    return <ImageOfTheDay data={data} />;
}

export default ImageOfTheDayContainer;
