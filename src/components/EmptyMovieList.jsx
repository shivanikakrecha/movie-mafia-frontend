// External Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * EmptyMovieList Component
 * Displays a message and button when the movie list is empty
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onAddMovie - Handler for adding new movie
 * @returns {JSX.Element} Empty state component for movie list
 */
const EmptyMovieList = ({ onAddMovie }) => {
  // Styles
  const containerStyles = "empty-movielist-container";
  const titleStyles = "empty-movielist-title";
  const buttonStyles = "add-new-movie";

  const { t } = useTranslation();

  return (
    <div className={containerStyles}>
      <h2 className={titleStyles}>{t('Your movie list is empty')}</h2>
      <button 
        className={buttonStyles} 
        onClick={onAddMovie}
        aria-label={t("Add New Movie")}
      >
        {t('Add New Movie')}
      </button>
    </div>
  );
};

// PropTypes
EmptyMovieList.propTypes = {
  onAddMovie: PropTypes.func.isRequired,
};

export default EmptyMovieList;
