import React, {createContext, useContext} from 'react'
import UserModel from '../models/data/user/UserModel';
import { SignedInUserModel } from '../models/data/user/SignedInUserModel';
import { GameContext } from './GameContext';
import { AllUserRewards } from '../models/data/rewards/AllUserRewards';


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
    finishedLoadingUserFromLocalStorage: boolean;
    loadingRewards: boolean;
    allUserRewards?: AllUserRewards | null;
    getRewards: (userKey: string) => void;
    updateUserProfilePicture: (profilePicture: string) => void;

}

const SignUpRegisterContext = createContext<SignUpRegisterContextData>({} as SignUpRegisterContextData);
function SignUpRegisterContextProvider(props: any) {
    const _gameContext = useContext(GameContext);
    const [currentScreen, setCurrentScreen] = React.useState<SignInRegisterScreenPages>(SignInRegisterScreenPages.SwitchBoard);
    const [rawPhoneNumber, setRawPhoneNumber] = React.useState<string>('');
    const [formattedPhoneNumber, setFormattedPhoneNumber] = React.useState<string>('');
    const [finishedLoadingUserFromLocalStorage, setFinishedLoadingUserFromLocalStorage] = React.useState<boolean>(false);

    const [signedInUser, setSignedInUser] = React.useState<SignedInUserModel | null>(null);
    const [signedInType, setSignedInType] = React.useState<SignedInTypes>(SignedInTypes.Normal);

    const [loadingRewards, setLoadingRewards] = React.useState<boolean>(true);
    const [allUserRewards, setAllUserRewards] = React.useState<AllUserRewards | null>(null);

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
            console.log(userObj);
            setSignedInUser((old) => userObj);

            if(userObj.user.UserKey != null)
            {
                getRewards(userObj.user.UserKey);
            }
            
        }
        setFinishedLoadingUserFromLocalStorage((old) => true);
    }
    const getRewards = (userKey: string) => {

        setAllUserRewards((old) => null);
        setLoadingRewards((old) => true);

        let postParams = {
            "userKey": userKey
        }
        let response = fetch(`${process.env.REACT_APP_API_URL
        }/Rewards/GetUserRewards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postParams)
        }).then((response) => {
            return response.json();
        })
        .then((data: AllUserRewards) => {
            setAllUserRewards((old) => data);
        })
        .catch((error) => {
            console.log(error);
        }).finally(() => {
            setLoadingRewards(false);
        });
    }

    const updateUserProfilePicture = (profilePicture: string) => {
        let oldUser = signedInUser;
        if(oldUser)
        {
            oldUser.user.ProfileImage = profilePicture;
            updateSignedInUser(oldUser);
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
        logout,
        finishedLoadingUserFromLocalStorage,
        loadingRewards,
        allUserRewards,
        getRewards,
        updateUserProfilePicture
    }
    return <SignUpRegisterContext.Provider value={value}>
        {props.children}
    </SignUpRegisterContext.Provider>
}

export {SignUpRegisterContext, SignUpRegisterContextProvider}