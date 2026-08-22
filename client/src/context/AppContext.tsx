import { createContext, useContext } from "react";
import type { Action } from "../reducer";
import type { AppState } from "../types/stateTypes"

export type AppContextType = {
    appState: AppState;
    dispatch: React.ActionDispatch<[action: Action]>;
}
export const AppContext = createContext<AppContextType | undefined>(undefined);
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an appContext provider')
    }
    return context;
}