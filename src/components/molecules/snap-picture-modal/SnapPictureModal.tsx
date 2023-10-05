import React, { useContext, useEffect, useRef, useState } from 'react'
import './SnapPictureModal.scss'
import { Icons } from '../../atoms/Icons'
import { GameContext } from '../../../contexts/GameContext'
import StyleHelper from '../../../helpers/StyleHelper'
import SnapHelper, { BlendMode, GlobalCompositeOp } from '../../../helpers/SnapHelper'
import { CompanyDataAssetAttributesModel } from '../../../models/data/CompanyDataModel'
import SnappedPictureSave from './snapped-picture-save/SnappedPictureSave'

function SnapPictureModal() {
  const _gameContext = useContext(GameContext)
  const [pictureSnapped, setPictureSnapped] = React.useState(false)
  const [picture, setPicture] = React.useState('');
  const [blendMode, setBlendMode] = React.useState<BlendMode>('normal')
  const [forcePicture, setForcePicture] = React.useState(0)

  const closePictureModal = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      let tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
  }
    _gameContext.updateSnapPictureEnabled(false)
  }
  const snappedPicture = () => {
    setPictureSnapped(true)
    setForcePicture(prev => prev + 1)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (videoRef.current) {
      // Get video dimensions
      const videoWidth = videoRef.current.videoWidth
      const videoHeight = videoRef.current.videoHeight

      // Get the video element dimensions (it may be resized due to CSS)
      const elementWidth = videoRef.current.clientWidth
      const elementHeight = videoRef.current.clientHeight

      // Calculate aspect ratios
      const videoAspect = videoWidth / videoHeight
      const elementAspect = elementWidth / elementHeight

      // Initialize variables to define the area to copy from the video
      let copyWidth, copyHeight, xOffset, yOffset

      if (videoAspect > elementAspect) {
        // Video is wider than the element (letterboxing)
        copyHeight = videoHeight
        copyWidth = elementWidth * (videoHeight / elementHeight)
        xOffset = (videoWidth - copyWidth) / 2
        yOffset = 0
      } else {
        // Video is taller than the element (pillarboxing)
        copyWidth = videoWidth
        copyHeight = elementHeight * (videoWidth / elementWidth)
        xOffset = 0
        yOffset = (videoHeight - copyHeight) / 2
      }

      // Set canvas dimensions to match the video element
      canvas.width = elementWidth
      canvas.height = elementHeight

      ctx!.clearRect(0, 0, canvas.width, canvas.height)

      // Flip the context horizontally
      if (facingMode == 'user') {
        console.log('user')
        ctx!.scale(-1, 1)
      } else {
        console.log(' environment')
      }

      // set the blending mode
      ctx!.globalCompositeOperation = SnapHelper.blendModeToCompositeOp(blendMode);

      // Draw the image onto the canvas, but only copy the visible portion
      const destX = facingMode === 'user' ? -elementWidth : 0
      ctx!.drawImage(
        videoRef.current,
        xOffset,
        yOffset,
        copyWidth,
        copyHeight,
        destX,
        0,
        elementWidth,
        elementHeight
      )


      if (facingMode == 'user') {
        ctx!.scale(-1, 1) // This will 'unflip' the canvas back
      }

      if (selectedFilter) {

        let overLayImage = new Image()
        overLayImage.src = selectedFilter as string
        overLayImage.onload = function () {
          console.log('GO')
          ctx!.drawImage(
            overLayImage,
            0,
            0,
            window.innerWidth,
            window.innerHeight
          )

        
          // Convert canvas to data URL
          const dataURL = canvas.toDataURL('image/png')
          //console.log(dataURL);
          setPicture(old => dataURL)
        }
        overLayImage.onerror = function () {
          console.log('NO GO')
          // Convert canvas to data URL
          const dataURL = canvas.toDataURL('image/png')
          //console.log(dataURL);
          setPicture(old => dataURL)
        }
      }
      else
      {
          // Convert canvas to data URL
          const dataURL = canvas.toDataURL('image/png')
          //console.log(dataURL);
          setPicture(old => dataURL)
      }
    }
  }

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const containerRef = useRef<HTMLDivElement>(null)

  const startVideo = async () => {
    console.log("FACING MODE:", facingMode)
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 360, ideal: 720, max: 1080 }
        } 
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (videoRef.current) {
            videoRef.current.play()
          }
        })
      }
    } catch (error) {
      console.log('Error starting video: ', error)
    }
  }

  const switchCamera = () => {
    setFacingMode(prevFacingMode =>
      prevFacingMode === 'user' ? 'environment' : 'user'
    )
  }


  /*
if (videoRef.current && videoRef.current.srcObject) {
      let tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
  }
  */


  function stopVideoStream() {
    if (videoRef.current && videoRef.current.srcObject) {
      let tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
  }
  }
  
  // useEffect(() => {

  //   document.addEventListener("visibilitychange", function() {
  //     if (videoRef.current) {
  //       console.log("STOPPING");
  //       stopVideoStream();
  //     }
  //     if (document.visibilityState === 'visible') {
  //       console.log("SHOWING");
  //       startVideo(); 
  //     }
  //   });

  //   //startVideo()
  // }, [])

  useEffect(() => {
    startVideo()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        stopVideoStream();
        startVideo();
      }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    stopVideoStream();
        startVideo();
  }, [facingMode]);

  const deletePicture = () => {
    setPictureSnapped(false)
    setPicture('')
  }



  const savePicture = () => {

    let payloadFormData = new FormData()
    payloadFormData.append('CustomerKey', _gameContext.companyData.customerID)
    payloadFormData.append('GameID', _gameContext.gameID)
    payloadFormData.append('Filename', 'asd')
    payloadFormData.append('Image', SnapHelper.dataURLToBlob(picture))

    let pictureID = SnapHelper.generateRandomString(10)
    let newPicture = SnapHelper.CreateNewPicture()
    newPicture.id = pictureID
    newPicture.processed = false

    if (picture != '') {
      SnapHelper.generateSmallThumb(picture)
        .then(smallThumb => {
          newPicture.tmp_thumb = smallThumb
          _gameContext.addPicture(newPicture)
          console.log('smallThumb', smallThumb)
        })
        .catch(err => {
          return
        });

      console.log('firing')
      let response = fetch(
        `${process.env.REACT_APP_API_URL}/Image/SaveImage`,
        {
          method: 'POST',
          body: payloadFormData
        }
      )
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log(data.filename)
            newPicture.filename = data.filename
            newPicture.processed = true
            _gameContext.updatePicture(newPicture)
          }
        })
        .catch(err => {
          newPicture.failure = true
          _gameContext.updatePicture(newPicture);
          console.log("error", err)
        })
    }


    if (videoRef.current && videoRef.current.srcObject) {
      let tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
  }
    _gameContext.updateSnapPictureEnabled(false)
  }



  // FILTER STUFF
  const filterContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {

      const filterContainer = filterContainerRef.current;
      if (!filterContainer) return;

      if(filterContainer.children.length >= 3)
      {
       centerOnElement(filterContainer.children[1] as HTMLDivElement);
      }
      

      const handleScroll = () => {
          const children = Array.from(filterContainer.children) as HTMLDivElement[];
          let closest: HTMLDivElement | null = null;
          let closestDistance = Infinity;
          const maxScroll = filterContainer.scrollWidth - filterContainer.clientWidth;
          const currentScroll = filterContainer.scrollLeft;
          const nearEnd = maxScroll - currentScroll < 200;

          children.forEach((child) => {
              const childCenter = child.offsetLeft + (child.offsetWidth / 2);
              const containerCenter = filterContainer.scrollLeft + (filterContainer.offsetWidth / 2);
              const distance = Math.abs(childCenter - containerCenter);

              if (distance < closestDistance) {
                  closestDistance = distance;
                  closest = child;
              }
          });

          if (closest) {
            const closestElement = closest as HTMLDivElement;
              const closestImg = closestElement.querySelector('.filter-image') as HTMLDivElement;
              //setTestText(closestImg.dataset.id as string)
              //console.log(closestImg);
              if(closestImg.dataset.id == "")
              {
                //closestImg.style.backgroundImage = "";
                setSelectedFilter(old => "");
                closestImg.style.width = "0%";
                closestImg.style.height = "0%";
              }
              else
              {
                setSelectedFilter(old => closestImg.dataset.id as string);
                closestImg.style.width = "100%";
                closestImg.style.height = "100%";
              }



              if(closestImg.dataset.blend)
              {
                setBlendMode(old => closestImg.dataset.blend as BlendMode);
              }
              else
              {
                setBlendMode(old => 'normal');
              }
             
              children.forEach(child => {
                  if (child !== closest) {
                      const img = child.querySelector('.filter-image') as HTMLDivElement;
                      img.style.width = "80%";
                      img.style.height = "80%";
                      
                  }
              });
          }

          if (nearEnd) {
              // Your cloneFilters function here, if needed
          }
      };

      filterContainer.addEventListener('scroll', handleScroll);
    
    // turn off camera on unmount

    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
          let tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
      }
  }
  }, []);

  const centerOnElement = (el: HTMLDivElement) => {
    const parent = el.parentElement;
    if (parent?.classList.contains('empty-icon')) {
        return;
    }
    const parentCenter = parent!.clientWidth / 2;
    const elCenter = el.clientWidth / 2;
    parent!.scrollLeft = el.offsetLeft - parentCenter + elCenter;
};



type ScrollElement = HTMLDivElement | null;

function smoothScrollTo(element: ScrollElement, target: number, duration: number): void {
    if (!element) return;

    const start = element.scrollLeft;
    const change = target - start;
    let currentTime = 0;
    const increment = 20; // This will check and update the scroll position every 20ms

    const animateScroll = function() {
        currentTime += increment;
        const val = easeInOutQuad(currentTime, start, change, duration);
        element.scrollLeft = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };

    animateScroll();
}

function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
}


  const [selectedFilter, setSelectedFilter] = React.useState<String | null>(null);

  const selectPrimaryFilter = () => {
    let primary = _gameContext.getAssetByID('camera-filter-1');
    if (primary) {
      if (selectedFilter) {
        setSelectedFilter(null);
      }
      else {
        setSelectedFilter(primary.assetLocation);
      }
    }
  }

  const specificFilterTapped = (index: number) => {
  //   // Reference to the filter container
  //   const filterContainer = filterContainerRef.current;
  //   if (!filterContainer) return;

  //   // Get the specific filter that was tapped
  //   const el = filterContainer.children[index] as HTMLDivElement;
  //   if (!el) return;

  //   // Calculate center of the parent (filter container) and the tapped filter
  //   const parentCenter = filterContainer.clientWidth / 2;
  //   const elCenter = el.clientWidth / 2;
  //   const targetScroll = el.offsetLeft - parentCenter + elCenter;

  //   // Smooth scroll
  //  // smoothScrollTo(filterContainer, targetScroll, 500);
    centerOnElement(filterContainerRef.current?.children[index] as HTMLDivElement);
}

  const [testText, setTestText] = React.useState('')

  
  const previewFilter = () => {

  }

  const [lastTap, setLastTap] = React.useState<number>(0);
  const cameraOverlayRef = useRef<HTMLDivElement>(null);
  const filterOverlayRef = useRef<HTMLDivElement>(null);
  const delay = 300;
  const handleDoubleTapEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const now = Date.now();
    if (now - lastTap < delay!) { // the "!" is used to assert that delay is not undefined, which we know because of the default value
        switchCamera();
        setLastTap(0); // Reset it so it doesn't interfere with further double taps
    } else {
        setLastTap(now);
    }
  }
  

  return (
    <div className='snap-picture-modal'>
      <div className='actual-camera-container'>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            transform: `scaleX(${facingMode == 'user' ? '-1' : '1'})`
          }}
        ></video>
        <div
          className='camera-overlay'
          ref={cameraOverlayRef}
          style={{
            backgroundImage: selectedFilter ? StyleHelper.format_css_url_without_asset(selectedFilter) : undefined,
            mixBlendMode: blendMode
          }}
        ></div>
      </div>
      {picture != '' && (
        <div className='canvas-container'>
          <img
            src={picture}
            alt='picture'
            className='picture'
            key={forcePicture}
          />
        </div>
      )}
      <div className='picture-container' 
        ref={filterOverlayRef}
        onClick={handleDoubleTapEvent}
        >

        <div className='_top'>
          <div className='_top-left'></div>
          <div className='_top-center'></div>
          <div className='_top-right'>
            {pictureSnapped && (
              <div className='camera-trash' onClick={deletePicture}>
                <Icons.Camera_Trash />
              </div>
            )}
            {pictureSnapped && (
              <div className='camera-finish' onClick={savePicture}>
                <Icons.Camera_Check />
              </div>
            )}
            {!pictureSnapped && (
              <div className='camera-close' onClick={closePictureModal}>
                {testText}
                <Icons.Camera_Close />
              </div>
            )}
          </div>
        </div>
        <div className='_middle' style={{
  
      }}></div>
        <div className='_bottom' style={{
          pointerEvents: pictureSnapped ? 'none' : 'auto'
        }}>
   
        <div className="controls" style={{
          display: pictureSnapped ? 'none' : 'flex'
        }}>
            <div className="filter-icons allow-scroll" id="filterContainer" ref={filterContainerRef}>
              {

                _gameContext.companyData.assets.filter(asset => asset.assetType == 'filter').concat(_gameContext.globalAssets.filters.filter(asset => asset.assetType == "filter")).map((asset, index) => { 
                  let thumb = asset.assetThumb;
                  let full = asset.assetLocation;
                  let blendAttr = asset.attributes?.find((attr: CompanyDataAssetAttributesModel) => attr.attributeID === 'blend-mode');
                  let blend = SnapHelper.toBlendMode(blendAttr?.attributeValue || '');
                  let showFilter = asset.attributes?.find((attr: CompanyDataAssetAttributesModel) => attr.attributeID === 'show-filter');
                  
                  if(showFilter)
                  {
                    if(showFilter.attributeValue == 'false')
                    {
                      console.log("not showing");
                      full = "";
                    }
                  }
                  return <div className="filter-icon" key={index} onClick={() => specificFilterTapped(index)}>
                    <div className="filter-image" data-blend={blend} data-id={full} style={{
                      backgroundImage: StyleHelper.format_css_url_without_asset(thumb)
                      }}></div>
                    </div>
                }
                )
              }
        
            </div>
            <button className="snap-button" onClick={snappedPicture} id="snapButton"></button>
        </div>
        {pictureSnapped && <SnappedPictureSave />}
          </div>
          
      </div>
    </div>
  )
}

export default SnapPictureModal
