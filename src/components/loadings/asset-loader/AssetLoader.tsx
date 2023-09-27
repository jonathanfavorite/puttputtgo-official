import React, { useContext, useEffect, useRef, useState } from 'react';
import './AssetLoader.scss';
import { CompanyDataAssetModel } from '../../../models/data/CompanyDataModel';
import { GameContext } from '../../../contexts/GameContext';
import '../../../startup/registerServiceWorker';
import { GameAudioContext } from '../../../contexts/GameAudioContext';

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
  const [progress, setProgress] = useState<number>(0);
  const [progressArr, setProgressArr] = useState<number[]>([]);


  fetchAndCacheGolfCourseAssets('castle-golf');

  const preloadAsset = async (asset: CompanyDataAssetModel) => {
  
    if(asset.assetType === "audio") {
      
      return new Promise((resolve, reject) => {
        _audioContext.preload(asset.assetID, asset.assetLocation);
        resolve(null);
      });
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      setCurrentText(asset.assetName);
      img.src = asset.assetLocation;
      img.onload = () => {
        
        resolve(null);
      };
      img.onerror = () => {
        console.warn(`[WARNING] Asset does not exist: ${asset.assetLocation}`);
        resolve(null);
      };
    });
  };

  const preloadAssets = async () => {
    const totalAssets = _gameContext.companyData.assets.length;
  
    const loadPromises = _gameContext.companyData.assets.map((asset, index) => {
      return preloadAsset(asset).then(() => {
        setLoadedAssetsCount((prevCount) => prevCount + 1);
        setProgress(Math.floor(((index + 1) / totalAssets) * 100));
      });
    });
  
    await Promise.all(loadPromises);
  
    setTimeout(() => {
      //_gameContext.toggleAssetsLoaded(true);
    }, 500);
  };


  
  const getPercentage = (loadedAssets: number, totalAssets: number) => {
    return Math.ceil((loadedAssets / totalAssets) * 100);
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const coolTexts = [
    "PuttPuttGO", "Family", "Fun", "Adventure", "Golf",
    "Mini Golf", "Putt Putt Golf", "Mini Golf", "Excitement"
  ];
  
  const textObjects: any[] = [];

  useEffect(() => {
    preloadAssets();

    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("passed");
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log(ctx);

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
      <div className="text">
        <div className="inner">
          <h1>
            Loading assets: {getPercentage(loadedAssetsCount,_gameContext.companyData.assets.length)}%
          </h1>
          <div><small>{currentText}</small></div>
        </div>
      </div>
      <div className="progress-bar">
        <div className="inner" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="footer">PuttPuttGo.net | Copyright 2023</div>
    </div>
  );
}

export default AssetLoader;
