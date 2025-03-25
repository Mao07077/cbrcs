import Icon from '../../icon/actual.png';
import Styles from './Header.module.css';
/**
 * Header component.
 * @returns {JSX.Element} The Header component.
 * @description This is a resuable header component */

export default function Header() {
	return (
		<header className={Styles.Header}>
			<img src={Icon} alt="logo" />
		</header>
	);
}
