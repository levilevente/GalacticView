import { useMemo } from 'react';

import EpicDataCard from '../components/epicdata/EpicDataCard.tsx';
import PaginationEpic from '../components/epicdata/PaginationEpic.tsx';
import { usePagination } from '../hooks/usePagination.ts';
import { useNasaEpicDataDates } from '../query/nasaEpicData.query.ts';
import style from './EpicDataPage.module.css';

function EpicDataPage() {
    const { data: dates = [], isLoading } = useNasaEpicDataDates();
    const { currentPage, itemsPerPage, goToPage, totalPages } = usePagination(dates);

    const epicDataDates = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return dates.slice(start, start + itemsPerPage).map((d) => d.date);
    }, [dates, currentPage, itemsPerPage]);

    return (
        <div className={style.epicDataContainer}>
            {epicDataDates.map((dateStr) => (
                <EpicDataCard key={dateStr} date={dateStr} isLoading={isLoading} />
            ))}
            <PaginationEpic goToPage={goToPage} totalPages={totalPages} currentPage={currentPage} />
        </div>
    );
}

export default EpicDataPage;
