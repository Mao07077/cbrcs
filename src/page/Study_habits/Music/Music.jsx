import React, { useState } from 'react';
import styles from './MusicPlayer.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const MusicPlayer = () => {
	const [youtubeURL, setYoutubeURL] = useState('');
	const [customPlaylist, setCustomPlaylist] = useState([]);
	const [currentVideo, setCurrentVideo] = useState('');

	const fetchVideoDetails = async (url) => {
		try {
			const videoId = new URL(url).searchParams.get('v');
			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=YOUR_API_KEY&part=snippet`
			);
			const data = await response.json();
			const snippet = data.items[0]?.snippet;
			return {
				title: snippet?.title || 'Unknown Title',
				thumbnail: snippet?.thumbnails?.default?.url || '',
			};
		} catch {
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
		}
	};

	const handleRemoveFromPlaylist = (url) => {
		setCustomPlaylist(customPlaylist.filter((video) => video.url !== url));
	};

	const handlePlayVideo = (url) => {
		setCurrentVideo(url);
	};

	return (
		<div className={styles.page_container}>
			<Header isStudyHabits={true}></Header>
			<div className={styles.container_wrapper}>
				<div className={styles.music_player_container}>
					<h2 className={styles.header}>YouTube Music Player</h2>

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

					<div className={styles.youtubePlayerContainer}>
						{currentVideo && (
							<iframe
								src={currentVideo.replace('watch?v=', 'embed/')}
								title="YouTube Video Player"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						)}
					</div>

					<div className={styles.customPlaylist}>
						<h3>Your Playlist</h3>
						{customPlaylist.length === 0 ? (
							<p>No videos in the playlist</p>
						) : (
							customPlaylist.map((video, index) => (
								<div key={index} onClick={() => handlePlayVideo(video.url)}>
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
			<Footer></Footer>
		</div>
	);
};

export default MusicPlayer;
