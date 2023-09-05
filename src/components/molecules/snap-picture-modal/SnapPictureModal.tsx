import React, {useContext, useEffect, useRef, useState} from 'react'
import './SnapPictureModal.scss'
import {Icons} from '../../atoms/Icons'
import {GameContext} from '../../../contexts/GameContext';

function SnapPictureModal() {
    const _gameContext = useContext(GameContext);
    const [pictureSnapped, setPictureSnapped] = React.useState(false);
    const [picture, setPicture] = React.useState('');
    const [forcePicture, setForcePicture] = React.useState(0);
    const closePictureModal = () => {
        _gameContext.updateSnapPictureEnabled(false);
    }
    const snappedPicture = () => {
        setPictureSnapped(true);
        setForcePicture(prev => prev + 1);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (videoRef.current) {
          // Get video dimensions
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;
      
          // Get the video element dimensions (it may be resized due to CSS)
          const elementWidth = videoRef.current.clientWidth;
          const elementHeight = videoRef.current.clientHeight;
      
          // Calculate aspect ratios
          const videoAspect = videoWidth / videoHeight;
          const elementAspect = elementWidth / elementHeight;
      
          // Initialize variables to define the area to copy from the video
          let copyWidth, copyHeight, xOffset, yOffset;
      
          if (videoAspect > elementAspect) {
            // Video is wider than the element (letterboxing)
            copyHeight = videoHeight;
            copyWidth = elementWidth * (videoHeight / elementHeight);
            xOffset = (videoWidth - copyWidth) / 2;
            yOffset = 0;
          } else {
            // Video is taller than the element (pillarboxing)
            copyWidth = videoWidth;
            copyHeight = elementHeight * (videoWidth / elementWidth);
            xOffset = 0;
            yOffset = (videoHeight - copyHeight) / 2;
          }
      
          // Set canvas dimensions to match the video element
          canvas.width = elementWidth;
          canvas.height = elementHeight;

          ctx!.clearRect(0, 0, canvas.width, canvas.height);
      
          // Flip the context horizontally
          if(facingMode == 'user')
          {
            console.log('user');
            ctx!.scale(-1, 1);
          }
          else
          {
            console.log(' environment');
            //ctx!.scale(1, 1);
          }

          console.log(`videoWidth: ${videoWidth}, videoHeight: ${videoHeight}`);
console.log(`elementWidth: ${elementWidth}, elementHeight: ${elementHeight}`);
console.log(`copyWidth: ${copyWidth}, copyHeight: ${copyHeight}`);
console.log(`xOffset: ${xOffset}, yOffset: ${yOffset}`);
          
          ctx!.fillStyle = 'red';
ctx!.fillRect(0, 0, 100, 100);
      
          // Draw the image onto the canvas, but only copy the visible portion
          const destX = facingMode === 'user' ? -elementWidth : 0;
ctx!.drawImage(videoRef.current, xOffset, yOffset, copyWidth, copyHeight, destX, 0, elementWidth, elementHeight);
      
          // Convert canvas to data URL
          const dataURL = canvas.toDataURL('image/png');
          //console.log(dataURL);
          setPicture(old => dataURL);
    }
    }

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const containerRef = useRef<HTMLDivElement>(null);

    const startVideo = async () => {
        try {
          const constraints = {
            video: {
              facingMode: facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          };
    
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener('loadedmetadata', () => {
              if (videoRef.current) {
                videoRef.current.play();
              }
            });
          }
        } catch (error) {
          console.log("Error starting video: ", error);
        }
      };

      const switchCamera = () => {
        setFacingMode((prevFacingMode) =>
          prevFacingMode === 'user' ? 'environment' : 'user'
        );
      };
    
      useEffect(() => {
        startVideo();
      }, [facingMode]);

     

      const deletePicture = () => {
        setPictureSnapped(false);
        setPicture('');
        
      }



    return (
        <div className='snap-picture-modal'>
            <div className='actual-camera-container'>
                <video ref={videoRef} autoPlay playsInline style={{
                    transform: `scaleX(${facingMode == 'user' ? '-1' : '1'})`
                }}></video>
            </div>
            {picture != '' && <div className='canvas-container'>
                <img src={picture} alt='picture' className='picture' key={forcePicture} />
            </div>
}
            <div className='picture-container'>
            {pictureSnapped &&<div className='hold-finder-wrap'>
                <div className='finger-icon'><Icons.Camera_Press /></div>
                <div className='finger-text'>Press and hold<br />to save</div>
            </div>}

            <div className='_top'>
                <div className='_top-left'></div>
                <div className='_top-center'></div>
                <div className='_top-right'>
                    {pictureSnapped &&<div className='camera-trash' onClick={deletePicture}><Icons.Camera_Trash/></div>}
                    {!pictureSnapped && <div className='camera-close' onClick={closePictureModal}><Icons.Camera_Close/></div>}
                    
                </div>
            </div>
            <div className='_middle'></div>
            <div className='_bottom'>
                <div className='_bottom-left'></div>
                <div className='_bottom-center'>
                {!pictureSnapped && <div className='picture-button' onClick={snappedPicture}></div>}
                </div>
                <div className='_bottom-right'>
                {!pictureSnapped && <div className='camera-switch' onClick={switchCamera}><Icons.Camera_Switch/></div>}
                </div>

            </div>
            </div>
        </div>
    )
}

export default SnapPictureModal
