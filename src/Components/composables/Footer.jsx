//
import Styles from './Footer.module.css';
import Icon from '../../icon/actual.png';
export default function Footer() {
	return (
		<footer className={Styles.footer}>
			{/* insert logo here */}
			<ul>
				<h2>Contact Us</h2>
				<li>Phone No#: </li>
				<li>Address:</li>
				<li>Email:</li>
			</ul>
			<div className={Styles.Logo_Wrapper}>
				<img src={Icon} alt="logo" />
				<p>© 2024 Dr. Carl Balita Review Center. All Rights Reserved.</p>
			</div>
		</footer>
	);
}
