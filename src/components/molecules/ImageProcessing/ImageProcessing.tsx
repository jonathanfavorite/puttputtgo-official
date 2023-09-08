import React, { useContext } from 'react'
import './ImageProcessing.scss';
import { GameContext } from '../../../contexts/GameContext';
import SnapModel from '../../../models/snaps/SnapModel';

function ImageProcessing() {
    const _gameContext = useContext(GameContext);

    const [selectedPicture, setSelectedPicture] = React.useState<SnapModel | null>(null);
    const processWrapRef = React.useRef<HTMLDivElement>(null);

    const triggerOutAnimation = () => {
        if(processWrapRef.current)
        {
            processWrapRef.current.classList.add('out');
        }
    }

    const unProcessedPictures = _gameContext.pictures.filter(x => x.processed === false);
    React.useEffect(() => {
        if(_gameContext.pictures.length > 0 && selectedPicture === null)
        {
            let firstUnprocessedPicture = _gameContext.pictures.find(x => x.processed === false);
            if(firstUnprocessedPicture)
            {
                setSelectedPicture(firstUnprocessedPicture);
            }
        }
        let tout : NodeJS.Timeout;
        if(selectedPicture)
        {
            if(selectedPicture.processed)
            {
                if(unProcessedPictures.length > 0)
                {
                    let nextUnprocessedPicture = unProcessedPictures[0];
                    setSelectedPicture(nextUnprocessedPicture);
                }
                else
                {
                    
                    triggerOutAnimation();
                    tout = setTimeout(() => {
                        //setSelectedPicture(null);
                        if(processWrapRef.current)
                        {
                            processWrapRef.current.classList.remove('out');
                            setSelectedPicture(null);
                        }
                    }, 1000);
                }
            }
        }

        return () => {
           if(tout)
           {
                clearTimeout(tout);
           }
        }


    }, [_gameContext.pictures]);

  return (
    <div className='image-processing-wrap' ref={processWrapRef}>
        {selectedPicture && <>
        <div className='thumb-wrap'>
            <div className='thumb' style={{
                backgroundImage: `url(${selectedPicture?.tmp_thumb!})`
            }}></div>
        </div>
        <div className='title'>Saving...</div>
            </>}
    </div>
  )
}

export default ImageProcessing