import React, {createContext} from 'react'


export enum SignInRegisterScreenPages {
    SwitchBoard,
    SignIn,
    Register,
    CodeWaiter,
    WelcomeUser
}

interface SignUpRegisterContextData {
    currentScreen: SignInRegisterScreenPages;
    updateCurrentScreen: (currentlySelected: SignInRegisterScreenPages) => void;
    rawPhoneNumber?: string;
    formattedPhoneNumber?: string;
    updateRawPhoneNumber: (raw: string) => void;
    updateFormattedPhoneNumber: (formatted: string) => void;
}

const SignUpRegisterContext = createContext<SignUpRegisterContextData>({} as SignUpRegisterContextData);
function SignUpRegisterContextProvider(props: any) {

    const [currentScreen, setCurrentScreen] = React.useState<SignInRegisterScreenPages>(SignInRegisterScreenPages.SwitchBoard);
    const [rawPhoneNumber, setRawPhoneNumber] = React.useState<string>('');
    const [formattedPhoneNumber, setFormattedPhoneNumber] = React.useState<string>('');

    const updateCurrentScreen = (currentlySelected: SignInRegisterScreenPages) =>
    {
        setCurrentScreen(currentlySelected);
    }
    const updateRawPhoneNumber = (raw: string) =>
    {
        setRawPhoneNumber(raw);
    }
    const updateFormattedPhoneNumber = (formatted: string) =>
    {
        setFormattedPhoneNumber(formatted);
    }
    let value : SignUpRegisterContextData = {
        currentScreen,
        updateCurrentScreen,
        rawPhoneNumber,
        formattedPhoneNumber,
        updateRawPhoneNumber,
        updateFormattedPhoneNumber
    }
    return <SignUpRegisterContext.Provider value={value}>
        {props.children}
    </SignUpRegisterContext.Provider>
}

export {SignUpRegisterContext, SignUpRegisterContextProvider}