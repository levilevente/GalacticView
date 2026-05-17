import { useEffect, useMemo, useState } from 'react';

import type { NasaEpicDataTypesForDates } from '../types/NasaEpicDataTypes.ts';

export function usePagination(data: NasaEpicDataTypesForDates[], itemsPerPage = 10) {
    const [currentPage, setCurrentPage] = useState(() => {
        return Number(localStorage.getItem('epicDataCurrentPage')) || 1;
    });

    useEffect(() => {
        localStorage.setItem('epicDataCurrentPage', String(currentPage));
    }, [currentPage]);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginationData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    const goToPage = (page: number) => {
        if (page < 1) {
            setCurrentPage(1);
        } else if (page > totalPages) {
            setCurrentPage(totalPages);
        } else {
            setCurrentPage(page);
        }
    };

    return {
        currentPage,
        goToPage,
        totalPages,
        paginationData,
        itemsPerPage,
    };
}
