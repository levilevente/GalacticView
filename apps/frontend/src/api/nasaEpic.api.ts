import axios from 'axios';

import type { NasaEpicDataType, NasaEpicDataTypesForDates } from '../types/NasaEpicDataTypes.ts';

export const nasaEpicApi = axios.create({
    baseURL: `https://epic.gsfc.nasa.gov/api/natural/`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export async function getNasaEpicData(): Promise<NasaEpicDataType[]> {
    const res = await nasaEpicApi.get<NasaEpicDataType[]>('');
    return res.data;
}

export async function getNasaEpicDataAllDates(): Promise<NasaEpicDataTypesForDates[]> {
    const res = await nasaEpicApi.get<NasaEpicDataTypesForDates[]>('/all');
    return res.data;
}

export async function getNasaEpicDataByDate(date: string): Promise<NasaEpicDataType[]> {
    const res = await nasaEpicApi.get<NasaEpicDataType[]>(`/date/${date}`);
    return res.data;
}
