import React, {createContext} from 'react';
import UserModel from '../models/data/user/UserModel';

interface SignedInContextData {
    
}

const SignedInContext = createContext<SignedInContextData>({} as SignedInContextData);

const SignedInContextProvider = (props: any) => {

    const [signedIn, setSignedIn] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<UserModel | null>(null);

    const updateSignedIn = (signedIn: boolean) => {
        setSignedIn(signedIn);
    }

    const updateUser = (user: UserModel | null) => {
        setUser(user);
    }


    const data : SignedInContextData = {

    }

    return <SignedInContext.Provider value={data}>
        {props.children}
    </SignedInContext.Provider>
}

export {SignedInContext, SignedInContextProvider}