import React, { useState } from 'react';

import Styles from './AdminPost.module.css';

import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/Footer';
import Header from '../../Components/composables/Header';

const AdminPost = () => {
	// State for images and text
	const [introText, setIntroText] = useState({
		header: 'Welcome to Dr. Carl Balita Review Center Student Portal',
		subHeader: 'Where the dream and the dreamer become ONE!',
	});
	const [introImage, setIntroImage] = useState(null); // State for intro image
	const [news, setNews] = useState('');
	const [loginImage, setLoginImage] = useState(null);
	const [signupImage, setSignupImage] = useState(null);
	const [newsImage, setNewsImage] = useState(null);
	const [courseImages, setCourseImages] = useState([null, null, null]);
	const [newsStyle, setNewsStyle] = useState({
		fontSize: '14px', // Adjusted font size for alignment
		fontWeight: 'normal',
		fontStyle: 'normal',
		color: '#333',
	});

	// Handlers for image uploads
	const handleSingleImageUpload = (e, setImage) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setImage(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const handleCourseImageUpload = (e, index) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setCourseImages((prev) => {
					const updated = [...prev];
					updated[index] = reader.result;
					return updated;
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const handleStyleChange = (key, value) => {
		setNewsStyle((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<div className={Styles.Maincontainer}>
			{/* Header */}
			<Header></Header>
			{/* Wrapper */}
			<div className={Styles.Content_Wrapper}>
				{/* Sidebar */}
				<Admin_Sidebar></Admin_Sidebar>
				{/* Content */}
				<div className={Styles.Content}>
					{/* Intro Section */}
					<div className={Styles.Text_Container}>
						<h1>{introText.header}</h1>
						<p>{introText.subHeader}</p>
						{/* Intro Image */}
						<div className={Styles.Editable_Image_Input}>
							<label htmlFor="introImageUpload">Upload Intro Image:</label>
							<input
								type="file"
								id="introImageUpload"
								onChange={(e) => handleSingleImageUpload(e, setIntroImage)}
							/>
							{introImage && (
								<div className={Styles.Image_Previews}>
									<img src={introImage} alt="Intro Preview" />
								</div>
							)}
						</div>
						<button
							className={Styles.EditIntroButton}
							onClick={() => alert('Edit Intro functionality here')}
						>
							Edit Intro
						</button>
					</div>

					{/* Login Image */}
					<div className={Styles.Editable_Image_Input}>
						<label htmlFor="loginImageUpload">Upload Login Image:</label>
						<input
							type="file"
							id="loginImageUpload"
							onChange={(e) => handleSingleImageUpload(e, setLoginImage)}
						/>
						{loginImage && (
							<div className={Styles.Image_Previews}>
								<img src={loginImage} alt="Login Preview" />
							</div>
						)}
					</div>

					{/* Signup Image */}
					<div className={Styles.Editable_Image_Input}>
						<label htmlFor="signupImageUpload">Upload Signup Image:</label>
						<input
							type="file"
							id="signupImageUpload"
							onChange={(e) => handleSingleImageUpload(e, setSignupImage)}
						/>
						{signupImage && (
							<div className={Styles.Image_Previews}>
								<img src={signupImage} alt="Signup Preview" />
							</div>
						)}
					</div>

					{/* News Section */}
					<div className={Styles.News_Container}>
						<div className={Styles.Editable_Image_Input}>
							<label htmlFor="newsImageUpload">Upload News Image:</label>
							<input
								type="file"
								id="newsImageUpload"
								onChange={(e) => handleSingleImageUpload(e, setNewsImage)}
							/>
							{newsImage && (
								<div className={Styles.Image_Previews}>
									<img src={newsImage} alt="News Preview" />
								</div>
							)}
						</div>
						<textarea
							style={newsStyle}
							value={news}
							onChange={(e) => setNews(e.target.value)}
							placeholder="Write news or announcements here..."
						/>
						<div className={Styles.FontControls}>
							<label>
								Font Size:
								<input
									type="number"
									value={parseInt(newsStyle.fontSize)}
									onChange={(e) =>
										handleStyleChange('fontSize', `${e.target.value}px`)
									}
								/>
							</label>
							<label>
								Font Weight:
								<select
									value={newsStyle.fontWeight}
									onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
								>
									<option value="normal">Normal</option>
									<option value="bold">Bold</option>
								</select>
							</label>
							<label>
								Font Style:
								<select
									value={newsStyle.fontStyle}
									onChange={(e) => handleStyleChange('fontStyle', e.target.value)}
								>
									<option value="normal">Normal</option>
									<option value="italic">Italic</option>
								</select>
							</label>
							<label>
								Color:
								<input
									type="color"
									value={newsStyle.color}
									onChange={(e) => handleStyleChange('color', e.target.value)}
								/>
							</label>
						</div>
						<button onClick={() => alert('News added: ' + news)}>Add News</button>
					</div>

					{/* Featured Courses */}
					<div className={Styles.Featured_Courses}>
						<div className={Styles.Featured_Text}>
							<h2>Featured Courses</h2>
							<p>Browse through our top performing courses</p>
						</div>
						<div className={Styles.Course_Grid}>
							{courseImages.map((image, index) => (
								<div key={index} className={Styles.Course_Card}>
									<div className={Styles.Editable_Image_Input}>
										<label htmlFor={`courseImageUpload${index}`}>
											Upload Course {index + 1} Image:
										</label>
										<input
											type="file"
											id={`courseImageUpload${index}`}
											onChange={(e) => handleCourseImageUpload(e, index)}
										/>
										{image && (
											<div className={Styles.Image_Previews}>
												<img src={image} alt={`Course ${index + 1} Preview`} />
											</div>
										)}
									</div>
									<input
										type="text"
										className={Styles.Editable_Text}
										placeholder={`Course ${index + 1} Title`}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{/* Footer */}
			<Footer></Footer>
		</div>
	);
};

export default AdminPost;
