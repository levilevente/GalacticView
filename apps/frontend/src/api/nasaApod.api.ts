import axios from 'axios';

import type { NasaApodDataType } from '../types/NasaApodDataType.ts';
import { getUTCDateString } from '../utils/dateUtils.ts';

const API_KEY = (import.meta.env.VITE_NASA_API_KEY as string) ?? 'DEMO_KEY';

export const nasaEpicApi = axios.create({
    baseURL: `https://api.nasa.gov/planetary/apod`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    params: {
        api_key: API_KEY,
    },
});

export async function getNasaApodData(date?: Date | null): Promise<NasaApodDataType> {
    if (date instanceof Date && !isNaN(date.getTime())) {
        const dateString = getUTCDateString(date);
        const res = await nasaEpicApi.get<NasaApodDataType>('', {
            params: { date: dateString },
        });
        return res.data;
    }
    const res = await nasaEpicApi.get<NasaApodDataType>('');
    return res.data;
}
