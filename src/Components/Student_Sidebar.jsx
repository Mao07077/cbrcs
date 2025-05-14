import { SquarePen, UserIcon, Book, HomeIcon, IdCard, Flag, ArrowBigLeftDashIcon } from 'lucide-react';
import Sidebar from './composables/Sidebar';

const routes = [
	{
		routeName: 'Profile',
		routePath: '/profile',
		routeIcon: <UserIcon></UserIcon>,
	},
	{
		routeName: 'Modules',
		routePath: '/module',
		routeIcon: <Book></Book>,
	},
	{
		routeName: 'Dashboard',
		routePath: '/dashboard',
		routeIcon: <HomeIcon></HomeIcon>,
	},
	{
		routeName: 'Study Habits',
		routePath: '/StudyHabits_landingpage',
		routeIcon: <IdCard></IdCard>,
	},
	{
		routeName: 'Reports',
		routePath: '/sendreport',
		routeIcon:  <Flag></Flag>,
	},
	{
		routeName: 'Request',
		routePath: '/Settings',
		routeIcon: <SquarePen></SquarePen>,
	},
	{
			routeNames: 'Logout',
			routePaths: '/',
			routeIcons: <ArrowBigLeftDashIcon></ArrowBigLeftDashIcon>,
		},
];

export default function Student_Sidebar() {
	return <Sidebar routes={routes}></Sidebar>;
}
