import React, {useContext} from 'react'
import './SnapGallery.scss';
import {GameContext} from '../../../../contexts/GameContext';
import SnapGalleryItem from './SnapGalleryItem/SnapGalleryItem';
import { Icons } from '../../../atoms/Icons';
import SnapHelper from '../../../../helpers/SnapHelper';
import StyleHelper from '../../../../helpers/StyleHelper';

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

    const handleSnapLoaded = (id: string) => {
        console.log("done");
        let element = document.getElementById(id);
        if (element) {
            element.classList.add('loaded');
        }
    }

    return (
        // <div className='snap-gallery-wrap'>
        //     {showModal && <SnapGalleryItem onClose={reset} picture={selectedPicture} /> }
        //     <div className='title'>gallery
        //         </div>
        //     <div className='snap-gallery'>
        //         {
        //             _gameContext.pictures.map((picture, index) => {
        //                 let realPicLocationSmall = process.env.REACT_APP_STORAGE_ACCOUNT_URL + '/snaps/' + picture.filename;
        //                 let realPicLocationLarge = process.env.REACT_APP_STORAGE_ACCOUNT_URL + '/snaps/' + picture.filename;
                        
        //                 return picture.processed ?
        //                     <div className='snap-picture-wrapper'>
        //                         <div className='spinner'><Icons.Gallery_Spinner /></div>
        //                         <div onClick={() => clickedImage(realPicLocationLarge)} className='snap-picture' key={index} style={{
        //                         backgroundImage: `url(${realPicLocationSmall})`
        //                     }}></div></div> : <div onClick={() => clickedImage(realPicLocationLarge)} className='snap-picture processing' key={index}><div className='spinner'><Icons.Gallery_Spinner /></div></div>
                        
                          
                        
        //             })
        //         }
        //     </div>
        // </div>
        //https://ppgstorageaccount.blob.core.windows.net/snaps/08ca5020-ef8f-47c8-830f-81c443ad9009.jpg
         <div className='snap-gallery-wrap'>
            {showModal && <SnapGalleryItem onClose={reset} picture={selectedPicture} /> }
            <div className='title'>gallery
                </div>
            <div className='snap-gallery'>
                {
                    _gameContext.pictures.filter(x => x.type != undefined && x.type == 0).map((picture, index) => {
                      
                       
                        // let realPicLocationSmall = process.env.REACT_APP_STORAGE_ACCOUNT_URL + '/snaps/' + "08ca5020-ef8f-47c8-830f-81c443ad9009.jpg";
                        // let realPicLocationLarge = process.env.REACT_APP_STORAGE_ACCOUNT_URL + '/snaps/' + "08ca5020-ef8f-47c8-830f-81c443ad9009.jpg";

                        let realPicLocationSmall = process.env.REACT_APP_STORAGE_ACCOUNT_URL + '/snaps/' + picture.filename;
                         let realPicLocationLarge = process.env.REACT_APP_STORAGE_ACCOUNT_URL + '/snaps/' + picture.filename;
                      
                          
                        return <div key={index} className='snap-picture-indi' id={`snap-${index}`}>
                            <div className='spinner1'><Icons.Gallery_Spinner /></div>
                            <div className='snap-picture-thumb'>
                                <img src={realPicLocationSmall} 
                                alt='snap' 
                                onLoad={() => handleSnapLoaded(`snap-${index}`)}
                                onClick={() => clickedImage(realPicLocationLarge)} className='snap-picture processing' key={index}
                                />
                              
                                </div>
                        </div>
                    
                    })
                }
            </div>
        </div>
    )
}

export default SnapGallery
