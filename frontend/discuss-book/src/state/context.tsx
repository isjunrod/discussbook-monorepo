'use client'

import { createContext, Dispatch } from "react";

interface AnnotationContextType {
    // annotation: any;
    // setAnnotation: Dispatch<SetStateAction<any>>;
    state: any;
    dispatch: Dispatch<any>;
}

export const ThemeContext = createContext<AnnotationContextType>({
    // annotation: {},
    // setAnnotation: () => {},
    state: {},
    dispatch: () => {}
});
