import React, {useContext, useEffect, useState} from 'react';
import { GameContext } from '../../contexts/GameContext';

interface IProps {
    children: any;
}
function PlayerRecordHOC(props: IProps) {
    // This HOC will look for either existing in-memory player+round+score data
    // or it will look for a player+round+score data in local storage
    // if it finds data in local storage, it will load it into memory
    // if it does not, it will redirect the user to the create game page
    // if it does find data (in memory or localstorage) it will continue with the children props.

    const _gameContext = useContext(GameContext);

    const [foundInMemoryData, setFoundInMemoryData] = useState(false);
    const [foundLocalStorageData, setFoundLocalStorageData] = useState(false);

    
    
}