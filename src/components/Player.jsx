import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/Player.module.css';
import OptionsButton from '../assets/OptionsButton.svg';
import PreviousButton from '../assets/PreviousButton.svg';
import PlayButton from '../assets/PlayButton.svg';
import PauseButton from '../assets/PauseButton.svg';
import NextButton from '../assets/NextButton.svg';
import SoundOnButton from '../assets/SoundOnButton.svg';
import SoundOffButton from '../assets/SoundOffButton.svg';

const Player = ({ currentSong, isPlaying, onPlay, onPause, onNext, onPrevious, isMockData }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(new Audio());
    const prevSongRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => onNext();

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [onNext]);

    // Handle song changes (separated from play/pause logic)
    useEffect(() => {
        const audio = audioRef.current;
        if (currentSong) {
            let src;
            if (isMockData) {
                src = `/mock_data/songs/${currentSong.id}.mp3`;
            } else {
                // Fetch song from server
                // Server API EXAMPLE (fetch song by ID): http://localhost:5000/song/1;
                src = `${process.env.REACT_APP_SERVER_BASE_URL}/song/${currentSong.id}`;
            }
            
            // Only load if the source actually changed
            if (audio.src !== src) {
                audio.src = src;
                audio.load();
            }
        }
    }, [currentSong, isMockData]);

    // Handle auto-play for new songs
    useEffect(() => {
        const audio = audioRef.current;
        
        // Check if song actually changed
        if (currentSong && prevSongRef.current !== currentSong) {
            prevSongRef.current = currentSong;
            
            if (isPlaying) {
                const playWhenReady = () => {
                    audio.play().catch(error => console.error('Error playing audio:', error));
                    audio.removeEventListener('canplay', playWhenReady);
                };
                audio.addEventListener('canplay', playWhenReady);
            }
        }
    }, [currentSong, isPlaying]);

    // Handle play/pause state changes
    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.play().catch(error => console.error('Error playing audio:', error));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    const rangeRef = useRef(null);

    useEffect(() => {
        const updateRangeColor = () => {
            if (rangeRef.current) {
                const value = (currentTime / (duration || 100)) * 100;
                rangeRef.current.style.setProperty('--range-progress', `${value}%`);
            }
        };
        updateRangeColor();
    }, [currentTime, duration]);

    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const toggleMute = () => {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    if (!currentSong) return null;

    // Cover image fallback
    let coverSrc;
    if (isMockData) {
        coverSrc = `/mock_data/covers/${currentSong.id}.jpg`;
    } else {
        // Fetch cover from server
        // Server API EXAMPLE (fetch cover by ID): http://localhost:5000/cover/1;
        coverSrc = `${process.env.REACT_APP_SERVER_BASE_URL}/cover/${currentSong.id}`;
    }

    return (
        <div className={styles.player}>
            <div className={styles.songInfo}>
                <h2>{currentSong.name}</h2>
                <p>{currentSong.artist}</p>
            </div>
            <img src={coverSrc} alt={currentSong.name} className={styles.coverArt} />
            <div className={styles.seekbarContainer}>
                <input
                    ref={rangeRef}
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className={styles.seekbar}
                />
            </div>
            <div className={styles.controls}>
                <button className={styles.controlButton}>
                    <img src={OptionsButton} alt="Options" />
                </button>
                <div className={styles.middleControl}>
                    <button onClick={onPrevious} className={styles.controlButton}>
                        <img src={PreviousButton} alt="Previous" />
                    </button>
                    {isPlaying ? (
                        <button onClick={onPause} className={`${styles.controlButton} ${styles.playPauseButton}`}>
                            <img src={PauseButton} alt="Pause" />
                        </button>
                    ) : (
                        <button onClick={onPlay} className={`${styles.controlButton} ${styles.playPauseButton}`}>
                            <img src={PlayButton} alt="Play" />
                        </button>
                    )}
                    <button onClick={onNext} className={styles.controlButton}>
                        <img src={NextButton} alt="Next" />
                    </button>
                </div>
                <button onClick={toggleMute} className={styles.controlButton}>
                    <img src={isMuted ? SoundOffButton : SoundOnButton} alt={isMuted ? "Unmute" : "Mute"} />
                </button>
            </div>
        </div>
    );
};

export default Player;