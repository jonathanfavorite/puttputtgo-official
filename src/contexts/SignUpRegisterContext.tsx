import React, {createContext} from 'react'
import UserModel from '../models/data/user/UserModel';
import { SignedInUserModel } from '../models/data/user/SignedInUserModel';


export enum SignInRegisterScreenPages {
    SwitchBoard,
    SignIn,
    Register,
    CodeWaiter,
    WelcomeUser
}

export enum SignedInTypes {
    NewUser,
    Normal
}

interface SignUpRegisterContextData {
    currentScreen: SignInRegisterScreenPages;
    updateCurrentScreen: (currentlySelected: SignInRegisterScreenPages) => void;
    rawPhoneNumber?: string;
    formattedPhoneNumber?: string;
    updateRawPhoneNumber: (raw: string) => void;
    updateFormattedPhoneNumber: (formatted: string) => void;
    updateSignedInUser: (signedInUser: SignedInUserModel) => void;
    signedInUser?: SignedInUserModel | null;
    loadSignedInUser: () => void;
    signedInType: SignedInTypes;
    updateSignedInType: (signedInType: SignedInTypes) => void;
    logout: () => void;
}

const SignUpRegisterContext = createContext<SignUpRegisterContextData>({} as SignUpRegisterContextData);
function SignUpRegisterContextProvider(props: any) {

    const [currentScreen, setCurrentScreen] = React.useState<SignInRegisterScreenPages>(SignInRegisterScreenPages.SwitchBoard);
    const [rawPhoneNumber, setRawPhoneNumber] = React.useState<string>('');
    const [formattedPhoneNumber, setFormattedPhoneNumber] = React.useState<string>('');

    const [signedInUser, setSignedInUser] = React.useState<SignedInUserModel | null>(null);
    const [signedInType, setSignedInType] = React.useState<SignedInTypes>(SignedInTypes.Normal);

    const updateSignedInUser = (signedInUser: SignedInUserModel) => {
        setSignedInUser((old) => signedInUser);
        localStorage.setItem('ppg-user', JSON.stringify(signedInUser));
    }

    const logout = () => {
        setSignedInUser((old) => null);
        localStorage.removeItem('ppg-user');
    }

    const updateSignedInType = (signedInType: SignedInTypes) => {
        setSignedInType((old) => signedInType);
    }
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
    const loadSignedInUser = () => {
        let user = localStorage.getItem('ppg-user');
        if(user)
        {
            let userObj = JSON.parse(user);
            setSignedInUser((old) => userObj);
        }
    }
    let value : SignUpRegisterContextData = {
        currentScreen,
        updateCurrentScreen,
        rawPhoneNumber,
        formattedPhoneNumber,
        updateRawPhoneNumber,
        updateFormattedPhoneNumber,
        updateSignedInUser,
        signedInUser,
        loadSignedInUser,
        signedInType,
        updateSignedInType,
        logout
    }
    return <SignUpRegisterContext.Provider value={value}>
        {props.children}
    </SignUpRegisterContext.Provider>
}

export {SignUpRegisterContext, SignUpRegisterContextProvider}