import React from 'react';
import ReactDOM from 'react-dom/client';
import './startup/index.scss';
import App from './startup/App';
import {GameContextProvider} from './contexts/GameContext';
import {PlayerContextProvider} from './contexts/PlayerContext';
import {ScoreContextProvider} from './contexts/ScoreContext';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
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

const root = ReactDOM.createRoot(document.getElementById('root')as HTMLElement);
root.render (
    <PlayerContextProvider>
        <CourseContextProvider>
            <ScoreContextProvider>
                <GameContextProvider>
                    <UIContextProvider>
                        <App>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/"
                                        element={<WelcomePage/>}/>

                                    <Route path="/game"
                                        element={<GamePage/>}/>
                                    <Route path="/create-game"
                                        element={<CreateGamePage/>}/>
                                    <Route path="/rules"
                                        element={<RulesPage/>}/>
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
                                    <Route path="/:business_name/admin"
                                        element={
                                            <h1>Admin</h1>
                                        }/>
                                    <Route path="/:business_name/course-selection"
                                        element={<CourseSelectionPage/>}/>

                                    <Route path="/:business_name/test"
                                        element={<TestCompanyDataPage/>}/>
                                        <Route path="/test/flex"
                                        element={<FlexTest/>}/>
                                </Routes>
                            </BrowserRouter>
                        </App>
                    </UIContextProvider>
                </GameContextProvider>
            </ScoreContextProvider>
        </CourseContextProvider>
    </PlayerContextProvider>


);
