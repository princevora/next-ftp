import { useState, createContext, useContext } from "react";

export const ErrorContext = createContext();

const ErrorContextProvider = ({children}) => {

    const [state, setState] = useState(false);

    return (
        <ErrorContext.Provider value={{state, setState}}>
            {children}
        </ErrorContext.Provider>
    )
}

export default ErrorContextProvider;