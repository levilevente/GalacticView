import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AgentChatWidget from './components/AgentChatWidget.tsx';
import FooterBar from './components/FooterBar.tsx';
import NavigationBar from './components/NavigationBar.tsx';
import EpicDataPage from './pages/EpicDataPage.tsx';
import EpicDataPostPage from './pages/EpicDataPostPage.tsx';
import HomePage from './pages/HomePage.tsx';
import ImageOfTheDayPage from './pages/ImageOfTheDayPage.tsx';
import SearchItemPage from './pages/SearchItemPage.tsx';

function Root() {
    return (
        <div className="App">
            <div className="page-container">
                <BrowserRouter>
                    {/* wrap the application in BrowserRouter, ensures client-side routing works */}
                    <NavigationBar />
                    <main className="content-wrap">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/epicdata" element={<EpicDataPage />} />
                            {/*<Route path="/blogpost" element={<BlogPostPage />} />*/}
                            <Route path="/imageoftheday" element={<ImageOfTheDayPage />} />
                            <Route path="/epicdata/:epicDataDate" element={<EpicDataPostPage />} />
                            <Route path="/search/item/:nasaId" element={<SearchItemPage />} />
                        </Routes>
                    </main>
                    <FooterBar />
                    <AgentChatWidget />
                </BrowserRouter>
            </div>
        </div>
    );
}

export default Root;
