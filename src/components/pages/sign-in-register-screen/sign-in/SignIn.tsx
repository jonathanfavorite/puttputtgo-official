import React, { useEffect, useContext } from 'react'
import { Icons } from '../../../atoms/Icons'
import { SignUpRegisterContext, SignInRegisterScreenPages } from '../../../../contexts/SignUpRegisterContext';
import PhoneEntry from '../../../molecules/signin/phone-entry/PhoneEntry';


enum SigninStates {
    Ready,
    Loading
}
enum APIReponseStates {
    
}

function SignIn() {

    const _signupContext = useContext(SignUpRegisterContext);
    const [signinState, setSigninState] = React.useState<SigninStates>(SigninStates.Ready);

    const handleSignInClick = () => {
        if(!_signupContext.rawPhoneNumber || _signupContext.rawPhoneNumber.length < 10){
            alert('Please enter a valid phone number');
            return;
        }
        if (signinState === SigninStates.Loading) return;
        setSigninState(SigninStates.Loading);
        setTimeout(() => {
            setSigninState(SigninStates.Ready);
            _signupContext.updateCurrentScreen(SignInRegisterScreenPages.CodeWaiter);
        }, 2000);
    }

  return (
    <div className='sign-in-wrap'>
        <div className='top-content'>
        <h1>Sign in with phone</h1>
        
        <PhoneEntry></PhoneEntry>
            
            
           
        </div>

        <div className='sign-in-button-wrap'>
                <div className='sign-in-button' onClick={handleSignInClick}>
                    {signinState == SigninStates.Ready ? 'Sign In' : <>
                        <div className='loading-spinner-wrap'>
                            <div className='loading-spinner'><Icons.Gallery_Spinner /></div>
                            <div className='loading-text'>loading...</div>
                        </div>
                    </>}
                </div>
            </div>

    </div>
  )
}

export default SignIn