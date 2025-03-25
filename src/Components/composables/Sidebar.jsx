/**
 * Sidebar component.
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.routes - Array of route objects.
 * @param {string} props.routes[].routeName - The name of the route.
 * @param {string} props.routes[].routePath - The path of the route.
 * @param {JSX.Element} props.routes[].routeIcon - The icon for the route.
 * @returns {JSX.Element} The Sidebar component.
 */

export default function Sidebar({ routes }) {
	return (
		<div className="sidebar">
			<ul>
				{routes.map((route, index) => (
					<li key={index} className="sidebar-item">
						{route.routeIcon && <span className="icon">{route.routeIcon}</span>}
						<a href={route.routePath}>{route.routeName}</a>
					</li>
				))}
			</ul>
		</div>
	);
}
