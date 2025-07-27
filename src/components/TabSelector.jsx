import React from 'react';
import styles from './styles/TabSelector.module.css';

const TabSelector = ({ activeTab, onTabChange }) => {
    return (
        <div className={styles.tabSelector}>
            <button
                className={activeTab === 'For You' ? styles.active : ''}
                onClick={() => onTabChange('For You')}
            >
                For You
            </button>
            <button
                className={activeTab === 'Top Tracks' ? styles.active : ''}
                onClick={() => onTabChange('Top Tracks')}
            >
                Top Tracks
            </button>
        </div>
    );
};

export default TabSelector;