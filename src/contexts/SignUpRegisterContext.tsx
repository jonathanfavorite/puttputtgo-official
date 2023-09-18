import React, {createContext} from 'react'


export enum SignInRegisterScreenPages {
    SwitchBoard,
    SignIn,
    Register,
    CodeWaiter
}

interface SignUpRegisterContextData {
    currentScreen: SignInRegisterScreenPages;
    updateCurrentScreen: (currentlySelected: SignInRegisterScreenPages) => void;
}

const SignUpRegisterContext = createContext<SignUpRegisterContextData>({} as SignUpRegisterContextData);
function SignUpRegisterContextProvider(props: any) {

    const [currentScreen, setCurrentScreen] = React.useState<SignInRegisterScreenPages>(SignInRegisterScreenPages.SwitchBoard);

    const updateCurrentScreen = (currentlySelected: SignInRegisterScreenPages) =>
    {
        setCurrentScreen(currentlySelected);
    }
    let value : SignUpRegisterContextData = {
        currentScreen,
        updateCurrentScreen
        
    }
    return <SignUpRegisterContext.Provider value={value}>
        {props.children}
    </SignUpRegisterContext.Provider>
}

export {SignUpRegisterContext, SignUpRegisterContextProvider}