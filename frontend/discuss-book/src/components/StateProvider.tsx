'use client'

import { useReducer } from "react";
import { ThemeContext } from "../state/context"
import { initialState, reducer } from "../state/reducer";

function StateProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ThemeContext.Provider value={{ state, dispatch }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default StateProvider