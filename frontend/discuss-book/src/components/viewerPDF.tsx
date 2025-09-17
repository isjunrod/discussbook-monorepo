'use client';

import {
	PdfViewerComponent,
	Toolbar,
	TextSelection,
	Annotation,
	TextSearch,
	Inject,
} from '@syncfusion/ej2-react-pdfviewer';
import { registerLicense } from '@syncfusion/ej2-base';

import '../../node_modules/@syncfusion/ej2-base/styles/material.css';
import '../../node_modules/@syncfusion/ej2-buttons/styles/material.css';
import '../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
import '../../node_modules/@syncfusion/ej2-inputs/styles/material.css';
import '../../node_modules/@syncfusion/ej2-navigations/styles/material.css';
import '../../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
import '../../node_modules/@syncfusion/ej2-pdfviewer/styles/material.css';
import { LegacyRef, useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../state/context';
import { convertToAnnotationPoints } from '../helpers';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
// import { convertToAnnotationPoints } from '../../helpers';

registerLicense(
	'Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWX5fcXVSRGNdVUFwV0A=',
);

// Necesito saber que es lo que hace cada cosa de framwordk (NEXTJS) y adaptarlo como en el diagrama de procesos, ya que estoy cometiendo el error de borrar codigo repetitivo, osea que hace lo mismo...

const PDFViewer = ({ idSpaceDiscussion }: { idSpaceDiscussion: string }) => {
	const { state, dispatch } = useContext(ThemeContext);
	const viewer = useRef<PdfViewerComponent>(null);
	const router = useRouter();
	const [pdfLoaded, setPdfLoaded] = useState(false);
	const isFirstMount = useRef(true)
	const [Password, setPassword] = useState('')

	// Cuando se entra por ejemplo directamente a la URL del espacio de discusión, con el ID del espacio de discusión que esta en la URL
	// buscamos el espacio de discusión en el state, (que ya deberían estar cargados en spacesDiscussion) y lo cargamos en el state
	// para que se pueda usar en el componente.
	useEffect(() => {
		const spaceDiscussion = state?.spacesDiscussions?.find(
			(space: any) => space?.bookId === idSpaceDiscussion,
		);

		if (spaceDiscussion) {
			// Enviar el espacio de disscusion al state
			dispatch({ type: 'setSpaceDiscussion', payload: spaceDiscussion });
			console.log('Espacio de discusión encontrado y cargado en el state:', spaceDiscussion);

			// Enviar los comentarios del espacio de discusión actual al state
			if (spaceDiscussion.comments?.length > 0) {
				dispatch({ type: 'setComments', payload: spaceDiscussion.comments });
				console.log('Comentarios del espacio de discusión cargados en el state:')
			}
		} else {
			console.log('Espacio de discusión no existe en el state');
		}

	}, [idSpaceDiscussion, state.spacesDiscussions]);


	// Verificamos si el usuario está logueado, si no lo está, lo redirigimos a la página de login.
	useEffect(() => {
		if (!localStorage.getItem('token_discuss_book')) {
			router.push('/auth/login');
		}
	}, [router]);

	const annotationAdd = (event: any) => {

		if (state.textSelected === null) return;

		const newComment = {
			photo: 'https://avatars.githubusercontent.com/u/87834204?v=4', // aca voy a ver como hago para crear avatar aleatorios de diferentes colores ya se NO se logearan con Google en el MVP, como para agarrar su foto de perfil.
			name: state.user?.email.split('@')[0],
			comment: state.comment,
			date: new Date().getTime(),
			likes: 0,
			id: event.annotationId,
			textSelected: {
				...state.textSelected,
				textBounds: convertToAnnotationPoints(
					state.textSelected.textBounds,
				),
			},
			subcomments: [],
			...(state.idSubComment ? { idSubComment: state.idSubComment } : {}),
		};

		dispatch({
			type: state.idSubComment ? 'setSubcomment' : 'setComment',
			payload: newComment,
		});

		console.log('Nuevo comentario');

		// Reiniciamos algunose estados

		if (state.idSubComment) {
			dispatch({ type: 'setIdSubComment', payload: null });
		}

		if (state.comment) {
			dispatch({ type: 'setCommentForAnnotation', payload: null });
		}

		if (state.textSelected) {
			dispatch({ type: 'setTextSelected', payload: null });
		}

		console.log('Limpiando estados: idSubComment, comment, textSelected');
	};

	const updateSpaceDiscussionDB = async () => {

		try {
			const response = await fetch(`http://localhost:4000/spaces-discussion/${state?.spaceDiscussion?._id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('token_discuss_book') || ''
				},
				body: JSON.stringify({
					comments: state.comments
				})
			});

			const data = await response.json();

			if (!response.ok || response.status !== 200) {
				console.log(data.message ? data.message : 'Error updating the discussion space');
			}

			console.log('Espacio de discusión actualizado en la base de datos');
		} catch (error) {
			console.error('Error al guardar el comentario:', error);
		}
	}

	// Modifica el useEffect para ignorar la primera ejecución
	useEffect(() => {
		// Si es la primera vez que se monta, solo marca como ya montado
		if (isFirstMount.current) {
			isFirstMount.current = false;
		} else {
			// Si no es la primera vez, entonces actualiza el backend
			updateSpaceDiscussionDB();
		}
	}, [state.comments]);


	const annotationSelect = (event: any) => {
		if (event.textContent?.length > 0)
			dispatch({ type: 'setTextSelected', payload: event });
	};

	const documentLoaded = async () => {

		if (!state.instancePDF) return;

		state?.spaceDiscussion?.comments?.map((comment: any) => {
			if (comment.eliminated) return; // Saltar comentarios eliminados

			const estructureAnnotation = {
				pageNumber: comment.textSelected.pageIndex,
				bounds: comment.textSelected.textBounds,
				color: '#fffb00',
			};

			viewer.current?.annotation.addAnnotation(
				'Highlight',
				estructureAnnotation as any,
			);
		});
	};

	// Inicializar el visor
	useEffect(() => {
		if (viewer.current) {
			dispatch({ type: 'setInstancePDF', payload: viewer.current });
		}
	}, [viewer.current]);

	const loadPdf = async () => {
		try {
			dispatch({
				type: 'setLoading',
				payload: {
					is: true,
					message: 'Cargando PDF...'
				}
			});

			// Verificar que el visor esté completamente inicializado
			if (!viewer.current || !viewer.current.element) {
				toast("Visor no inicializado completamente, reintentando...");
				setTimeout(() => loadPdf(), 500);
				return;
			}

			// Obtener el token
			const token = localStorage.getItem('token_discuss_book') || '';

			// Traer el PDF en binario del servidor.
			const response = await fetch(
				`http://localhost:4000/spaces-discussion/pdf/${idSpaceDiscussion}`,
				{
					headers: {
						Authorization: token,
						// Añadir un encabezado para evitar el cacheo del navegador
						// 'Cache-Control': 'no-cache, no-store, must-revalidate',
						// 'Pragma': 'no-cache',
						// 'Expires': '0'
					}
				}
			);

			if (response.status !== 200) {
				dispatch({
					type: 'setLoading',
					payload: {
						is: false,
						message: ''
					}
				});
				return toast.error('No se pudo cargar el PDF. Por favor, intente nuevamente.');
			}

			// Obtener los datos binarios del PDF
			const arrayBuffer = await response.arrayBuffer();
			const pdfBytes = new Uint8Array(arrayBuffer);

			// Verificar que el visor esté inicializado antes de cargar el PDF
			// Verificación más segura antes de cargar
			if (viewer.current && viewer.current.element && document.body.contains(viewer.current.element)) {
				viewer.current.load(pdfBytes, '');
				setPdfLoaded(true);
				toast.success('PDF cargado correctamente');
			} else {
				throw new Error('El visor PDF no está correctamente montado en el DOM');
			}

			dispatch({
				type: 'setLoading',
				payload: {
					is: false,
					message: ''
				}
			});

		} catch (error) {
			dispatch({
				type: 'setLoading',
				payload: {
					is: false,
					message: ''
				}
			});
			console.error('Error al cargar el PDF:', error);
			toast.error('Error al cargar el PDF. Intente recargar la página.');
		}
	};

	// Modifica el useEffect para usar la URL del proxy
	useEffect(() => {
		const instance = state.instancePDF;

		if (instance && idSpaceDiscussion && !pdfLoaded) {
			loadPdf();
		}
	}, [idSpaceDiscussion, viewer.current, pdfLoaded, state.instancePDF]);

	// Añade este useEffect después del último useEffect existente y antes del return
	useEffect(() => {
		// Esta ref nos ayudará a saber si el componente sigue montado
		const isMounted = { current: true };

		// Cleanup function que se ejecutará cuando el componente se desmonte
		return () => {
			isMounted.current = false;
			try {
				// Cancelar cualquier búsqueda de texto en curso
				if (viewer.current && viewer.current.textSearchModule) {
					viewer.current.textSearchModule.cancelTextSearch();
				}

				toast("PDF viewer cleanup completed successfully");
			} catch (error) {
				toast("Error durante la limpieza del visor PDF");
			}
		};
	}, []); // Array de dependencias vacío para que solo se ejecute al montar/desmontar


	return (
		<>
			<PdfViewerComponent
				enableToolbar={false}
				textSelectionEnd={annotationSelect}
				enableNavigationToolbar={false}
				enableAnnotationToolbar={false}
				enableCommentPanel={false}
				annotationAdd={annotationAdd}
				id="container"
				// documentUnload={() => console.log('PDF descargado')}
				// documentLoadFailed={loadPdf}
				ref={viewer as LegacyRef<PdfViewerComponent>}
				documentLoad={documentLoaded}
				resourceUrl="https://cdn.syncfusion.com/ej2/26.2.11/dist/ej2-pdfviewer-lib"
				style={{ height: '100%', width: '100%', borderRadius: '30px' }}
			>
				<Inject
					services={[Toolbar, Annotation, TextSelection, TextSearch]}
				/>
			</PdfViewerComponent>
		</>
	);
};

export default PDFViewer;
