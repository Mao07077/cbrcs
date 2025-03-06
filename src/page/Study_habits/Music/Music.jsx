import React, { useState, useEffect, useRef } from 'react';
import styles from './MusicPlayer.module.css';
import Header from '../../../Components/Header';

const genres = {
    Pop: [
        { title: 'Sunny Day', src: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3' },
        { title: 'Acoustic Breeze', src: 'https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3' },
        { title: 'Memories', src: 'https://www.bensound.com/bensound-music/bensound-memories.mp3' }
    ],
    Rock: [
        { title: 'Extreme Action', src: 'https://www.bensound.com/bensound-music/bensound-extremeaction.mp3' },
        { title: 'Energy', src: 'https://www.bensound.com/bensound-music/bensound-energy.mp3' },
        { title: 'Rock and Roll', src: 'https://www.bensound.com/bensound-music/bensound-rockandroll.mp3' }
    ],
    Jazz: [
        { title: 'The Jazz Piano', src: 'https://www.bensound.com/bensound-music/bensound-thejazzpiano.mp3' },
        { title: 'Slow Jazz', src: 'https://www.bensound.com/bensound-music/bensound-slowjazz.mp3' },
        { title: 'Sexy', src: 'https://www.bensound.com/bensound-music/bensound-sexy.mp3' }
    ]
};

const MusicPlayer = () => {
    const [selectedGenre, setSelectedGenre] = useState('Pop');
    const [currentSong, setCurrentSong] = useState(genres['Pop'][0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentSong]);

    const handleGenreChange = (genre) => {
        setSelectedGenre(genre);
        setCurrentSong(genres[genre][0]);
        setIsPlaying(false);
    };

    const handleNextSong = () => {
        const songList = genres[selectedGenre];
        const currentIndex = songList.indexOf(currentSong);
        const nextIndex = (currentIndex + 1) % songList.length;
        setCurrentSong(songList[nextIndex]);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={styles.page_container}>
            <Header />
            <div className={styles.music_player_container}>
                <h2 className={styles.header}>Music Player</h2>
                
                <div className={styles.genreSelector}>
                    {Object.keys(genres).map((genre) => (
                        <button key={genre} onClick={() => handleGenreChange(genre)}>
                            {genre}
                        </button>
                    ))}
                </div>

                <div className={styles.songList}>
                    {genres[selectedGenre].map((song) => (
                        <div 
                            key={song.title} 
                            className={song === currentSong ? styles.activeSong : ''} 
                            onClick={() => setCurrentSong(song)}
                        >
                            {song.title}
                        </div>
                    ))}
                </div>

                <div className={styles.controls}>
                    <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                    <button onClick={handleNextSong}>Next</button>
                </div>

                <div className={styles.nowPlaying}>
                    Now Playing: {currentSong.title}
                </div>

                <audio ref={audioRef} src={currentSong.src} />
            </div>
        </div>
    );
};

export default MusicPlayer;
