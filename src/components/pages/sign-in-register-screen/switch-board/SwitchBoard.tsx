import React, { useContext, useEffect } from 'react'
import { SignInRegisterScreenPages, SignUpRegisterContext } from '../../../../contexts/SignUpRegisterContext';
import { GameAudioContext } from '../../../../contexts/GameAudioContext';

function SwitchBoard() {

    const _audioContext = useContext(GameAudioContext);
    const _signupContext = useContext(SignUpRegisterContext);
    const handleSigninClick = () => {
        _audioContext.play("game-over-audio");
        _signupContext.updateCurrentScreen(SignInRegisterScreenPages.SignIn);
       }
    const handleRegisterClick = () => {
        _signupContext.updateCurrentScreen(SignInRegisterScreenPages.Register);
         }  

         useEffect(() => {
  
         }, []);

        const test = () => {
            if (navigator.share) {
                // Create the file you want to share
                fetch('https://ppgstorageaccount.blob.core.windows.net/snaps/edc2754b-21ad-4ce4-9532-bde896f3cfeb.jpg')
                  .then(response => response.blob())
                  .then(blob => {
                    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                    navigator.share({
                      files: [file],
                      title: 'Check this out!',
                      text: 'Hello, check out this cool image I found.'
                    })
                    .then(() => console.log('Successful share'))
                    .catch((error) => console.log('Error sharing', error));
                  });
              } else {
                console.log('Share not supported on this browser, do it the old way.');
              }
        }

  return (<>
    <div className='details'>
            <h1>Track your games and collect go-points points!</h1>
            <p>Whether you're a casual player or a puttputt enthusiast, our platform is designed to enhance your gaming journey. Sign up today and elevate your puttputt adventure!</p>
            <div onClick={test}>test</div>
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