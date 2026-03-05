import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationUz from "../locales/uz/translation.json"
import translationRu from "../locales/ru/translation.json"
import translationEn from "../locales/en/translation.json"

const resources = {
  uz: {
    translation: translationUz,
  },
  ru: {
    translation: translationRu,
  },
  en: {
    translation: translationEn,
  },
};

const language = localStorage.getItem("i18lang")

if (!language) {
  localStorage.setItem("i18lang", "uz")
}


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: resources,
    lng: localStorage.getItem("i18lang") || 'uz',
    fallbackLng: "uz",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;