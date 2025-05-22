// src/components/LanguageSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import languages from '../language';

function LanguageSelector() {
    const { i18n } = useTranslation();

    const handleChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <select
            onChange={handleChange}
            value={i18n.language}
            className="bg-[#1d4c5c] !text-white px-4 py-2 rounded-md text-base"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                </option>
            ))}
        </select>
    );
}

export default LanguageSelector;
