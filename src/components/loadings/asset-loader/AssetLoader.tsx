import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import './AssetLoader.scss';
import { CompanyDataAssetModel } from '../../../models/data/CompanyDataModel';
import { GameContext } from '../../../contexts/GameContext';
import '../../../startup/registerServiceWorker';
import { GameAudioContext } from '../../../contexts/GameAudioContext';
import { GlobalAssetsModel } from '../../../models/data/GlobalAssetsModel';

interface IProps {}

interface Asset {
  assetType: string;
  assetID: string;
  assetName: string;
  assetLocation: string;
}

async function fetchAndCacheGolfCourseAssets(customerID: string): Promise<void> {
  const response = await fetch(`/customers/${customerID}/data.json`);
  const data = await response.json();
  const assets = data.assets.map((asset: Asset) => asset.assetLocation);
  await navigator.serviceWorker.ready;
  const registration = await navigator.serviceWorker.getRegistration();
  registration!.active!.postMessage({
    type: 'CACHE_ASSETS',
    customerID: customerID,
    assets: assets,
  });
}


function AssetLoader(props: IProps) {
  const _audioContext = useContext(GameAudioContext);
  const _gameContext = useContext(GameContext);
  const [currentText, setCurrentText] = useState<string>("");
  const [currentAssetIndex, setCurrentAssetIndex] = useState<number>(0);

  const [loadedAssetsCount, setLoadedAssetsCount] = useState<number>(0);
  const [combinedAssetCount, setCombinedAssetCount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [progressArr, setProgressArr] = useState<number[]>([]);
  const tmpInMemoryAssetsRef = useRef<{ [key: string]: string }>({});


  fetchAndCacheGolfCourseAssets('castle-golf');

  const preloadAsset = async (asset: CompanyDataAssetModel) => {
  

    


    if(asset.assetType === "audio") {
      
      return new Promise((resolve, reject) => {
        _audioContext.preload(asset.assetID, asset.assetLocation);
        resolve(null);
      });
    }
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', asset.assetLocation, true);
      xhr.responseType = 'blob';
      xhr.onload = function() {
          const reader = new FileReader();
          reader.readAsDataURL(xhr.response);
          reader.onloadend = function() {
              const base64data = reader.result as string;
              // add to tmp in memory assets
              tmpInMemoryAssetsRef.current[asset.assetID] = base64data;

             // console.log("tmpInMemoryAssets", tmpInMemoryAssets);
              //inMemoryAssets[asset.assetID] = base64data;
              resolve(null);
          }
      };
      xhr.onerror = () => {
          console.warn(`[WARNING] Asset does not exist: ${asset.assetLocation}`);
          resolve(null);
      };
      xhr.send();
  });
  };

  const [showReadyButton, setShowReadyButton] = useState<boolean>(false);

  const preloadAssets = async () => {
    const globalAssetsList: CompanyDataAssetModel[] = [
      ..._gameContext.globalAssets.flags,
      ..._gameContext.globalAssets.filters,
    ];

    const totalCompanyAssets = _gameContext.companyData.assets.length;
    const totalAssets = totalCompanyAssets + globalAssetsList.length;

    setCombinedAssetCount(totalAssets);

    const loadPromises = _gameContext.companyData.assets.map((asset, index) => {
      return preloadAsset(asset).then(() => {
        setLoadedAssetsCount((prevCount) => prevCount + 1);
        setCurrentText(old => asset.assetName);
        setProgress(Math.floor(((index + 1) / totalAssets) * 100));
      });
    });

    const loadGlobalAssetsPromises = globalAssetsList.map((asset, index) => {
      return preloadAsset(asset).then(() => {
        setCurrentText(old => asset.assetName);
        setLoadedAssetsCount((prevCount) => prevCount + 1);
        setProgress(Math.floor(((index + 1) / totalAssets) * 100));
      });
    });

    await Promise.all([...loadPromises, ...loadGlobalAssetsPromises]).then(handleSetInMemoryAssets);

   

    setTimeout(() => {
      _gameContext.toggleAssetsLoaded(true);
      //setShowReadyButton(true);
    }, 500);
  };

  const readyButtonTapped = () => {
    _gameContext.toggleAssetsLoaded(true);
    if(_audioContext.welcomeScreenSong.element)
    {
        
      if(!_audioContext.welcomeScreenSong.playing)
      {
        _audioContext.welcomeScreenSong.element.play();
      }
    }
  }

  const handleSetInMemoryAssets = () => {
    _gameContext.setAllInMemoryAssetItems(tmpInMemoryAssetsRef.current);

  }


  
  const getPercentage = (loadedAssets: number, totalAssets: number) => {
    return Math.ceil((loadedAssets / totalAssets) * 100);
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
const coolTexts = [
    "Hello",       // English
    "Hola",        // Spanish
    "Bonjour",     // French
    "Hallo",       // German
    "Ciao",        // Italian
    "Olá",         // Portuguese
    "Привет",      // Russian
    "你好",         // Chinese (Simplified)
    "こんにちは",   // Japanese
    "안녕하세요",    // Korean
    "Hej",         // Swedish
    "Hei",         // Norwegian
    "Hej",         // Danish
    "Tere",        // Estonian
    "Γειά σας",    // Greek
    "Merhaba",     // Turkish
    "שָׁלוֹם",     // Hebrew
    "مرحبا",       // Arabic
    "नमस्ते",      // Hindi
    "สวัสดี",      // Thai
    "Xin chào",    // Vietnamese
    "Selamat",     // Malay/Indonesian
    "Kumusta",     // Filipino
    "Dzien dobry", // Polish
    "Ahoj"         // Czech
];
  
  const textObjects: any[] = [];

  useEffect(() => {
    preloadAssets();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up the canvas dimensions and scaling
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    let amount = 150;
    for(let i = 0; i < amount; i++) {
      let word = coolTexts[Math.floor(Math.random() * coolTexts.length)];
      textObjects.push({
        value: word,
        x: Math.random() * canvas.width,
        y: 200 + Math.random() * canvas.height,
        speed: 1 + Math.random() * 1  // Random speed between 1 and 3
      });
    }
    

    ctx.fillStyle = '#ffffff';
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      textObjects.forEach(textObj => {
        // fill text with font size
        ctx.font = 'bold 30px Arial';
        ctx.fillText(textObj.value, textObj.x, textObj.y);
        textObj.y -= textObj.speed;
        ctx.fillStyle = '#333';
        if (textObj.y < 0) {
          textObj.y = canvas.height;
          textObj.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

  }, []);

  return (
    <div className="asset-loader">
       <canvas className='cool-background-canvas' ref={canvasRef}></canvas>
       <div className='top-spot'></div>
       <div className='middle-spot'>
        {showReadyButton &&
      <div className='start-button-wrap'>
        <div className='start-button' onClick={readyButtonTapped}>ENTER</div>
      </div>
      }
      {!showReadyButton && <Fragment>
       <div className="text">
        <div className="inner">
          <h1>
            Loading assets: {getPercentage(loadedAssetsCount,combinedAssetCount)}%
          </h1>
          <div><small>{currentText}</small></div>
        </div>
      </div>
      <div className="progress-bar">
        <div className="inner" style={{ width: `${getPercentage(loadedAssetsCount,combinedAssetCount)}%` }}></div>
      </div>
      </Fragment>}
       </div>
     
      
      <div className="footer-spot">PuttPuttGo.net | Copyright 2023</div>
    </div>
  );
}

export default AssetLoader;
