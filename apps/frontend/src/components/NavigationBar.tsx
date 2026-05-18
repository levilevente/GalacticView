import { type FormEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useTranslation } from 'react-i18next';

import { searchNasaLibrary } from '../api/nasaImageAndVideoLibrary.api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import type { NasaImageAndVideoLibraryType } from '../types/NasaImageAndVideoLibraryType.ts';
import style from './NavigationBar.module.css';
import SearchResults from './search/SearchResults.tsx';

function NavigationBar() {
    const { t } = useTranslation();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<NasaImageAndVideoLibraryType | null>(null);

    const { isAuthenticated, logout } = useAuth();

    const [showResults, setShowResults] = useState(false);

    const searchHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        searchNasaLibrary(query)
            .then((results) => {
                setResults(results);
                setShowResults(true);
            })
            .catch((error) => {
                console.error('Error fetching search results:', error);
            });
    };

    const searchClosedOrSearched = () => {
        setShowResults(false);
        setQuery('');
        setResults(null);
    };

    return (
        <Navbar expand="lg" data-bs-theme="dark" className={style.navbarStyle}>
            <Container className={style.gridContainer}>
                <Form className={`d-flex ${style.searchForm}`} onSubmit={(e) => void searchHandler(e)}>
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {showResults ? (
                        <SearchResults results={results} searchClosedOrSearched={searchClosedOrSearched} />
                    ) : null}
                </Form>
                <Navbar.Brand href="/" className={style.brandCentered}>
                    <Image src="/logo/logo-light.png" alt="Logo" className={style.logoStyle} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={`ms-auto ${style.navStyle}`}>
                        <Nav.Link href="/epicdata" className={style.navLinkStyle}>
                            {t('navigation.epicData')}
                        </Nav.Link>
                        <Nav.Link href="/imageoftheday" className={style.navLinkStyle}>
                            {t('navigation.imageOfTheDay')}
                        </Nav.Link>
                        {isAuthenticated ? (
                            <Button variant="light" onClick={() => void logout()}>
                                Logout
                            </Button>
                        ) : (
                            <Nav.Link href="/login" className={style.navLinkStyle}>
                                {t('navigation.login')}
                            </Nav.Link>
                        )}
                        {/*<Nav.Link href="/blogpost" className={style.navLinkStyle}>
                            {t('navigation.blogPost')}
                        </Nav.Link>*/}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
