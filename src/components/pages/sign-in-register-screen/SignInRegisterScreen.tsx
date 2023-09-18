import React, { useContext, useEffect } from 'react'
import './SignInRegisterScreen.scss';
import { GameContext } from '../../../contexts/GameContext';
import DataAssuranceHOC from '../../hocs/DataAssuranceHOC';
import { useNavigate, useParams } from 'react-router-dom';
import { Icons } from '../../atoms/Icons';
import SwitchBoard from './switch-board/SwitchBoard';
import { SignInRegisterScreenPages, SignUpRegisterContext } from '../../../contexts/SignUpRegisterContext';
import { Sign } from 'crypto';
import Register from './register/Register';
import SignIn from './sign-in/SignIn';
import CodeWaiter from './code-waiter/CodeWaiter';


interface PageSettings {
    title: string;
    headerHeightPercentage: string;
    headerBackgroundShow: boolean;
}

function SignInRegisterScreen() {
    const _gameContext = useContext(GameContext);
    const {business_name} = useParams();
    const _signupContext = useContext(SignUpRegisterContext);
    const navigate = useNavigate();

    const settings : PageSettings[] = [
        {
            title: "Switch Board",
            headerHeightPercentage: "60%",
            headerBackgroundShow: true
        },
             {
                title: "Sign In",
                headerHeightPercentage: "10%",
                headerBackgroundShow: true
            },
            {
                title: "Register",
                headerHeightPercentage: "20%",
                headerBackgroundShow: false
            },
            {
                title: "CodeWaiter",
                headerHeightPercentage: "auto",
                headerBackgroundShow: true
            }
            
       ];

   const [pageSettings, setPageSettings] = React.useState<PageSettings>(settings[0]);

   const updatePageSettings = (currentlySelected: SignInRegisterScreenPages) =>
   {
    switch(currentlySelected)
    {
        case SignInRegisterScreenPages.SwitchBoard:
            setPageSettings(settings[0]);
            break;
        case SignInRegisterScreenPages.SignIn:
            setPageSettings(settings[1]);
            break;
        case SignInRegisterScreenPages.Register:
            setPageSettings(settings[2]);
            break;
            case SignInRegisterScreenPages.CodeWaiter:
                setPageSettings(settings[3]);
                break;
    }
   }

   const handleBackButtonClick = () => {
    if(_signupContext.currentScreen == SignInRegisterScreenPages.SwitchBoard)
    {
        navigate(`/${business_name}`);
    }
    else
    {
        _signupContext.updateCurrentScreen(SignInRegisterScreenPages.SwitchBoard);
    }
   };

  
    useEffect(() => {
        updatePageSettings(_signupContext.currentScreen);
    }, [_signupContext.currentScreen]);
    
  return (

    <DataAssuranceHOC companyParam={
        business_name !
    }>
      
    <div className='sign-in-register-screen-wrap'>
        <div className='header' style={{
            height: pageSettings.headerHeightPercentage,
           backgroundImage: pageSettings.headerBackgroundShow ? `url(${
               _gameContext.getAssetByID("signin-background")?.assetLocation
           })` : ''
        }}>
        <div className='_top-bar'>
            <div className='_left' onClick={handleBackButtonClick}>
                <div className='back'><Icons.Back /></div>
            </div>
            <div className='_middle'>
                <div className='logo'>
                    <Icons.PPG_Logo color='#fff' />
                </div>
            </div>
            <div className='_right'>

            </div>
        </div>

           

        <div className="trans-bottom"></div>
        </div>

       
        
        {_signupContext.currentScreen == SignInRegisterScreenPages.SwitchBoard && <SwitchBoard />}
        {_signupContext.currentScreen == SignInRegisterScreenPages.Register && <Register />}
        {_signupContext.currentScreen == SignInRegisterScreenPages.SignIn && <SignIn />}
        {_signupContext.currentScreen == SignInRegisterScreenPages.CodeWaiter && <CodeWaiter />}
       

    </div>
 
    </DataAssuranceHOC>

  )
}

export default SignInRegisterScreen