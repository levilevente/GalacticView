import 'react-datepicker/dist/react-datepicker.css';

import { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';

import { toUTCDateOnly } from '../../utils/dateUtils.ts';
import style from './ImageOfTheDayHistory.module.css';

interface Props {
    setSearchedDate: (date: Date) => void;
}

function ImageOfTheDayHistory(props: Props) {
    const { t } = useTranslation();

    const { setSearchedDate } = props;
    const todayUtc = useMemo(() => toUTCDateOnly(new Date()), []);
    const [date, setDate] = useState<Date>(todayUtc);
    const minDate = new Date(Date.UTC(1995, 5, 16));

    return (
        <>
            <Form.Group controlId="datePicker" className={style.formGroup}>
                <Form.Label>
                    <h3>{t('imageOfTheDay.history.title')}</h3>
                </Form.Label>
                <div className={style.datePickerContainer}>
                    <DatePicker
                        selected={date}
                        onChange={(d) => d && setDate(d)}
                        className={`form-control ${style.datePicker}`}
                        dateFormat="MM/dd/yyyy"
                        maxDate={todayUtc}
                        minDate={minDate}
                    />
                    <Button
                        className={style.datePickerButton}
                        type="button"
                        size="sm"
                        variant="dark"
                        onClick={() => setSearchedDate(date)}
                    >
                        {t('imageOfTheDay.history.search')}
                    </Button>
                </div>
            </Form.Group>
        </>
    );
}

export default ImageOfTheDayHistory;
