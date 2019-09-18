import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
.use(XHR)
.use(LanguageDetector)
.init({
	debug: true,
});

export default i18n;