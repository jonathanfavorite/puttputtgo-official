import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './startup/index.scss';
import './startup/App.scss';
import {GameContextProvider} from './contexts/GameContext';
import {PlayerContextProvider} from './contexts/PlayerContext';
import {ScoreContextProvider} from './contexts/ScoreContext';
import {BrowserRouter, NavigationType, Route, Routes, UNSAFE_NavigationContext, useLocation, useNavigationType} from 'react-router-dom';
import WelcomePage from './components/pages/welcome-screen/WelcomePage';
import WelcomeTemplate from './components/templates/welcome-screen/WelcomeTemplate';
import RulesPage from './components/pages/rules-screen/RulesPage';
import TestCompanyDataPage from './components/pages/tests/test-company-data/TestCompanyDataPage';
import CourseSelectionPage from './components/pages/course-selection-screen/CourseSelectionPage';
import GamePage from './components/pages/game-screen/GamePage';
import CreateGamePage from './components/pages/create-game/CreateGamePage';
import {UIContextProvider} from './contexts/UIContext';
import { CourseContextProvider } from './contexts/CourseContext';
import FlexTest from './components/pages/tests/flex/flexTest';
import ResultsPage from './components/pages/results-screen/ResultsPage';
import SettingsPage from './components/pages/settings-screen/SettingsPage';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { hydrate, render } from 'react-dom';
import HomeScreen from './components/pages/website/home/HomeScreen';
import SignInRegisterScreen from './components/pages/sign-in-register-screen/SignInRegisterScreen';
import { SignUpRegisterContextProvider } from './contexts/SignUpRegisterContext';
import { GameAudioContext, GameAudioContextProvider } from './contexts/GameAudioContext';
import WelcomeUser from './components/pages/sign-in-register-screen/welcome-user/WelcomeUser';
import { handleTouchMove, handleTouchStart } from './hooks/use-swipe/useSwipe';
import ConfirmationModal from './components/molecules/confirmation-modal/ConfirmationModal';

const root = ReactDOM.createRoot(document.getElementById('root')as HTMLElement);


const useBackListener = (callback:(...args: any) => void) => {
    // Ref is used to handle any React.StrictMode double-mounting
    const initialRender = React.useRef(true);
  
    const location = useLocation();
    const navigationType = useNavigationType();
  
    useEffect(() => {
      if (!initialRender.current && navigationType === NavigationType.Pop) {
        console.log(":yes");
        initialRender.current = false;
        callback({ location });
      }
  
    }, [callback, location, navigationType]);
  };
  
const ApplicationWrapper = (props: any) => {
    const [showBackButtonPressedPopup, setShowBackButtonPressedPopup] = React.useState(false);
    const [lastLocation, setLastLocation] = useState<any>(null);
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const message = 'Are you sure you want to leave?';
            e.returnValue = message;
            return message;
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        // Cleanup the event listener when component unmounts
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
    return (
        <div id='application-wrapper'>
            {props.children}
        </div>
    );
}

root.render(
    <HelmetProvider>
        <GameAudioContextProvider>
    <PlayerContextProvider>
    <CourseContextProvider>
        <ScoreContextProvider>
            <GameContextProvider>
                <UIContextProvider>
                    <SignUpRegisterContextProvider>

                        <BrowserRouter>
                        <ApplicationWrapper>
                            <Routes>
                                <Route path="/" element={<HomeScreen/>}/>
                                <Route path="/demo/"
                                    element={<WelcomePage/>}/>

                                <Route path="/signin/"
                                    element={<SignInRegisterScreen/>}/>

                                    <Route path="/signin/welcome/"
                                    element={<WelcomeUser />}/>

                                <Route path="/demo/game"
                                    element={<GamePage/>}/>
                                <Route path="/demo/create-game"
                                    element={<CreateGamePage/>}/>
                                <Route path="/demo/rules"
                                    element={<RulesPage/>}/>
                                <Route path="/demo/results"
                                    element={<ResultsPage />}/>
                                    <Route path="/demo/settings"
                                    element={<SettingsPage />}/>
                                <Route path="/admin"
                                    element={
                                        <h1>Admin</h1>
                                    }/>
                                <Route path="/course-selection"
                                    element={<CourseSelectionPage/>}/>

                                <Route path="/:business_name"
                                    element={<WelcomePage/>}/>
                                <Route path="/:business_name/rules"
                                    element={<RulesPage/>}/>
                                <Route path="/:business_name/game"
                                    element={<GamePage/>}/>
                                <Route path="/:business_name/create-game"
                                    element={<CreateGamePage/>}/>
                                    <Route path="/:business_name/results"
                                    element={<ResultsPage />}/>
                                    <Route path="/:business_name/signin"
                                    element={<SignInRegisterScreen />}/>
                                <Route path="/:business_name/admin"
                                    element={
                                        <h1>Admin</h1>
                                    }/>
                                <Route path="/:business_name/course-selection"
                                    element={<CourseSelectionPage/>}/>

                                <Route path="/:business_name/settings"
                                    element={<SettingsPage/>}/>

                                <Route path="/:business_name/test"
                                    element={<TestCompanyDataPage/>}/>
                                    <Route path="/test/flex"
                                    element={<FlexTest/>}/>
                                <Route path="*" element={<h1>Not Found</h1>}/>
                            </Routes>
                            </ApplicationWrapper>
                        </BrowserRouter>
                        </SignUpRegisterContextProvider>
                </UIContextProvider>
            </GameContextProvider>
        </ScoreContextProvider>
    </CourseContextProvider>
</PlayerContextProvider>
</GameAudioContextProvider>
</HelmetProvider>
);


// const rootElement = document.getElementById("root");
// if (rootElement!.hasChildNodes()) {
//     hydrate(<App />, rootElement);
//   } else {
//     render(<App />, rootElement);
//   }