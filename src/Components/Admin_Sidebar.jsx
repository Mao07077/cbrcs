import { HomeIcon, SquarePen, UserIcon, Flag, ArrowBigLeftDashIcon } from 'lucide-react';
import Sidebar from './composables/Sidebar';

const routes = [
	{
		routeName: 'Dashboard',
		routePath: '/Admin_Dashboard',
		routeIcon: <HomeIcon></HomeIcon>,
	},
	{
		routeName: 'Accounts',
		routePath: '/Accounts',
		routeIcon: <UserIcon></UserIcon>,
	},
	{
		routeName: 'Report',
		routePath: '/Report',
		routeIcon: <Flag></Flag>,
	},

	{
		routeName: 'Request',
		routePath: '/Request',
		routeIcon: <SquarePen></SquarePen>,
	},
	{
		routeNames: 'Logout',
		routePaths: '/',
		routeIcons: <ArrowBigLeftDashIcon></ArrowBigLeftDashIcon>,
	},
];


export default function Admin_Sidebar() {
	return <Sidebar routes={routes}></Sidebar>;
	
}
