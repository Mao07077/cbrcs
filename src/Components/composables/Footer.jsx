//
import Styles from './Footer.module.css';
import Icon from '../../icon/actual.png';
import { Facebook, Globe } from 'lucide-react';
/**
 * Footer component.
 * @returns {JSX.Element} The Footer component.
 * @description This is a resuable footer  import this to any parent component to apply the footer */

export default function Footer() {
	const footerInfo = {
		address:
			'4th Flr., MGSC Bldg., Alabang-Zapote Road, Almanza Uno, Las Piñas City',
		phoneNo: '09664059257',
		fb: 'https://www.facebook.com/CarlBalitaLP?rdid=gbKbc1KgF7wuSaNh&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F15wPaMJrxP%2F',
		website: 'https://drcarlbalitareviewcenter.com/',
	};

	return (
		<footer className={Styles.footer}>
			{/* insert logo here */}
			<div className={Styles.Logo_Wrapper}>
				<img src={Icon} alt="logo" />
			</div>
			<ul>
				<li>Phone No#: {footerInfo.phoneNo} </li>
				<li>Address: {footerInfo.address} </li>
				{/* socials */}
				<li>
					Facebook:&nbsp;
					<a href={footerInfo.fb} target="_blank">
						Carl Balita
					</a>
				</li>
				<li>
					Website: &nbsp;
					<a href={footerInfo.website} target="_blank">
						drcarlbalitareviewcenter.com
					</a>
				</li>
			</ul>
		</footer>
	);
}
