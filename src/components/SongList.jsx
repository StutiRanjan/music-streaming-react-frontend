import React from 'react';
import styles from './styles/SongList.module.css';

const SongList = ({ songs, currentSong, onSongSelect, isMockData }) => {
    return (
        <div className={styles.songList}>
            {songs.map(song => (
                <div
                    key={song.id}
                    className={`${styles.songItem} ${currentSong?.id === song.id ? styles.active : ''}`}
                    onClick={() => onSongSelect(song)}
                >
                    <img
                        src={isMockData
                            ? `/mock_data/covers/${song.id}.jpg`
                            // Fetch cover from server
                            // Server API EXAMPLE (fetch cover by ID): http://localhost:5000/cover/1;
                            : `${process.env.REACT_APP_SERVER_BASE_URL}/cover/${song.id}`}
                        alt={song.name}
                        className={styles.coverArt}
                    />
                    <div className={styles.songInfo}>
                        <h3>{song.name}</h3>
                        <p>{song.artist}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SongList;