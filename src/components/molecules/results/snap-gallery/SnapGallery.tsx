import React, {useContext} from 'react'
import './SnapGallery.scss';
import {GameContext} from '../../../../contexts/GameContext';
import SnapGalleryItem from './SnapGalleryItem/SnapGalleryItem';
import { Icons } from '../../../atoms/Icons';

function SnapGallery() {
    const _gameContext = useContext(GameContext);
    const [showModal, setShowModal] = React.useState(false);
    const [selectedPicture, setSelectedPicture] = React.useState('');
    const clickedImage = (picture: string) => {
        setSelectedPicture(picture);
        setShowModal(true);
    }

    const reset = () => {
        setShowModal(false);
        setSelectedPicture('');
    }

    return (
        <div className='snap-gallery-wrap'>
            {showModal && <SnapGalleryItem onClose={reset} picture={selectedPicture} /> }
            <div className='title'>gallery
                </div>
            <div className='snap-gallery'>
                {
                    _gameContext.pictures.map((picture, index) => {
                        let realPicLocationSmall = process.env.REACT_APP_IMAGEGEN_URL + '/api/snaps/small/' + picture.filename;
                        let realPicLocationLarge = process.env.REACT_APP_IMAGEGEN_URL + '/api/snaps/large/' + picture.filename;
                        
                        return picture.processed ?
                            <div className='snap-picture-wrapper'>
                                <div className='spinner'><Icons.Gallery_Spinner /></div>
                                <div onClick={() => clickedImage(realPicLocationLarge)} className='snap-picture' key={index} style={{
                                backgroundImage: `url(${realPicLocationSmall})`
                            }}></div></div> : <div onClick={() => clickedImage(realPicLocationLarge)} className='snap-picture processing' key={index}><div className='spinner'><Icons.Gallery_Spinner /></div></div>
                        
                          
                        
                    })
                }
            </div>
        </div>
    )
}

export default SnapGallery
