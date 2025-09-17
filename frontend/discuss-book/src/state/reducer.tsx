function handlePushSubComment(comments: any, payload: any, isSubcomment = false) {
	return (isSubcomment ? comments.subcomments : comments).map((comment: any) => {
		// si el id del comentario seleccionado para subcomentar es igual al id del comentario actual,
		// se aniade el nuevo comentario al array de subcomentarios pero se le agrega la propiedad last en false a los demas subcomentarios y last en true al nuevo subcomentario

		if (comment.id === payload.idSubComment) {
			const updatedSubcomments = comment.subcomments.map((subcomment: any) => ({
				...subcomment,
				last: false,
			}));

			return {
				...comment,
				subcomments: [...updatedSubcomments, { ...payload, last: true }],
			};
		}

		return {
			...comment,
			subcomments: handlePushSubComment(comment, payload, true),
		};
	});
}

// state, al principio es el state completo, pero a medida que se va llamando recursivamente, se va convirtiendo en el subcomentario actual
// Esto es para eliminar el comentario en la UI
function handleDeleteComment(comments: any, id: any, state: any) {
	return comments.map((comment: any) => {
		// Si el comentario no coincide y tiene subcomentarios, los procesamos

		if (comment.id === id) {
			return {
				...comment,
				eliminated: true,
			};
		} else {
			return {
				...comment,
				subcomments: handleDeleteComment(comment.subcomments, id, state),
			};
		}
	});
}

function handleHiddenComment(comments: any, id: any) {
	return comments.map((comment: any) => {
		// Si el comentario no coincide y tiene subcomentarios, los procesamos

		if (comment.id === id) {
			// Opcional: lógica adicional antes de eliminar (como limpiar en PDF)
			return {
				...comment,
				hidden: !comment?.hidden,
			};
		} else {
			return {
				...comment,
				subcomments: handleHiddenComment(comment.subcomments, id),
			};
		}
	});
}

export const initialState = {
	annotation: null,
	comment: null,
	textSelected: null,
	comments: [],
	jumpToAnnotation: null,
	idSubComment: null,
	instancePDF: null,
	user: null,
	// Aqui se guardara el espacio de discusion actual
	spaceDiscussion: null,
	// Aqui se guardaran todos los espacios de discusion de todos los usuarios para el buscador
	spacesDiscussions: [],
	loading: {
		is: false,
		message: '',
	},
};

export function reducer(state: any, action: any) {
	switch (action.type) {
		case 'setAnnotation':
			return {
				...state,
				annotation: action.payload,
			};

		case 'setComments':
			return {
				...state,
				comments: action.payload,
			};
		case 'setComment':
			return {
				...state,
				comments: [...state.comments, action.payload],
			};
		case 'deleteComment':
			return {
				...state,
				comments: handleDeleteComment(state.comments, action.payload, state),
				// idCommentDeleted: action.payload,
			};
		case 'jumpToAnnotation':
			return {
				...state,
				jumpToAnnotation: action.payload,
			};
		case 'setIdSubComment':
			return {
				...state,
				idSubComment: action.payload,
			};
		case 'setSubcomment':
			return {
				...state,
				comments: handlePushSubComment(state.comments, action.payload),
			};
		case 'setInstancePDF':
			return {
				...state,
				instancePDF: action.payload,
			};
		case 'setHiddenComment':
			return {
				...state,
				comments: handleHiddenComment(state.comments, action.payload),
			};
		case 'setTextSelected':
			return {
				...state,
				textSelected: action.payload,
			};
		case 'setCommentForAnnotation':
			return {
				...state,
				comment: action.payload,
			};
		case 'setUser':
			return {
				...state,
				user: action.payload,
			};
		case 'setSpaceDiscussion':
			return {
				...state,
				spaceDiscussion: action.payload,
			};
		case 'setLoading':
			return {
				...state,
				loading: {
					is: action.payload.is,
					message: action.payload.message,
				},
			};
		case 'setSpacesDiscussions':
			return {
				...state,
				spacesDiscussions: action.payload,
			};
		default:
			return state;
	}
}
