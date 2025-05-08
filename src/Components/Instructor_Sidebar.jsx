import { MessageCircle, UserIcon, Book, ScrollText, ArrowBigLeftDashIcon } from 'lucide-react';
import Sidebar from './composables/Sidebar';

const routes = [
	{
		routeName: 'Dashboard',
		routePath: '/Instructor_Dashboard',
		routeIcon: <UserIcon></UserIcon>,
	},
	{
		routeName: 'Chat',
		routePath: '/Chat',
		routeIcon: <MessageCircle></MessageCircle>,
	},
	{
		routeName: 'List of Students',
		routePath: '/studentlist',
		routeIcon: <ScrollText></ScrollText>,
	},
	{
		routeName: 'Modules',
		routePath: '/ModuleList',
		routeIcon: <Book></Book>,
	},
	{
		routeNames: 'Logout',
		routePaths: '/',
		routeIcons: <ArrowBigLeftDashIcon></ArrowBigLeftDashIcon>,
	},
];

export default function Instructor_Sidebar() {
	return <Sidebar routes={routes}></Sidebar>;
}
