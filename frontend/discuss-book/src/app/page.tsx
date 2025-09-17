'use client';

import DropZone from '@/src/components/dropzone';
import { Button } from '@/src/components/button';
import { Newsreader } from 'next/font/google';
import SVG from '@/src/components/svg';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../state/context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '../components/input';

// If loading a variable font, you don't need to specify the font weight
const newsreader = Newsreader({
	weight: ['400', '700'],
	style: 'italic',
});

export default function Home() {
	const { state, dispatch } = useContext(ThemeContext);
	const [discussionSpaceValues, setdiscussionSpaceValues] = useState<Record<string, any>>({
		files: [],
		isPrivate: false,
		password: '',
	})

	const router = useRouter();

	const createSpace = async () => {

		// Si el usuario no está logueado, se redirige a la página de login
		if (!state.user?.id) {
			toast.error('Please log in to create a discussion space');
			return router.push('/auth/login');
		}

		// Decirle que tiene que poner una contrasenia en caso sea espacio de discusión privado
		if (discussionSpaceValues.isPrivate && !discussionSpaceValues.password) {
			toast.error('Please enter a password for the discussion space');
			return;
		}

		if (!discussionSpaceValues?.files.length) {
			toast.error('Please select a file first');
			return;
		}

		// Activar el loader con un mensaje
		dispatch({
			type: 'setLoading',
			payload: {
				is: true,
				message: 'Creating space for discussion'
			}
		});

		console.log('Enviando setLoading con is: true para indicar que se esta creando el espacio de discusión');

		// Crear un objeto FormData para enviar el archivo
		const formData = new FormData();
		formData.append('file', discussionSpaceValues?.files[0]);

		const metadata = {
			userId: state.user.id,
			bookId: crypto.randomUUID(),
			access: discussionSpaceValues.isPrivate ? 'PRIVATE' : 'PUBLIC',
			password: discussionSpaceValues.isPrivate ? discussionSpaceValues.password : '',
		};

		formData.append('metadata', JSON.stringify(metadata));

		try {
			const token = localStorage.getItem('token_discuss_book');

			if (!token) {
				throw new Error('Authentication token not found');
			}

			// Crear un espacio de discusión
			const response = await fetch('http://localhost:4000/spaces-discussion', {
				method: 'POST',
				headers: {
					Authorization: token,
				},
				body: formData
			});

			const data = await response.json();

			if (response.status === 401) {
				toast.error('Session expired. Please log in again');
				router.push('/auth/login');
				return;
			}

			if (!response.ok) {
				throw new Error(data.message || 'Error creating discussion space');
			}

			// Navegar al espacio de discusión creado
			toast.success('Discussion space created successfully!');
			router.push(`/space-discussion/${data?.bookId}`);
		} catch (error) {
			console.error('Error creating space:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to create discussion space');
			dispatch({
				type: 'setLoading',
				payload: {
					is: false,
					message: ''
				}
			});

			console.log('Enviando setLoading con is: false para indicar que se termino el proceso de creación del espacio de discusión pero con error');
		}
	};

	return (
		<main className="flex flex-row items-center mb-[10rem]">
			<div className="flex flex-col basis-1/4 w-4 h-4" />
			<div className="flex flex-col justify-center basis-2/4 gap-[2rem]">
				<div className="text-center">
					<h2 className="text-center font-testSohneBuch text-[4rem]">
						Create a
						<span className={`${newsreader.className} text-[4rem]`}>
							{' '}
							Discussion Space
						</span>
					</h2>
					<h3 className="font-TestSohneLeicht text-[2rem] relative top-[-1.5rem]">
						Discuss with other people whatever you like.
					</h3>
				</div>

				<div className="flex flex-row justify-center gap-10">
					<Button
						variant="outline"
						size="default"
						className={`text-[1.4rem] cursor-pointer ${discussionSpaceValues.isPrivate ? 'bg-[#404040]' : 'bg-transparent'}`}
						onClick={() => setdiscussionSpaceValues({ ...discussionSpaceValues, isPrivate: true })}
					>
						Private
					</Button>
					<Button
						onClick={() => setdiscussionSpaceValues({ ...discussionSpaceValues, isPrivate: false })}
						variant="outline"
						size="default"
						style={{
							fontSize: '1.4rem',
							cursor: 'pointer',
							backgroundColor: `${discussionSpaceValues.isPrivate === false ? '#404040' : 'transparent'
								}`,
						}}
					>
						Public
					</Button>
				</div>

				{
					discussionSpaceValues.isPrivate &&
					<div className=' w-[20rem] flex flex-row justify-center items-center rounded-[1rem] mx-auto'>
						<Input
							onChange={(e) => setdiscussionSpaceValues({ ...discussionSpaceValues, password: e.target.value })}
							value={discussionSpaceValues?.password || ''}
							type="password"
							placeholder="Discussion Space Password"
							className='border border-[#404040] bg-transparent text-white rounded-[0.5rem] px-4 py-2 focus:outline-none focus:ring-0 focus:border-[#404040] focus-visible:ring-0'
						/>
					</div>
				}
				<div className="flex flex-row justify-center">
					<DropZone
						files={discussionSpaceValues?.files || []}
						setFiles={(e: any) => {
							setdiscussionSpaceValues({ ...discussionSpaceValues, files: e });
						}}
						onError={(message: any) => toast.error(message)}
					/>
				</div>
			</div>
			<div
				onClick={() => discussionSpaceValues.files?.length > 0 ? createSpace() : null}
				className={`w-[7rem] h-[10rem] right-[20rem] ${discussionSpaceValues.files?.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} basis-1/4 transition-opacity duration-200`}
				aria-disabled={discussionSpaceValues.files?.length === 0}
				role="button"
				tabIndex={discussionSpaceValues.files?.length > 0 ? 0 : -1}
			>
				<SVG
					type="rowRight"
					color={discussionSpaceValues.files?.length > 0 ? 'var(--neutral100)' : 'var(--neutral700)'}
				/>
			</div>
		</main>
	);
}
