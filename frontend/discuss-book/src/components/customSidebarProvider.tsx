'use client'

import { useContext, useEffect, useState } from 'react';
import { SidebarProvider } from './sidebar';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from './sidebar';
import {
	Smile,
	Sparkles,
	LogOut,
	Plus,
	FileSpreadsheet,
	Globe,
	Lock,
	LogIn,
} from 'lucide-react';
import { ThemeContext } from '../state/context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SubscriptionModal from './SubscriptionModal';
import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';

interface SpaceDiscussion {
	_id: string;
	name: string;
	access: string;
	bookId: string;
}

interface SecondaryItem {
	icon: any;
	title: string;
	url: string | (() => void);
}

export function CustomSidebarProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [spacesDiscussionForUser, setSpacesDiscussionForUser] = useState<
		SpaceDiscussion[]
	>([]);
	const { state, dispatch } = useContext(ThemeContext);
	const router = useRouter();
	const [subscriptionModal, setsubscriptionModal] = useState<boolean>(false)

	useEffect(() => {

		console.log({ state })

	}, [state])

	const secondary: SecondaryItem[] = [
		{
			icon: Sparkles,
			title: 'Upgrade to Pro',
			url: '#',
		},
		{
			icon: Smile,
			title: 'Solicita una característica',
			url: '#',
		},
		...(state.user?.id
			? [
				{
					icon: LogOut,
					title: 'Logout',
					url: '/',
				},
			]
			: [
				{
					icon: LogIn,
					title: 'Login',
					url: '/auth/login',
				},
			]),
	];

	const createSpace = () => {
		// Si el usuario esta logueado, se redirige a la pagina de creacion de espacio de discusion
		if (state.user?.id) return router.push('/');

		// Si el usuario no esta logueado, se redirige a la pagina de login
		router.push('/auth/login');
	};

	const handleOnClick = (item: any) => {
		if (item?.title === 'Logout') {
			localStorage.removeItem('token_discuss_book');
			dispatch({
				type: 'setUser',
				payload: null,
			});
		}

		if (item?.title !== 'Upgrade to Pro') {
			router.push(item.url);
		} else {
			setsubscriptionModal(true)
		}

	}

	const handleOpenSpaceDiscussion = (item: any) => {

		dispatch({
			type: 'setSpaceDiscussion',
			payload: item,
		});

		dispatch({
			type: 'setLoading',
			payload: {
				is: true,
				message: 'Loading Space Discussion',
			}
		});
	}

	const getUser = async () => {
		const token_discuss_book = localStorage.getItem('token_discuss_book');

		// sacare la  condicional de ver si userId esta en el estado, ya que usando el token del localstorage obtendremos
		// el userId del usuario, para guardarlo en el state y usarlo en las peticiones, entonces ya tendriamos el userId y el token

		// En caso de que aca no haya token_disscuss_book, se redirige al usuario a la pagina de login
		// if (!token_disscuss_book || token_disscuss_book?.length === 0 /* && !state.userId */) {
		// 	// window.location.href = '/auth/login';
		// 	router.push('/auth/login');
		// }

		// Si no hay token_discuss_book, no se hace nada
		if (!token_discuss_book) return dispatch({
			type: 'setLoading',
			payload: {
				is: false,
				message: '',
			}
		});

		// Si hay token_discuss_book, se hace la peticion para obtener el usuario
		// y se guarda en el estado
		// pero antes tenemos que decodificar el payload que contiene el id del usuario
		// y guardarlo en el estado

		const decodedToken = jwtDecode(token_discuss_book);

		const responseUser = await fetch('http://localhost:4000/users/' + decodedToken?.sub, {
			method: 'GET',
			headers: {
				Authorization: token_discuss_book,
			},
		});

		if (responseUser.status !== 200) return toast.error('Failed to get user');

		const dataUser = await responseUser.json();

		if (dataUser?.status === 404) {
			localStorage.removeItem('token_discuss_book');
			toast.error('No user found');
			return;
		}

		// Obtenemos el estado subscription del usuario
		const responsePayments = await fetch(`/api/payments?userId=${dataUser?._id}`);
		if (responsePayments.status !== 200) return toast.error('Failed to get payments');

		const dataPayments = await responsePayments.json();

		dispatch({
			type: 'setUser',
			payload: {
				id: dataUser._id,
				email: dataUser.email,
				premium: dataPayments?.isPremium,
			},
		});

		// Obtenemos los espacios de discusion toditos los espacios de discusion y ponemos los que son del usuario en un state para que se muestren en su navbar
		const response = await fetch(
			'http://localhost:4000/spaces-discussion',
			{
				method: 'GET',
				headers: {
					Authorization:
						localStorage.getItem('token_discuss_book') ?? '',
				},
			},
		);

		if (response.status !== 200) return toast.error('Failed to get spaces discussion');

		const data = await response.json();
		const status = data?.statusCode || response.status || 500;


		if (status === 200) {
			dispatch({
				type: 'setSpacesDiscussions',
				payload: data,
			});

			setSpacesDiscussionForUser(
				data.filter((item: any) => item?.userId._id === dataUser?._id)
			);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	// Al deslogearse, vaceamos los espacios de discussion del usuario ubicados en el navbar
	useEffect(() => {
		if (!state.user?.id) {
			setSpacesDiscussionForUser([])
		}
	}, [state.user])

	return (
		<SidebarProvider
			open={open}
			style={
				{
					'--sidebar-width': '30rem',
				} as React.CSSProperties
			}
		>
			<Sidebar
				variant="floating"
				onMouseOver={() => setOpen(true)}
				onMouseLeave={() => setOpen(false)}
			>
				<SidebarHeader className="border-b-[1px] border-b-neutral-800">
					<SidebarMenu>
						{/* Item Menu */}
						{state?.user?.id && (
							<SidebarMenuItem>
								<SidebarMenuButton size="lg" asChild >
									<span className="font-testSohneKraftig text-[1.4rem]" style={{
										width: 'fit-content',
										background:
											'linear-gradient(90deg, #FFC593 0%, #BC7198 98%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										display: 'inline-block',
									}}>
										{state.user.email
											.split('@')[0]
											.toUpperCase()}
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)}

						{/* Item Menu */}
						<SidebarMenuItem onClick={createSpace}>
							<SidebarMenuButton size="lg" asChild>
								<div className="flex flex-row border-y-neutral-800 p-4 cursor-pointer hover:bg-[#162F50] bg-[#0c1d2c] ">
									<span>
										<Plus size={20} />
									</span>
									<span className="font-testSohneKraftig text-[1.2rem]">
										Create a new discussion space
									</span>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent className="scrollbar">
					<SidebarGroup className="group-data-[collapsible=icon]:hidden">
						{spacesDiscussionForUser.map((item) => (
							<Link
								href={`/space-discussion/${item?.bookId}`}
								onClick={() => handleOpenSpaceDiscussion(item)}
								key={`${crypto.randomUUID()}`}
								className="hover:bg-neutral-800 flex flex-col gap-4 whitespace-nowrap p-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground overflow-x-hidden font-testSohneKraftig border-b-[1px] border-b-neutral-800 last:border-b-[0px]" /* first:border-usat-none last:border-b-[0px] border-b-[1px] border-y-neutral-800 */
							>
								<div className="flex w-full items-center gap-4">
									<FileSpreadsheet size={20} />
									<span className="text-[1.2rem]">
										{item.name}
									</span>
								</div>
								<div className="flex w-full items-center gap-4">
									{item.access === 'PRIVATE' ? (
										<Lock size={20} />
									) : (
										<Globe size={20} />
									)}
									<span className="line-clamp-2 w-[230px] whitespace-break-spaces text-[1.2rem]">
										{item.access}
									</span>
								</div>
							</Link>
						))}
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					<SidebarGroup className="group-data-[collapsible=icon]:hidden pb-1">
						{state.user && (
							<div
								className="flex flex-row gap-4 whitespace-nowrap p-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground overflow-x-hidden font-testSohneKraftig border-t-[1px] border-t-neutral-800 hover:bg-neutral-800 last:border-b-[0px]"
							>
								<div
									style={{
										background:
											'linear-gradient(90deg, #FFC593 0%, #BC7198 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										display: 'inline-block',
									}}
								>
									<span className="font-testSohneKraftig text-[1.4rem]">
										{state.user?.premium ? 'PREMIUM' : 'FREE'}
									</span>
								</div>
							</div>
						)}

						{secondary.map((item) => (
							<a
								key={`${item.title} + ${item.url}`}
								onClick={() => handleOnClick(item)}
								className="cursor-pointer flex flex-row gap-4 whitespace-nowrap p-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground overflow-x-hidden font-testSohneKraftig border-t-[1px] border-t-neutral-800 hover:bg-neutral-800 last:border-b-[0px]" /* first:border-t-none last:border-b-[0px] border-b-[1px] border-y-neutral-800 */
							>
								<span>
									<item.icon size={20} />
								</span>
								<span className="font-testSohneKraftig text-[1.2rem]">
									{item.title}
								</span>
							</a>
						))}
					</SidebarGroup>
				</SidebarFooter>
			</Sidebar>
			<SubscriptionModal open={subscriptionModal} setsubscriptionModal={setsubscriptionModal} />
			<div
				onMouseOver={() => setOpen(true)}
				style={{
					width: '40px',
					height: '100vh',
					position: 'absolute',
				}}
			/>
			{children}
		</SidebarProvider>
	);
}
