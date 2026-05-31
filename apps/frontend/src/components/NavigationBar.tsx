import { type FormEvent, useRef, useState } from 'react';
import { Button, Form, Nav, Navbar, Overlay, Popover } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { useTranslation } from 'react-i18next';
import { CgProfile } from 'react-icons/cg';

import { searchNasaLibrary } from '../api/nasaImageAndVideoLibrary.api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import type { NasaImageAndVideoLibraryType } from '../types/NasaImageAndVideoLibraryType.ts';
import style from './NavigationBar.module.css';
import SearchResults from './search/SearchResults.tsx';

function NavigationBar() {
    const profileButtonRef = useRef<HTMLButtonElement | null>(null);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<NasaImageAndVideoLibraryType | null>(null);

    const { isAuthenticated, logout, user } = useAuth();

    const [showResults, setShowResults] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const { t } = useTranslation();

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

    const handleProfileClick = () => {
        setShowProfileMenu((current) => !current);
    };

    const handleLogout = () => {
        void logout();
        setShowProfileMenu(false);
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
                        <Button
                            ref={profileButtonRef}
                            variant="none"
                            className={style.profileButtonStyle}
                            onClick={handleProfileClick}
                            aria-label="Profile options"
                            aria-expanded={showProfileMenu}
                        >
                            <CgProfile size={24} />
                        </Button>
                        <Overlay
                            target={profileButtonRef.current}
                            show={showProfileMenu}
                            placement="bottom-end"
                            rootClose
                            onHide={() => setShowProfileMenu(false)}
                        >
                            {(overlayProps) => (
                                <Popover
                                    id="profile-options-popover"
                                    className={style.profilePopoverStyle}
                                    {...overlayProps}
                                >
                                    <Popover.Body className={style.profilePopoverBodyStyle}>
                                        <Nav className="flex-column">
                                            {!isAuthenticated ? (
                                                <>
                                                    <Nav.Link
                                                        href="/login"
                                                        className={style.profileMenuItemStyle}
                                                        onClick={() => setShowProfileMenu(false)}
                                                    >
                                                        {t('navigation.login')}
                                                    </Nav.Link>
                                                    <Nav.Link
                                                        href="/register"
                                                        className={style.profileMenuItemStyle}
                                                        onClick={() => setShowProfileMenu(false)}
                                                    >
                                                        {t('navigation.register')}
                                                    </Nav.Link>
                                                </>
                                            ) : null}
                                            {isAuthenticated ? (
                                                <>
                                                    <div className={style.profileMenuInfoStyle}>
                                                        <p>
                                                            {t('navigation.loggedInAs')} {user?.username}
                                                        </p>
                                                        <div className={style.profileMenuDividerStyle}/>
                                                    </div>
                                                    <Button
                                                        variant="light"
                                                        className={style.profileMenuItemStyle}
                                                        onClick={handleLogout}
                                                    >
                                                        {t('navigation.logout')}
                                                    </Button>
                                                </>
                                            ) : null}
                                        </Nav>
                                    </Popover.Body>
                                </Popover>
                            )}
                        </Overlay>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
