import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../icon/actual.png';
import Logo from '../../icon/logo.png';
import Styles from './Header.module.css';
import { ArrowBigLeft } from 'lucide-react';
/**
 * Header component.
 * @param {boolean} props isStudyHabits
 * @returns {JSX.Element} The Header component.
 * @description This is a resuable header component */

export default function Header({ isStudyHabits }) {
	const navigate = useNavigate();
	if (isStudyHabits) {
		return (
			<header className={Styles.Header_SH}>
				<img src={Icon} alt="logo" onClick={() => navigate('/')} />
				<div className={Styles.SH_Wrapper}>
					<Link to={'/StudyHabits_landingpage'}>
						<ArrowBigLeft size={32}></ArrowBigLeft>
						<p>Back To Study Habits</p>
					</Link>
					
				</div>
			</header>
		);
	} else
		return (
			<header className={Styles.Header}>
				<img src={Icon} alt="logo" onClick={() => navigate('/')} />
			</header>
		);
}
