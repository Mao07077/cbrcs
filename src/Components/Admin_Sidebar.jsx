import { HomeIcon, SquarePen, UserIcon, Flag, ArrowBigLeftDashIcon,DatabaseIcon,LucideLayoutDashboard } from 'lucide-react';
import Sidebar from './composables/Sidebar';

const routes = [
	{
		routeName: 'Dashboard',
		routePath: '/Admin_Dashboard',
		routeIcon: <LucideLayoutDashboard></LucideLayoutDashboard>,
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
		routeName: 'StudentData',
		routePath: '/StudentReport',
		routeIcon: <DatabaseIcon></DatabaseIcon>,
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
