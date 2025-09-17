'use client';

import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../state/context';
import { SendHorizontal } from 'lucide-react';
import { convertToAnnotationPoints } from '@/src/helpers';

function InputComments() {
    const { state, dispatch } = useContext(ThemeContext);

    const sendCommentToState = (comment: string) => {
        if (comment.length === 0) return;
        dispatch({ type: 'setCommentForAnnotation', payload: comment });
    };

    const handlePushComment = () => {

        if (state.comment?.length === 0) return;

        const result = convertToAnnotationPoints(state.textSelected.textBounds);

        const annotation = {
            pageNumber: state.textSelected.pageIndex,
            bounds: result,
            color: '#fffb00',
        };

        state.instancePDF.annotationModule.addAnnotation(
            'Highlight',
            annotation,
        );
    };

    return (
        state.textSelected && (
            <div
                id="container-comment"
                className="fixed bottom-0 w-[54rem] h-[12rem] flex flex-row justify-center z-50"
            >
                <div
                    id="container-comment-write"
                    className="border-[1px] border-[#525252] bg-neutral-900 rounded-[1rem] w-[96%] h-[5rem] px-[1.5rem] py-[1rem]"
                >
                    <div className="w-full h-full flex flex-row gap-[1rem] items-center">
                        <input
                            type="text"
                            name="comment-write"
                            id="comment-write"
                            className=" appearance-none border-none bg-transparent text-white outline-none font-testSohneKraftig text-[1.4rem] w-full"
                            onChange={(e) => sendCommentToState(e.target.value)}
                        />
                        <SendHorizontal
                            cursor={'pointer'}
                            onClick={handlePushComment}
                        />
                    </div>
                </div>
            </div>
        )
    );
}

export default InputComments;
