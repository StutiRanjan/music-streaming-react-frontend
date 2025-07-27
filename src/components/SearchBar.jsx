import React from 'react';
import styles from './styles/SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search Song, Artist"
            onChange={(e) => onSearch(e.target.value)}
            className={styles.searchBar}
        />
    );
};

export default SearchBar;