import React, { useContext, useEffect } from 'react'
import { SignInRegisterScreenPages, SignUpRegisterContext } from '../../../../contexts/SignUpRegisterContext';
import { Icons } from '../../../atoms/Icons';
import UserModel from '../../../../models/data/user/UserModel';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../../../../contexts/GameContext';
import PopupModal from '../../../molecules/signin/popup-modal/PopupModal';


enum CodeWaiterStates {
    Ready,
    Loading,
}

enum LoginCodeResponseTypes
    {
        Success = 0,
        InvalidCode,
        ExpiredCode,
        CodeDoesNotMatch
    }

function CodeWaiter() {

    const _signupContext = useContext(SignUpRegisterContext);
    const _gameContext = useContext(GameContext);
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = React.useState<boolean>(false);
    const [popupMessage, setPopupMessage] = React.useState<string>('');

    const [code, setCode] = React.useState<string>('');
    const [codeArr, setCodeArr] = React.useState<string[]>([]); // ['1', '2', '3', '4'
    const hiddenTelRef = React.useRef<HTMLInputElement>(null);

    const [codeComplete, setCodeComplete] = React.useState<boolean>(false);
    const [codeWaiterState, setCodeWaiterState] = React.useState<CodeWaiterStates>(CodeWaiterStates.Ready);
    const [showLoginScreen, setShowLoginScreen] = React.useState<boolean>(false);


    const [loggingInError, setLoggingInError] = React.useState<string | null>(null);
    const [loggingInText, setLoggingInText] = React.useState<string>('Logging in');
    const [hideSpinner, setHideSpinner] = React.useState<boolean>(false);

    useEffect(() => {
      
        
    }, []);



    useEffect(() => {
        let len = code.length;
        let arr = [];
        for(let i = 0; i < 4; i++)
        {
            if(i < len)
            {
                arr.push(code[i]);
            }
        }
   
        setCodeArr(arr);
    }, [code]);

    function tryGetCode(num: number) {
        if(code[num])
        {
            return code[num];
        }
        return '';
    }
    function tryGetCodeClass(num: number) {
        if(code[num])
        {
            return 'code-waiter-button-filled';
        }
        return '';
    }

    const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.length <= 4) {
            setCode(e.target.value);
        }
        else {
            e.target.value = e.target.value.substring(0, 4);
        }
        
    }

    useEffect(() => {
        if(code.length === 4)
        {
            setShowLoginScreen(true);
            if(hiddenTelRef.current)
            {
                hiddenTelRef.current.blur();
            }
            Login();
        }
    }, [code]);

    const Login = async () => {
        if (codeWaiterState === CodeWaiterStates.Loading) return;
        setCodeWaiterState(CodeWaiterStates.Loading);
        let response = await LoginWithPhoneAndCode();
        if(response.success)
        {
            if(response.responseType == LoginCodeResponseTypes.Success)
            {
                if(response.user)
                {
                    let user : UserModel = {
                        ID: response.user.id,
                        UserKey: response.user.userKey,
                        Name: response.user.name,
                        Username: response.user.username,
                        Email: response.user.email,
                        Phone: response.user.phone,
                        CreatedDate: response.user.createdDate
                    }
                    _signupContext.updateSignedInUser(user);

                    console.log("USER FOUND", user);
                }
               
                console.log("USER NOT FOUND", response.user);
                loginSuccessFull();
            }
            else if(response.responseType == LoginCodeResponseTypes.InvalidCode)
            {
                setLoggingInError('Invalid code');
                console.log("invalid code");
                //alert(response.message);
            }
            else if(response.responseType == LoginCodeResponseTypes.CodeDoesNotMatch)
            {
                setLoggingInError('Invalid code');
                console.log("code not match");
                //alert(response.message);
            }
        }
        else
        {
            //alert(response.message);
        }
    }
    const LoginWithPhoneAndCode = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Auth/LoginWithCode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: _signupContext.rawPhoneNumber,
                    passCode: code
                })
            });
    
            const data = await response.json();
            console.log(data);
            return {
                success: data.success, 
                message: data.message,
                responseType: data.responseType,
                user: data.user
            };
        } catch (error) {
            console.error('Error:', error);
            return {success: false, message: 'An error occurred while validating phone number'};
        }
    }

    const tryAgainButtonEvent = () => {
        setLoggingInError(null);
        setCodeWaiterState(CodeWaiterStates.Ready);
        setCode('');
        if(hiddenTelRef.current)
            {
                hiddenTelRef.current.focus();
            }
    }

    const loginSuccessFull = () => {
        setHideSpinner(true);
        setLoggingInText("success!");
        setTimeout(() => {
            _signupContext.updateCurrentScreen(SignInRegisterScreenPages.WelcomeUser);
            if(_gameContext.companyData.customerID == "default")
            {
                
                //navigate(`/`);
            }
            else
            {
                //navigate(`/${_gameContext.companyData.customerID}/`);
            }
        }, 500);
    }

    const modelClosed = () => {
        setShowPopup(false);
    }

  return (
    <div className='code-waiter-wrap'>

{showPopup && <PopupModal onClose={modelClosed}>{popupMessage}</PopupModal> }
        {codeWaiterState == CodeWaiterStates.Loading && <div className='logging-in-wrap'>
            <div className='logging-in'>
            {(loggingInError == null && !hideSpinner) && <div className='loading-spinner'><Icons.Gallery_Spinner/></div> }
                <div className='text'>{loggingInError == null ? loggingInText : loggingInError}</div>
                {loggingInError != null && <div className='try-again-button' onClick={tryAgainButtonEvent}>Try again</div>}
            </div>
        </div>}
        
         <div className='code-waiter-buttons-wrap'>
            
                <div className='code-waiter-buttons'>
                    {Array.from(Array(4).keys()).map((i, index) => {

                        return (
                            <div key={index} onClick={() => hiddenTelRef.current?.focus()} className={`code-waiter-button ${tryGetCodeClass(i)}`}>{tryGetCode(i)}</div>
                        )
                    })}

                </div>
                
            </div>
            
          <div className='code-waiter-description'>
          <div className='hidden-tel'><input type='tel' autoFocus ref={hiddenTelRef} value={code} onChange={handleTelChange} /></div>

                <h1 className='heading'>We texted you</h1>
                <div className='desc'>check your messages, and enter the four digit code we sent you to login.</div>
          </div>

    </div>
  )
}

export default CodeWaiter