import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type {
    NasaImageAndVideoLibraryItemType,
    NasaImageAndVideoLibraryType,
} from '../../types/NasaImageAndVideoLibraryType.ts';
import style from './SearchResults.module.css';

interface SearchResultsProps {
    results: NasaImageAndVideoLibraryType | null;
    searchClosedOrSearched: () => void;
}

function SearchResults(props: SearchResultsProps) {
    const { t } = useTranslation();

    const { results, searchClosedOrSearched } = props;
    const items: NasaImageAndVideoLibraryItemType[] = results ? getDistinctItemsByTitle(results.collection.items) : [];
    const navigate = useNavigate();

    const clickedItem = async (item: NasaImageAndVideoLibraryItemType) => {
        searchClosedOrSearched();
        await navigate(`/search/item/${item.data[0].nasa_id}`);
    };

    return (
        <div className={style.searchResultsContainer}>
            {items.length === 0 ? (
                <p>{t('searchResults.error')}</p>
            ) : (
                /*only the top 5 distinct based on title*/
                items.slice(0, 5).map((item, i) => (
                    <div
                        className={style.searchResultsItem}
                        key={`${item.data[0].title}-${i}`}
                        onClick={() => void clickedItem(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                if (e.key === ' ') {
                                    e.preventDefault();
                                }
                                void clickedItem(item);
                            }
                        }}
                    >
                        <p>{item.data[0].title}</p>
                    </div>
                ))
            )}
        </div>
    );
}

function getDistinctItemsByTitle(items: NasaImageAndVideoLibraryItemType[]): NasaImageAndVideoLibraryItemType[] {
    const titleMap = new Map<string, NasaImageAndVideoLibraryItemType>();
    for (const item of items) {
        const title = item.data[0].title;
        if (!titleMap.has(title)) {
            titleMap.set(title, item);
        }
    }
    return Array.from(titleMap.values());
}

export default SearchResults;
