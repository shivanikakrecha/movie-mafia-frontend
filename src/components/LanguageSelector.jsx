// src/components/LanguageSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import languages from '../language';

/**
 * LanguageSelector Component
 * Provides a dropdown menu for selecting the application language
 * 
 * @component
 * @returns {JSX.Element} A select dropdown for language selection
 */
function LanguageSelector() {
    // Hooks
    const { i18n } = useTranslation();

    /**
     * Handles language change event
     * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event
     */
    const handleChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    // Styles
    const selectStyles = "bg-[#1d4c5c] !text-white px-4 py-2 rounded-md text-base";

    return (
        <select
            onChange={handleChange}
            value={i18n.language}
            className={selectStyles}
            aria-label="Select Language"
        >
            {languages.map((lang) => (
                <option 
                    key={lang.code} 
                    value={lang.code}
                    aria-label={`Select ${lang.name}`}
                >
                    {lang.flag} {lang.name}
                </option>
            ))}
        </select>
    );
}

export default LanguageSelector;
