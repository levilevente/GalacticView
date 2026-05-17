import { useQuery } from '@tanstack/react-query';

import { getNasaEpicDataAllDates, getNasaEpicDataByDate } from '../api/nasaEpic.api.ts';
import { queryClient } from './common.query.ts';

export function useNasaEpicDataDates() {
    const query = useQuery({
        queryKey: ['nasaEpicData'],
        queryFn: getNasaEpicDataAllDates,
    });

    const refetchWithInvalidation = async () => {
        await queryClient.invalidateQueries({ queryKey: ['nasaEpicData'] });
        return query.refetch();
    };

    return { ...query, refetchWithInvalidation };
}

export function useNasaEpicDataByDate(date: string) {
    return useQuery({
        queryKey: ['nasaEpicData', date],
        queryFn: () => getNasaEpicDataByDate(date),
    });
}
