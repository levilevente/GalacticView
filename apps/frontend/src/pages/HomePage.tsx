import '../App.css';

import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import ImageOfTheDayContainer from '../components/imageoftheday/ImageOfTheDayContainer.tsx';
import style from './HomePage.module.css';

function getMonthName(monthIndex: number, t: TFunction): string {
    const monthNames = [
        t('months.january'),
        t('months.february'),
        t('months.march'),
        t('months.april'),
        t('months.may'),
        t('months.june'),
        t('months.july'),
        t('months.august'),
        t('months.september'),
        t('months.october'),
        t('months.november'),
        t('months.december'),
    ];
    return monthNames[monthIndex];
}

function getDayName(dayIndex: number): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[dayIndex];
}

function HomePage() {
    const date = new Date();
    const { t } = useTranslation();

    return (
        <div>
            <p className={style.date}>
                LIVE {getDayName(date.getDay())}, {getMonthName(date.getMonth(), t)} {date.getDate()},{' '}
                {date.getUTCHours()}:{date.getUTCMinutes()}, {date.getTimezoneOffset()} UTC
            </p>
            <div className={'line'} />
            <div>
                <ImageOfTheDayContainer />
            </div>
        </div>
    );
}

export default HomePage;
