import { SquarePen, UserIcon, Book, Upload, IdCard } from 'lucide-react';
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
		routeIcon: <Upload></Upload>,
	},
	{
		routeName: 'Study Habits',
		routePath: '/StudyHabits_landingpage',
		routeIcon: <IdCard></IdCard>,
	},

	{
		routeName: 'Request',
		routePath: '/Settings',
		routeIcon: <SquarePen></SquarePen>,
	},
];

export default function Student_Sidebar() {
	return <Sidebar routes={routes}></Sidebar>;
}
