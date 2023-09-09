import React, { useEffect, useRef } from 'react'
import './SnapGalleryItem.scss';
import { Icons } from '../../../../atoms/Icons';

interface IProps {
    picture: string;
    onClose: () => void;
}
function SnapGalleryItem(props: IProps) {

    const [imageLoaded, setImageLoaded] = React.useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        var image = new Image();
        image.src = props.picture;
        image.onload = function() {
            setImageLoaded(true);
        }
    }, []);

    const closeWrapperIfNotLoaded = () => {
        if (!imageLoaded) {
            props.onClose();
        }
    }

  return (
    <div className='snap-gallery-item' ref={wrapperRef} onClick={closeWrapperIfNotLoaded}>
        {!imageLoaded && <div className='snap-loader'><Icons.Gallery_Spinner /></div> }
        {imageLoaded && <div className='snap-picture'>
            <div className='pic'>
                <img src={props.picture} alt='snap' />
                <div className='close' onClick={props.onClose}>
                    <Icons.Camera_Close />
                </div>
            </div>
        </div> }
        </div>
  )
}

export default SnapGalleryItem