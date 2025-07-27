import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from "./styles/MusicPlayer.module.css";
import SongList from './SongList.jsx';
import Player from './Player.jsx';
import SearchBar from './SearchBar.jsx';
import TabSelector from './TabSelector.jsx';
import MusicLogo from '../assets/MusicLogo.svg';
import ArtistLogo from '../assets/ArtistLogo.svg';
import { mockSongs } from './mockSongs.js'; 

const MusicPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('For You');
    const [isMockData, setIsMockData] = useState(false);

    useEffect(() => {
        fetchSongs();
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
                event.preventDefault();
                setIsPlaying(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const fetchSongs = async () => {
        try {
            // Fetch songs from the server
            // Server API EXAMPLE (fetch all songs): http://localhost:5000/songs
            const response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/songs`);
            setSongs(response.data.data);
            setIsMockData(false);
            if (response.data.data.length > 0) {
                setCurrentSong(response.data.data[0]);
                console.log(`Successfully fetched songs from server (server URL: ${process.env.REACT_APP_SERVER_BASE_URL})`);
            }
        } catch (error) {
            console.error('Error fetching songs:', error);

            // Use mock data if the API fails
            setSongs(mockSongs());
            setIsMockData(true);
            if (mockSongs().length > 0) {
                setCurrentSong(mockSongs()[0]);
                console.log('Could not fetch songs from server.');
                console.log('Using mock songs data.');
            }
        }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const getFilteredSongs = useCallback(() => {
        return songs.filter(song =>
            (song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.artist.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (activeTab === 'For You' || (activeTab === 'Top Tracks' && song.top_track))
        );
    }, [songs, searchTerm, activeTab]);

    const handleNext = useCallback(() => {
        const filteredSongs = getFilteredSongs();
        const currentIndex = filteredSongs.findIndex(song => song.id === currentSong.id);
        const nextSong = filteredSongs[(currentIndex + 1) % filteredSongs.length];
        setCurrentSong(nextSong);
    }, [currentSong, getFilteredSongs]);

    const handlePrevious = useCallback(() => {
        const filteredSongs = getFilteredSongs();
        const currentIndex = filteredSongs.findIndex(song => song.id === currentSong.id);
        const previousSong = filteredSongs[(currentIndex - 1 + filteredSongs.length) % filteredSongs.length];
        setCurrentSong(previousSong);
    }, [currentSong, getFilteredSongs]);

    const handleSearch = (term) => setSearchTerm(term);
    const handleTabChange = (tab) => setActiveTab(tab);

    const filteredSongs = getFilteredSongs();

    return (
        <div className={styles.musicPlayer} style={{ background: `linear-gradient(to bottom, ${currentSong?.accent || '#000000'}, #000000)` }}>
            <div className={styles.leftPanel}>
                <div className={styles.logoDiv}>
                <img src={MusicLogo} alt="Spotify" />
                Feel the Music
                </div>
                <img src={ArtistLogo} alt="Profile" />
            </div>
            <div className={styles.centerPanel}>
                <SearchBar onSearch={handleSearch} />
                <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />
                <SongList
                    songs={filteredSongs}
                    currentSong={currentSong}
                    onSongSelect={setCurrentSong}
                    isMockData={isMockData}
                />
            </div>
            <div className={styles.rightPanel}>
                <Player
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isMockData={isMockData}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;