import React, { useState, useEffect, createRef, useLayoutEffect, useContext } from 'react';
import './ProfilePictureModal.scss';
import Cropper, { ReactCropperElement } from 'react-cropper';
import "cropperjs/dist/cropper.css";
import { Icons } from '../../atoms/Icons';
import { SignUpRegisterContext } from '../../../contexts/SignUpRegisterContext';
import AvatarEditor from 'react-avatar-editor';

interface ProfilePictureModalProps {
  onClose?: () => void;
  pictureData: File | null;
}

function ProfilePictureModal(props: ProfilePictureModalProps) {
    const _signupContext = useContext(SignUpRegisterContext);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const cropperRef = createRef<any>();

  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('preparing image');
  const [loadingSubtext, setLoadingSubtext] = useState<string>('this usually means the image is too large');

  useEffect(() => {
    if (props.pictureData) {
      const reader = new FileReader();
      reader.onload = () => {
        let imgElement = new Image();
        imgElement.onload = () => { // Add this onload callback for the Image
          let width = imgElement.width;
          let height = imgElement.height;
          let maxSize = 1000;
          if (width > maxSize) {
           // console.log('width too large');
           setImageSrc(reader.result as string);
            setShowCropper(true);
           // preProcessImage(props.pictureData!);
          } else {
            setImageSrc(reader.result as string);
            setShowCropper(true);
          }
        };
        imgElement.src = reader.result as string;
      };
      reader.readAsDataURL(props.pictureData);
    }
  }, [props.pictureData]);

  const preProcessImage = (image: File) => {
    let formData = new FormData();
    formData.append('image', image);
    formData.append('userKey', _signupContext.signedInUser?.user.UserKey as string);
  
    fetch(`${process.env.REACT_APP_API_URL}/user/picture/preprocess`, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        let imageUrl = `${process.env.REACT_APP_STORAGE_ACCOUNT_URL}/profile-pics-preprocessed/${data.imageUrl}`; // Combine base URL with filename to create full URL
        let i = new Image();
        i.onload = () => {
          setImageSrc(imageUrl); // Set the full URL to state
          setShowCropper(true);
        }
        i.src = imageUrl; // Begin loading the image
      } else {
        console.log('error', data);
      }
    })
    .catch(error => {
      console.log('failure', error);
    });
  }
  
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [zoom, setZoom] = useState<number>(5);
  const [thumbData, setThumbData] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      const cropperInstance = cropperRef.current?.cropper;
      if (cropperInstance) {
        cropperInstance.destroy();
      }
    };
  }, []);

  const percentageOfScreenWidth = (percentage: number) => {
    return screenWidth * (percentage / 100);
  }



  return(
    <div className='profile-picture-modal-wrap'>
      <div className='profile-picture-modal'>

        {!showCropper ? <>
            <div className='loading-wrap'>
                <div className='loading'>
                    <div className='loading-spinner'><Icons.Gallery_Spinner /></div>
                    <div className='loading-text'>{loadingText}</div>
                    <div className='loading-subtext'>{loadingSubtext}</div>
                </div>
            </div>
        </>: <>
        <div className='editor-wrap'>
            <AvatarEditor
                ref={cropperRef}
                image={imageSrc as string}
                width={percentageOfScreenWidth(80)}
                height={percentageOfScreenWidth(80)}
                border={20}
                scale={zoom}
                onImageChange={() => {

                 setThumbData(old => cropperRef.current.getImageScaledToCanvas().toDataURL());
                }}
               
                 />
                
        </div>
<div className='editor-text'>
    
<div className='zoom-text'>adjust the image to fit in the square</div>
<div className='zoomer'><input onChange={(e) => setZoom(old => parseFloat(e.target.value))} type='range' defaultValue={3.0} step={0.1} min={1.0} max={5.0}/></div>
       
    </div>

        <div className='preview-wrap'>
          <div className='preview-text'>preview</div>
          <div className='preview-profile'>
            <div className='profile-picture'>
              {/* You can display the cropped preview image here using the .img-preview class */}
              {thumbData && <img src={thumbData} />}
            </div>
            <div className='profile-name'>
              {_signupContext.signedInUser?.user.Username}
            </div>
          </div>
        </div>
        <div className='buttons-wrap'>
            <div className='button-indi cancel' onClick={props.onClose}>
                <div className='button'>cancel</div></div>
            <div className='button-indi save'><div className='button'>save</div></div>
        </div>
        </>}
      </div>
    </div>);
}

export default ProfilePictureModal;