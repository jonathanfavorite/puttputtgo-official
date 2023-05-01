import React, { useContext, useEffect, useState } from 'react';
import './AssetLoader.scss';
import { CompanyDataAssetModel } from '../../../models/data/CompanyDataModel';
import { GameContext } from '../../../contexts/GameContext';
import '../../../startup/registerServiceWorker';

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
  const _gameContext = useContext(GameContext);
  const [currentText, setCurrentText] = useState<string>("");
  const [currentAssetIndex, setCurrentAssetIndex] = useState<number>(0);

  const [loadedAssetsCount, setLoadedAssetsCount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);


  fetchAndCacheGolfCourseAssets('castle-golf');

  const preloadAsset = async (asset: CompanyDataAssetModel) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
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
      _gameContext.toggleAssetsLoaded(true);
    }, 500);
  };
  
  const getPercentage = (loadedAssets: number, totalAssets: number) => {
    return Math.floor((loadedAssets / totalAssets) * 100);
  }

  useEffect(() => {
    preloadAssets();
  }, []);

  return (
    <div className="asset-loader">
      <div className="text">
        <div className="inner">
          <h1>
            Loading assets: {getPercentage(loadedAssetsCount,_gameContext.companyData.assets.length)}%
          </h1>
        </div>
      </div>
      <div className="progress-bar">
        <div className="inner" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

export default AssetLoader;
