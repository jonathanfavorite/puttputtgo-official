import React, { useContext, useEffect } from 'react'
import './ShareModal.scss';
import QRCode from 'react-qr-code';
import { env } from 'process';
import { GameContext } from '../../../contexts/GameContext';
import { Icons } from '../../atoms/Icons';
interface IProps {
    closeModal: () => void;
    gameID: string;
}
function ShareModal(props: IProps) {
    const _gameContext = useContext(GameContext);
    const [showCopied, setShowCopied] = React.useState(false);


    const copyToClipboard = async (text: string) => {
      
        try {
            await navigator.clipboard.writeText(text);
            setShowCopied(true);
          } catch (err) {
            console.error('Failed to copy text: ', err);
          }
        
       
    };

    const getRandomString = (length: number) => {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    };

    useEffect(() => {
        if (showCopied) {
            setTimeout(() => {
                setShowCopied(false);
            }, 2000);
        }
    }, [showCopied]);

    const getActualUrl = () : string => {
        return `${process.env.REACT_APP_URL}/${_gameContext.companyData.customerID}/results?gameID=${props.gameID}`;
    }
    const getCorrectSharerUrl = () : string => {
        return `${process.env.REACT_APP_SNAPSHOT_URL}${_gameContext.companyData.customerID}/results?gameID=${props.gameID}`;
    }

    function handleGeneralShare() {
        if (navigator.share) {
            navigator.share({title: '🏰 We have defeated Castle Golf! 🏰', files: [], text: '🏰 We have defeated Castle Golf! Click the link to view the scores! 🏰', url: getCorrectSharerUrl()}).then(() => console.log('Successful share')).catch((error) => console.log('Error sharing', error));
        } else {
            console.log('Share not supported on this browser, do it the old way.');
        }
    }

  return (
    <div className='share-modal-wrap'>
        <div className='share-modal'>
            <div className='qr-wrap'>
                <QRCode value={getActualUrl()} />
            </div>
            <div className='share-link'>
                <div className='share-url'><span>{getCorrectSharerUrl()}</span></div>
                <div className='copy-button'  onClick={() => copyToClipboard(getCorrectSharerUrl())}><span style={{
                    opacity: showCopied ? 1 : 0
                }}>Copied!</span><Icons.Copy /></div>
            </div>
            <div className='big-share' onClick={handleGeneralShare}>
                    <span>{_gameContext.getPlainTextByID("results:share")}</span>
                    <img src={_gameContext.getAssetByID("continue-game-button")?.assetLocation} />
                </div>
            <div className='close' onClick={props.closeModal}>{_gameContext.getPlainTextByID("gameplay:back")}</div>
        </div>
    </div>
  )
}

export default ShareModal