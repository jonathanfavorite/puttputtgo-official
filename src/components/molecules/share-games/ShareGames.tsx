import React, {useContext, useEffect} from 'react'
import {Icons} from '../../atoms/Icons'
import './ShareGames.scss';
import {GameContext} from '../../../contexts/GameContext';
import {useLocation} from 'react-router-dom';


function ShareGames() {
    const _gameContext = useContext(GameContext);
    const location = useLocation();
   
    const [realGameID, setRealGameID] = React.useState(_gameContext.gameID);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const gameID = queryParams.get('gameID');
        if (gameID) {
            setRealGameID(gameID);
        }
    }, [location]);

    function handleMessageClick() {
        if (navigator.share) {
            navigator.share({title: 'Check this out!', text: 'Hello, check out this cool website I found.', url: `https://www.favoritecreative.com/puttputtgo/sharer.php?customerKey=${
                    _gameContext.companyData.customerID
                }&gameID=${realGameID}`}).then(() => console.log('Successful share')).catch((error) => console.log('Error sharing', error));
        } else {
            console.log('Share not supported on this browser, do it the old way.');
        }
    }
    return (
        <div className='share-game-wrap'>
            {/* <div className='icon facebook'>
                <a href={
                    `https://www.facebook.com/sharer/sharer.php?u=https://www.favoritecreative.com/puttputtgo/sharer.php?customerKey=${
                        _gameContext.companyData.customerID
                    }&gameID=${
                        _gameContext.gameID
                    }`
                }><Icons.Facebook/></a>
            </div>
            <div className='icon twitter'><Icons.Twitter/></div> */}
            <div className='icon message'
                onClick={handleMessageClick}><Icons.Message/></div>
        </div>
    )
}

export default ShareGames
