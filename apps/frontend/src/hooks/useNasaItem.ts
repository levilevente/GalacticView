import { useEffect, useState } from 'react';

import { searchNasaLibraryAsset, searchNasaLibraryMetadata } from '../api/nasaImageAndVideoLibrary.api.ts';
import type {
    NasaImageAndVideoLibraryItemAssetType,
    NasaImageAndVideoLibraryItemMetadataType,
} from '../types/NasaImageAndVideoLibraryType.ts';

function returnImagesOnly(assets: NasaImageAndVideoLibraryItemAssetType) {
    return assets.collection.items.filter((item) => {
        return item.href.endsWith('.jpg') || item.href.endsWith('.png') || item.href.endsWith('.jpeg');
    });
}

export function useNasaItem(nasaId: string | undefined) {
    const [metadata, setMetadata] = useState<NasaImageAndVideoLibraryItemMetadataType | null>(null);
    const [assets, setAssets] = useState<NasaImageAndVideoLibraryItemAssetType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (!nasaId) return;

        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [metadataResponse, assetsResponse] = await Promise.all([
                    searchNasaLibraryMetadata(nasaId),
                    searchNasaLibraryAsset(nasaId),
                ]);
                if (isMounted) {
                    setMetadata(metadataResponse);
                    setAssets(assetsResponse);
                    const images = returnImagesOnly(assetsResponse);
                    setImage(images.length > 0 ? images[0].href : null);
                }
            } catch (err) {
                if (isMounted) {
                    setError((err as Error).message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchData();

        return () => {
            isMounted = false;
        };
    }, [nasaId]);

    return { metadata, assets, image, loading, error };
}
