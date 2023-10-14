import React, { useState, useEffect, createRef, useLayoutEffect, useContext } from 'react';
import './ProfilePictureModal.scss';
import Cropper, { ReactCropperElement } from 'react-cropper';
import "cropperjs/dist/cropper.css";
import { Icons } from '../../atoms/Icons';
import { SignUpRegisterContext } from '../../../contexts/SignUpRegisterContext';
import AvatarEditor from 'react-avatar-editor';
import { GameContext } from '../../../contexts/GameContext';

interface ProfilePictureModalProps {
  onClose?: () => void;
  pictureData: File | null;
}

function ProfilePictureModal(props: ProfilePictureModalProps) {
    const _signupContext = useContext(SignUpRegisterContext);
    const _gameContext = useContext(GameContext);
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
  const [zoom, setZoom] = useState<number>(1);
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


const handleSaveProfilePic = () => {

    const blob = dataURLToblob(cropperRef.current.getImageScaledToCanvas().toDataURL());

    setShowCropper(false);
    setLoadingText('uploading image');
    setLoadingSubtext('please wait a moment');
    let payload = new FormData();
    payload.append('image', blob as Blob, 'filename.jpg');
    payload.append('userKey', _signupContext.signedInUser ?. user.UserKey as string);

    fetch(`${
        process.env.REACT_APP_API_URL
    }/user/picture/upload`, {
        method: 'POST',
        body: payload
    }).then(response => response.json()).then(data => {
        if (data.success) {
            console.log(data);
            let fullProfileImage = `${
                process.env.REACT_APP_STORAGE_ACCOUNT_URL
            }/profile-pics/${
                data.imageURL
            }`;

            // Fetch the image and convert to base64
            fetch(fullProfileImage).then(response => response.blob()).then(blob => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () { // This will now include the correct MIME type
                    const base64data = reader.result as string;
                    _gameContext.setInMemoryAssetItem(`${
                        _signupContext.signedInUser ?. user.UserKey
                    }-profile-pic`, base64data);

                }
            });

            // Update the user profile picture
            _signupContext.updateUserProfilePicture(fullProfileImage);
        }

        props.onClose ?. ();
    }).catch(error => {
        console.log('failure', error);
    });

}


  const dataURLToblob = (dataURL: string): Blob | null => {
    const arr = dataURL.split(',');

    if (arr.length !== 2) return null;  // Early return if dataURL format is unexpected

    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null; // Early return if mime type match fails

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = n - 1; i >= 0; i--) {
        u8arr[i] = bstr.charCodeAt(i);
    }

    return new Blob([u8arr], { type: mime });
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
<div className='zoomer'><input 
onChange={(e) => setZoom(old => parseFloat(e.target.value))} 
type='range' defaultValue={1} step={0.1} min={1.0} max={5.0}/></div>
       
    </div>

        <div className='preview-wrap'>
          <div className='preview-text'>preview</div>
          <div className='preview-profile'>
            <div className='profile-picture'>
              {/* You can display the cropped preview image here using the .img-preview class */}
              {thumbData && <img src={thumbData} />}
            </div>
            <div className='profile-name'>
              <div className='name'>{_signupContext.signedInUser?.user.Username}</div>
              <div className='joined'></div>
            </div>
            
          </div>
        </div>
        <div className='buttons-wrap'>
            <div className='button-indi cancel' onClick={props.onClose}>
                <div className='button'>cancel</div></div>
            <div className='button-indi save' onClick={handleSaveProfilePic}><div className='button'>save</div></div>
        </div>
        </>}
      </div>
    </div>);
}

export default ProfilePictureModal;