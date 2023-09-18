import React, { useEffect, useContext } from 'react'
import { Icons } from '../../../atoms/Icons'
import { SignUpRegisterContext, SignInRegisterScreenPages } from '../../../../contexts/SignUpRegisterContext';


enum SigninStates {
    Ready,
    Loading
}
enum APIReponseStates {
    
}

function SignIn() {

    const _signupContext = useContext(SignUpRegisterContext);

    const telRef = React.useRef<HTMLInputElement>(null);
    const [rawPhoneNumber, setRawPhoneNumber] = React.useState<string>('');
    const [formattedPhoneNumber, setFormattedPhoneNumber] = React.useState<string>('');
    const [signinState, setSigninState] = React.useState<SigninStates>(SigninStates.Ready);

    const handleRawPhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        let formatted = formatPhoneNumber(value);
        setRawPhoneNumber(value);
        setFormattedPhoneNumber(formatted);
    }

    function formatPhoneNumber(raw: string) {
        if (raw.length > 10) {
            raw = raw.substring(0, 10); // Limit to 10 digits
        }

        let formatted = '';
        for (let i = 0; i < raw.length; i++) {
            if (i === 0) formatted += '(';
            else if (i === 3) formatted += ') ';
            else if (i === 6) formatted += '-';
            formatted += raw[i];
        }
        return formatted;
    }

    useEffect(() => {

        if (telRef && telRef.current) {
            setTimeout(() => {
                //telRef.current!.focus();
            }, 500);
            
        }
    }, []);

    const handleSignInClick = () => {
        if(!rawPhoneNumber || rawPhoneNumber.length < 10){
            alert('Please enter a valid phone number');
            return;
        }
        if (signinState === SigninStates.Loading) return;
        setSigninState(SigninStates.Loading);
        telRef.current!.blur();
        setTimeout(() => {
            setSigninState(SigninStates.Ready);
            _signupContext.updateCurrentScreen(SignInRegisterScreenPages.CodeWaiter);
        }, 2000);
    }

  return (
    <div className='sign-in-wrap'>
        <div className='top-content'>
        <h1>Sign in with phone</h1>
        <div className='enter-number-wrap'>
            <div className='country-picker-wrap'>

                <div className='country-indi selected-country'>
                    <div className='selected__country'>
                        <div className='country-flag'><img src='/global-assets/flags/en.jpg' /></div>
                        
                    </div>
                    <div className='selected__name'>United States (+1)</div>
                    <div className='selected__arrow'><Icons.Back /></div>
                </div>

            </div>

            <div className='number-input-wrap'>
                <div className='number-input'>
                <input 
                type='tel' 
                ref={telRef}
                onChange={handleRawPhoneNumberChange} 
                value={formattedPhoneNumber} 
                placeholder='Enter your phone number' 
            />
                </div>
            </div>
            </div>
            
            <div className='signin-errors'>
                <div className='signin-error cant-find-account'>this phone number not associated with an account, would you like to <span>create one</span> instead?</div>
            </div>

            {/* <div className='checkboxes-wrap'>
                <div className='checkbox'>
                    <label>
                    <div className='checkbox__input'>
                        <input type='checkbox' />
                    </div>
                    <div className='checkbox__label'>I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span></div>
                    </label>
                </div>
            </div> */}

        </div>

        <div className='sign-in-button-wrap'>
                <div className='sign-in-button' onClick={handleSignInClick}>
                    {signinState === SigninStates.Ready ? 'Sign In' : <>
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