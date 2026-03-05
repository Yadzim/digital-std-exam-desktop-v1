import React, { useEffect } from 'react';
import { FC, useState } from "react";
import i18n from 'config/i18n';
import UzbImage from "assets/images/uzb-flag.png"
import RusImage from "assets/images/rus-flag.jpg"
import EngImage from "assets/images/en-flag.jpg"
import "./styles.scss";

const LanguageV2: FC<any> = (props): JSX.Element => {
    const langs = [
        {
            id: 1,
            title: "UZ",
            key: "uz",
            img: UzbImage
        },
        {
            id: 3,
            title: "RU",
            key: "ru",
            img: RusImage
        },
        {
            id: 2,
            title: "EN",
            key: "en",
            img: EngImage
        },
    ]

    const currentLang = localStorage.getItem("i18lang") || "uz";
    const [selectedLang, setSelectedLang] = useState<string>(currentLang);

    useEffect(() => {
        const lang = localStorage.getItem("i18lang") || "uz";
        setSelectedLang(lang);
        i18n.changeLanguage(lang);
    }, []);

    const changeLang = (langKey: string) => {
        localStorage.setItem("i18lang", langKey);
        setSelectedLang(langKey);
        i18n.changeLanguage(langKey);
    }

    return (
        <div className="language-segmented">
            {langs.map((lang) => (
                <button
                    key={lang.id}
                    className={`lang-segment ${selectedLang === lang.key ? 'active' : ''}`}
                    onClick={() => changeLang(lang.key)}
                    type="button"
                >
                    <img className="lang-flag" src={lang.img} alt={lang.title} />
                    <span className="lang-title">{lang.title}</span>
                </button>
            ))}
        </div>
    )
}

export default LanguageV2;
