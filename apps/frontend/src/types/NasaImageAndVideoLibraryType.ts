export interface NasaImageAndVideoLibraryType {
    collection: {
        version: string;
        href: string;
        items: NasaImageAndVideoLibraryItemType[];
        metadata: {
            total_hits: number;
        };
        links: {
            href: string;
            rel: string;
            prompt: string;
        }[];
    };
}

export interface NasaImageAndVideoLibraryItemType {
    href: string;
    data: {
        center: string;
        date_created: string;
        description: string;
        description_508?: string;
        keywords: string[];
        location?: string;
        media_type: string;
        nasa_id: string;
        photographer?: string;
        title: string;
    }[];
    links: {
        href: string;
        rel: string;
        render: string;
        width: number;
        size: number;
        height: number;
    }[];
}

export interface NasaImageAndVideoLibraryItemAssetType {
    collection: {
        version: string;
        href: string;
        items: {
            href: string;
        }[];
    };
}

export interface NasaImageAndVideoLibraryItemMetadataType {
    'AVAIL:Description': string;
    'AVAIL:Title': string;
    'AVAIL:Keywords': string[];
    'AVAIL:Location': string;
    'AVAIL:DateCreated': string;
    'AVAIL:Photographer': string;
}
