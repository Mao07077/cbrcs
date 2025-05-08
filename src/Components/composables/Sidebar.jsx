import Styles from './Sidebar.module.css';
import { Link, useNavigate } from 'react-router-dom';
/**
 * Sidebar component.
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.routes - Array of route objects.
 * @param {string} props.routes[].routeName - The name of the route.
 * @param {string} props.routes[].routePath - The path of the route.
 * @param {JSX.Element} props.routes[].routeIcon - The icon for the route.
 * @returns {JSX.Element} The Sidebar component.
 * @description This is a resuable sidebar just read the params for the props
 */

export default function Sidebar({ routes }) {
	const navigate = useNavigate();

	function go(url) {
		navigate(url);
	}
	return (
		<nav className={Styles.nav}>
			<ul className={Styles.ul}>
				<h3>Navigation</h3>
				<hr size="100px"></hr>
				{routes.map((route, index) => (
					<li
						key={index}
						className={Styles.li}
						onClick={() => navigate(route.routePath)}
					>
						{route.routeIcon && (
							<span className={Styles.icon}>{route.routeIcon}</span>
						)}
						<Link className={Styles.a} to={route.routePath}>
							{route.routeName}
						</Link>
					</li>
				))}
			</ul>
			<ul className={Styles.uls}>
			{routes.map((route, index) => (
					<li
						key={index}
						className={Styles.li}
						onClick={() => navigate(route.routePaths)}
					>
						{route.routeIcons && (
							<span className={Styles.icon}>{route.routeIcons}</span>
						)}
						<Link className={Styles.a} to={route.routePaths}>
							{route.routeNames}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
