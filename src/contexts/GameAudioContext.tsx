import React, { createContext, useState, useContext } from 'react';

interface GameAudioContextProps {
    play: (audioName: string) => void;
    preload: (audioName: string, audioSrc: string) => void;
}

const GameAudioContext = createContext<GameAudioContextProps>({} as GameAudioContextProps);

function GameAudioContextProvider(props: any) {
    const [audios, setAudios] = useState<{ [key: string]: HTMLAudioElement }>({});

    const play = (audioName: string) => {
        const audioElement = audios[audioName];
        if (audioElement) {
            audioElement.play();
        } else {
            console.error(`Audio "${audioName}" not found.`);
        }
    }

    const preload = (audioName: string, audioSrc: string) => {
        const audioElement = new Audio(audioSrc);
        setAudios(old => ({ ...old, [audioName]: audioElement }));
    }

    return (
        <GameAudioContext.Provider value={{
            play,
            preload
        }}>
            {props.children}
        </GameAudioContext.Provider>
    )
}

export { GameAudioContext, GameAudioContextProvider };
