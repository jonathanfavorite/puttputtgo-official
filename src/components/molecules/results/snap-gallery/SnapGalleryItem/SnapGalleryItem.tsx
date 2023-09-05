import React, { useEffect } from 'react'
import './SnapGalleryItem.scss';
import { Icons } from '../../../../atoms/Icons';

interface IProps {
    picture: string;
    onClose: () => void;
}
function SnapGalleryItem(props: IProps) {

    const [imageLoaded, setImageLoaded] = React.useState(false);
    
    useEffect(() => {
        var image = new Image();
        image.src = props.picture;
        image.onload = function() {
            setImageLoaded(true);
        }
    }, []);

  return (
    <div className='snap-gallery-item'>
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