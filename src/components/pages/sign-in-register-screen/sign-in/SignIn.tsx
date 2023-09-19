import React, { useEffect, useContext } from 'react'
import { Icons } from '../../../atoms/Icons'
import { SignUpRegisterContext, SignInRegisterScreenPages } from '../../../../contexts/SignUpRegisterContext';
import PhoneEntry from '../../../molecules/signin/phone-entry/PhoneEntry';
import PopupModal from '../../../molecules/signin/popup-modal/PopupModal';


enum SigninStates {
    Ready,
    Loading
}
enum SigninWithPhoneResponseTypes {
    Success = 0,
    InvalidPhoneNumber,
    AccountNotFound,
    InvalidCode,
    InvalidRequest,
    UnknownError
}

/*
public enum RequestNewCodeResponseTypes
    {
        Success = 0,
        InvalidPhoneNumber,
        AccountNotFound,
        InvalidCode,
        InvalidRequest,
        UnknownError
    }
*/
const SignIn = () => {

    const _signupContext = useContext(SignUpRegisterContext);
    const [signinState, setSigninState] = React.useState<SigninStates>(SigninStates.Ready);
    const [showPopup, setShowPopup] = React.useState<boolean>(false);
    const [popupMessage, setPopupMessage] = React.useState<string>('');

    const handleSignInClick = async () => {
        if(!_signupContext.rawPhoneNumber || _signupContext.rawPhoneNumber.length < 10){
            setPopupMessage('Please enter a valid phone number');
                setShowPopup(true);
            return;
        }
        if (signinState === SigninStates.Loading) return;
        setSigninState(SigninStates.Loading);

        let response = await LoginWithPhoneAndRequestCode();
        if(response.success)
        {
            if(response.responseType == SigninWithPhoneResponseTypes.Success)
            {
                _signupContext.updateCurrentScreen(SignInRegisterScreenPages.CodeWaiter);
                console.log("account found");
            }
            else if(response.responseType == SigninWithPhoneResponseTypes.AccountNotFound)
            {
                console.log("account not found");
                setPopupMessage('Account not found');
                setShowPopup(true);
                //alert(response.message);
            }
        }
        else
        {
            setPopupMessage('Account not found');
                setShowPopup(true);

        }
        setSigninState(SigninStates.Ready);
    }

    const LoginWithPhoneAndRequestCode = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Auth/NewCodeByPhone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: _signupContext.rawPhoneNumber
                })
            });
    
            const data = await response.json();
            console.log(data);
            return {
                success: data.success, 
                message: data.message,
                responseType: data.responseType
            };
        } catch (error) {
            console.error('Error:', error);
            return {success: false, message: 'An error occurred while validating phone number'};
        }
    }

    // const validatePhone = async () => {
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_API_URL}/Auth/LookupAccountByPhone`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 phoneNumber: _signupContext.rawPhoneNumber
    //             })
    //         });
    
    //         const data = await response.json();
    //         return {success: data.success, message: data.message};
    //     } catch (error) {
    //         console.error('Error:', error);
    //         return {success: false, message: 'An error occurred while validating phone number'};
    //     }
    // }

    const modelClosed = () => {
        setShowPopup(false);
    }
  return (
    <div className='sign-in-wrap'>
        {showPopup && <PopupModal onClose={modelClosed}>{popupMessage}</PopupModal> }
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