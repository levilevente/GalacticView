import '../App.css';

import { useState } from 'react';

import ImageOfTheDayContainer from '../components/imageoftheday/ImageOfTheDayContainer.tsx';
import ImageOfTheDayHistory from '../components/imageoftheday/ImageOfTheDayHistory.tsx';
import style from './ImageOfTheDayPage.module.css';

function ImageOfTheDayPage() {
    const [searchedDate, setSearchedDate] = useState<Date | null>(null);

    return (
        <div>
            <ImageOfTheDayContainer />
            <div className={`line ${style.spaceBeforeLine}`} />
            <div className={style.searchedDateImageContainer}>
                <ImageOfTheDayHistory setSearchedDate={setSearchedDate} />
                {searchedDate ? <ImageOfTheDayContainer date={searchedDate} key={searchedDate.toISOString()} /> : null}
            </div>
        </div>
    );
}

export default ImageOfTheDayPage;
