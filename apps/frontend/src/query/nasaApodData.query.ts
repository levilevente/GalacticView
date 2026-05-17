import { useQuery } from '@tanstack/react-query';

import { getNasaApodData } from '../api/nasaApod.api.ts';
import { queryClient } from './common.query.ts';

export function useNasaApodData(date?: Date | null) {
    const key = date ? date.toISOString().split('T')[0] : 'today';

    const query = useQuery({
        queryKey: ['nasaApodData', key],
        queryFn: () => getNasaApodData(date),
    });

    const refetchWithInvalidation = async () => {
        await queryClient.invalidateQueries({ queryKey: ['nasaApodData', key] });
        return query.refetch();
    };

    return { ...query, refetchWithInvalidation };
}
