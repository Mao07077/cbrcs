import React, { useState, useRef } from 'react';
import styles from './MusicPlayer.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const MusicPlayer = () => {
    const [youtubeURL, setYoutubeURL] = useState('');
    const [customPlaylist, setCustomPlaylist] = useState([]);
    const [currentVideo, setCurrentVideo] = useState('');
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || 'YOUR_API_KEY';

    const fetchVideoDetails = async (url) => {
        setError(null);
        try {
            const videoId = new URL(url).searchParams.get('v');
            if (!videoId) {
                throw new Error('Invalid YouTube URL');
            }
            if (YOUTUBE_API_KEY === 'YOUR_API_KEY') {
                throw new Error('YouTube API key is missing. Please configure REACT_APP_YOUTUBE_API_KEY.');
            }

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch video details: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            const snippet = data.items[0]?.snippet;
            if (!snippet) {
                throw new Error('Video not found');
            }
            return {
                title: snippet.title || 'Unknown Title',
                thumbnail: snippet.thumbnails?.default?.url || '',
            };
        } catch (err) {
            console.error('Error fetching video details:', err);
            setError(err.message || 'Failed to fetch video details');
            return { title: 'Unknown Title', thumbnail: '' };
        }
    };

    const handleAddToPlaylist = async () => {
        if (youtubeURL.trim() && !customPlaylist.some((item) => item.url === youtubeURL)) {
            const { title, thumbnail } = await fetchVideoDetails(youtubeURL);
            setCustomPlaylist([...customPlaylist, { url: youtubeURL, title, thumbnail }]);
            setYoutubeURL('');
        }
    };

    const handlePlayNow = () => {
        if (youtubeURL.trim()) {
            setCurrentVideo(youtubeURL);
            setError(null);
        } else {
            setError('Please enter a valid YouTube URL');
        }
    };

    const handleRemoveFromPlaylist = (url) => {
        setCustomPlaylist(customPlaylist.filter((video) => video.url !== url));
    };

    const handlePlayVideo = (url) => {
        setCurrentVideo(url);
        setError(null);
    };

    return (
        <div className={styles.page_container}>
            <Header isStudyHabits={true}></Header>
            <div className={styles.container_wrapper}>
                <div className={styles.music_player_container}>
                    <h2 className={styles.header}>YouTube Music Player</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <div className={styles.youtubeInput}>
                        <input
                            type="text"
                            placeholder="Enter YouTube URL"
                            value={youtubeURL}
                            onChange={(e) => setYoutubeURL(e.target.value)}
                        />
                        <button onClick={handlePlayNow}>Play Now</button>
                        <button onClick={handleAddToPlaylist}>Add to Playlist</button>
                    </div>

                    <div className={styles.contentWrapper}>
                        <div className={styles.youtubePlayerContainer}>
                            {currentVideo && (
                                <>
                                    <iframe
                                        ref={videoRef}
                                        src={currentVideo.replace('watch?v=', 'embed/')}
                                        title="YouTube Video Player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                    <p className={styles.pipInfo}>
                                        To enable Picture-in-Picture, right-click the video and select "Picture in Picture" (supported in Chrome/Edge).
                                    </p>
                                </>
                            )}
                        </div>

                        <div className={styles.customPlaylist}>
                            <h3>Your Playlist</h3>
                            {customPlaylist.length === 0 ? (
                                <p>No videos in the playlist</p>
                            ) : (
                                customPlaylist.map((video, index) => (
                                    <div key={index} onClick={() => handlePlayVideo(video.url)} className={styles.playlistItem}>
                                        <img src={video.thumbnail} alt={video.title} />
                                        <span>{video.title}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFromPlaylist(video.url);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MusicPlayer;