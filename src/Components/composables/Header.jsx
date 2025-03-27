import { useNavigate } from 'react-router-dom';
import Icon from '../../icon/actual.png';
import Styles from './Header.module.css';
/**
 * Header component.
 * @returns {JSX.Element} The Header component.
 * @description This is a resuable header component */

export default function Header() {
	const navigate = useNavigate();
	return (
		<header className={Styles.Header}>
			<img src={Icon} alt="logo" onClick={() => navigate('/')} />
		</header>
	);
}
