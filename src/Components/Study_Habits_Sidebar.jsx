import { HomeIcon, SquarePen, UserIcon, Flag, Upload } from 'lucide-react';
import Sidebar from './composables/Sidebar';

const routes = [
	{
		routeName: 'Profile',
		routePath: '/profile',
		routeIcon: <HomeIcon></HomeIcon>,
	},
	{
		routeName: 'Modules',
		routePath: '/module',
		routeIcon: <UserIcon></UserIcon>,
	},
	{
		routeName: 'Dashboard',
		routePath: '/dashboard',
		routeIcon: <Upload></Upload>,
	},
	{
		routeName: 'Request',
		routePath: '/settings',
		routeIcon: <Flag></Flag>,
	},

	{
		routeName: 'Help',
		routePath: '/help',
		routeIcon: <SquarePen></SquarePen>,
	},
];

export default function Study_Habits_Sidebar() {
	return <Sidebar routes={routes}></Sidebar>;
}
