import { useTranslation } from 'react-i18next';

import styles from './FooterBar.module.css';

function FooterBar() {
    const { t } = useTranslation();

    return (
        <footer className={styles.footerBar}>
            <div className={styles.firstDiv}>
                <img src="/logo/logo-light.png" alt="App Logo" className={styles.logo} />
                <h1>{t('galacticView.title')}</h1>
                <p>{t('galacticView.description')}</p>
                <p>{t('galacticView.copyright')}</p>
            </div>
            <div className={styles.secondDiv}>
                <div>
                    <p>{t('footer.home')}</p>
                    <p>{t('footer.explore')}</p>
                    <p>{t('footer.blog')}</p>
                    <p>{t('footer.aboutUs')}</p>
                </div>
                <div>
                    <p>{t('footer.contact')}</p>
                    <p>{t('footer.privacyPolicy')}</p>
                    <p>{t('footer.termsOfService')}</p>
                    <p>{t('footer.helpCenter')}</p>
                </div>
                <div>
                    <p>{t('footer.followUs')}</p>
                    <p>{t('footer.facebook')}</p>
                    <p>{t('footer.twitter')}</p>
                    <p>{t('footer.instagram')}</p>
                </div>
            </div>
        </footer>
    );
}

export default FooterBar;
