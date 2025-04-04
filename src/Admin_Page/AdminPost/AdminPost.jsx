import React, { useState } from 'react';

import Styles from './AdminPost.module.css';
import QuillStyles from './QuillStyles.module.css'; // Import the new CSS file
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's default styles
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/FooterAdmin';
import Header from '../../Components/composables/Header';

const AdminPost = () => {
	// State for images and text
	const [introText, setIntroText] = useState({
		header: 'Welcome to Dr. Carl Balita Review Center Student Portal',
		subHeader: 'Where the dream and the dreamer become ONE!',
	});
	const [introImage, setIntroImage] = useState(null); // State for intro image
	const [newsContent, setNewsContent] = useState(''); // State for the news content
	const [loginImage, setLoginImage] = useState(null);
	const [signupImage, setSignupImage] = useState(null);
	const [newsImage, setNewsImage] = useState(null); // State for the news image
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

	// Handle news submission
	const handleNewsSubmit = () => {
		alert(`News Content: ${newsContent}`);
		// Add logic to save the news content and image
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
							className={Styles.EditIntroSubmitButton} // Unique class for Edit Intro button
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
						<h2>Post News</h2>
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
						<div className={QuillStyles.qlContainer}>
							<ReactQuill
								value={newsContent}
								onChange={setNewsContent}
								placeholder="Write your news or announcements here..."
								modules={{
									toolbar: [
										[{ header: [1, 2, false] }],
										['bold', 'italic', 'underline', 'strike'],
										[{ list: 'ordered' }, { list: 'bullet' }],
										['link', 'image'],
										['clean'],
									],
								}}
								formats={[
									'header',
									'bold',
									'italic',
									'underline',
									'strike',
									'list',
									'bullet',
									'link',
									'image',
								]}
							/>
						</div>
						<button
							className={Styles.NewsSubmitButton} // Unique class for Post News button
							onClick={handleNewsSubmit}
						>
							Post News
						</button>
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
