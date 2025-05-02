import React, { useState } from 'react';
import styles from './MusicPlayer.module.css';

const MusicPlayer = () => {
	const [youtubeUrl, setYoutubeUrl] = useState('');
	const [videoId, setVideoId] = useState('');

	const handlePlayVideo = () => {
		const urlParams = new URLSearchParams(new URL(youtubeUrl).search);
		setVideoId(urlParams.get('v'));
	};

	return (
		<div className={styles.page_container}>
			<div className={styles.container_wrapper}>
				<div className={styles.music_wrapper}>
					<div className={styles.music_player_container}>
						<div className={styles.youtubeInput}>
							<input
								type="text"
								placeholder="Enter YouTube URL"
								value={youtubeUrl}
								onChange={(e) => setYoutubeUrl(e.target.value)}
							/>
							<button onClick={handlePlayVideo}>Play Video</button>
						</div>
						{videoId && (
							<div className={styles.youtubePlayerContainer}>
								<iframe
									src={`https://www.youtube.com/embed/${videoId}`}
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MusicPlayer;