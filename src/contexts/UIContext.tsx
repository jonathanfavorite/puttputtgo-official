import React, {createContext, useContext, useState} from 'react'
import { GameContext } from './GameContext';

const UIContext = createContext<UIContextProps>({} as UIContextProps)

type holeNumber = number;

interface UIContextProps {

}

function UIContextProvider(props: any) {

    const _gameContext = useContext(GameContext);
    const contextValues: UIContextProps = {
      
    }

    return <UIContext.Provider value={contextValues}>
        {props.children}
    </UIContext.Provider>
}

export { UIContext, UIContextProvider }