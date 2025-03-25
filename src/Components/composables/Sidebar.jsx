import Styles from './Sidebar.module.css';

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
	return (
		<nav className={Styles.nav}>
			<ul className={Styles.ul}>
				<h3>Navigation</h3>
				<hr size="100px"></hr>
				{routes.map((route, index) => (
					<li key={index} className={Styles.li}>
						{route.routeIcon && (
							<span className={Styles.icon}>{route.routeIcon}</span>
						)}
						<a className={Styles.a} href={route.routePath}>
							{route.routeName}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
