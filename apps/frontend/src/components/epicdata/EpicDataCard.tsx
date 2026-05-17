import { Button, Card, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useNasaEpicDataByDate } from '../../query/nasaEpicData.query.ts';
import type { NasaEpicDataType } from '../../types/NasaEpicDataTypes.ts';
import style from './EpicDataCard.module.css';

interface epicDataCardProps {
    date: string;
    isLoading?: boolean;
}

function EpicDataCard(props: epicDataCardProps) {
    const { t } = useTranslation();

    const { date, isLoading } = props;
    const { data: dataOnDate = [] as NasaEpicDataType[] } = useNasaEpicDataByDate(date);

    return (
        <Card className={style.card}>
            <Card.Body className={style.epicDataCardBody}>
                {isLoading ? <Spinner animation="border" /> : null}
                <Card.Title>
                    {t('epicDataPost.card.imageDate')} {date}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{dataOnDate[0]?.caption}</Card.Subtitle>
                <Card.Text>
                    {dataOnDate.length} {t('epicDataPost.card.itemsCount')} {date}
                </Card.Text>
                <Button variant="dark" href={`/epicdata/${date}`}>
                    {t('epicDataPost.card.seeMore')}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default EpicDataCard;
