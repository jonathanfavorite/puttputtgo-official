import React, {useEffect, createContext, useState, createRef, useContext} from 'react';
import { GameContext } from './GameContext';
import { CourseContext } from './CourseContext';

const TransitionContext = createContext<TransitionContextProps>({} as TransitionContextProps);
interface TransitionContextProps {
    handleAnimationToggle: () => void;
    animating: boolean;
    transitionRef?: any;
    headingText: string;
    descText: string;
    updateHeadingText: (text: string) => void;
    updateDescText: (text: string) => void;
}

function TransitionContextProvider(props: any) {

    const _gameContext = useContext(GameContext);
    const _courseContext = useContext(CourseContext);
    const [animating, setAnimating] = useState(true);
    const [transitionHeadingText, setTransitionHeadingText] = useState("Game Starting");
    const [transitionDescText, setTransitionDescText] = useState("Good Luck!");

    const transitionRef = createRef<HTMLDivElement>();
    useEffect(() => {

        if(_courseContext.getCurrentHole().number != 1)
        {
            setTransitionHeadingText("Hole " + _courseContext.getCurrentHole().number );
            setTransitionDescText("Good Luck!");
        }
      
        handleAnimationToggle();
     // handleAnimationToggle();
  
    }, []);
    

    const handleAnimationToggle = () => {
        
        setAnimating(true);
        setTimeout(() => {
            setAnimating(false); 
        }, 3500);
      }

      let contextValue : TransitionContextProps = {
        animating: animating,
        handleAnimationToggle: handleAnimationToggle,
        transitionRef: transitionRef,
        headingText: transitionHeadingText,
        descText: transitionDescText,
        updateHeadingText: (text: string) => {
            setTransitionHeadingText(text);
        },
        updateDescText: (text: string) => {
            setTransitionDescText(text);
        }
      };

    return <TransitionContext.Provider value={contextValue}>
        
    {props.children}
       
    </TransitionContext.Provider>
}

export {TransitionContext, TransitionContextProvider};