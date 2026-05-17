import axios from 'axios';

import type {
    NasaImageAndVideoLibraryItemAssetType,
    NasaImageAndVideoLibraryItemMetadataType,
    NasaImageAndVideoLibraryType,
} from '../types/NasaImageAndVideoLibraryType.ts';

export const nasaImageAndVideoLibraryApi = axios.create({
    baseURL: `https://images-api.nasa.gov`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export async function searchNasaLibrary(query: string): Promise<NasaImageAndVideoLibraryType> {
    const res = await nasaImageAndVideoLibraryApi.get<NasaImageAndVideoLibraryType>('/search', {
        params: { q: query },
    });
    return res.data;
}

export async function searchNasaLibraryAsset(nasaId: string): Promise<NasaImageAndVideoLibraryItemAssetType> {
    const res = await nasaImageAndVideoLibraryApi.get<NasaImageAndVideoLibraryItemAssetType>(
        `/asset/${encodeURIComponent(nasaId)}`,
    );
    return res.data;
}

export async function searchNasaLibraryMetadata(nasaId: string): Promise<NasaImageAndVideoLibraryItemMetadataType> {
    const res1 = await nasaImageAndVideoLibraryApi.get<{ location: string }>(`/metadata/${encodeURIComponent(nasaId)}`);
    const location: string = res1.data.location;
    const res2 = await axios.get<NasaImageAndVideoLibraryItemMetadataType>(location);
    return res2.data;
}
