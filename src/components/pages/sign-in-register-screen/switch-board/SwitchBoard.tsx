import React, { useContext } from 'react'
import { SignInRegisterScreenPages, SignUpRegisterContext } from '../../../../contexts/SignUpRegisterContext';

function SwitchBoard() {

    const _signupContext = useContext(SignUpRegisterContext);
    const handleSigninClick = () => {
        _signupContext.updateCurrentScreen(SignInRegisterScreenPages.SignIn);
       }
    const handleRegisterClick = () => {
        _signupContext.updateCurrentScreen(SignInRegisterScreenPages.Register);
         }  


  return (<>
    <div className='details'>
            <h1>Track your games and collect go-points points!</h1>
            <p>Whether you're a casual player or a puttputt enthusiast, our platform is designed to enhance your gaming journey. Sign up today and elevate your puttputt adventure!</p>
        </div>
        <div className='buttons'>
            <div className='buttons_wrap'>
                <span onClick={handleSigninClick}>Sign In</span>
            </div>
            <div className='buttons_wrap'>
                <span onClick={handleRegisterClick}>Register</span>
            </div>
        </div></>
  )
}

export default SwitchBoard