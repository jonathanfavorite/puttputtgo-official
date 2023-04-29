import React, {useEffect, createContext, useState, createRef} from 'react';

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

    const [animating, setAnimating] = useState(true);
    const [transitionHeadingText, setTransitionHeadingText] = useState("Game Starting");
    const [transitionDescText, setTransitionDescText] = useState("Good Luck!");

    const transitionRef = createRef<HTMLDivElement>();
    useEffect(() => {
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