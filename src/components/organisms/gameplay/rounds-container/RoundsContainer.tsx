import React, { Fragment, useContext, useEffect, useRef } from 'react'
import StyleHelper from '../../../../helpers/StyleHelper'
import { GameContext } from '../../../../contexts/GameContext';
import { CourseContext } from '../../../../contexts/CourseContext';
import { PlayerContext } from '../../../../contexts/PlayerContext';
import { TransitionContext } from '../../../../contexts/TransitionContext';
import { ScoreContext } from '../../../../contexts/ScoreContext';

interface IProps {
    holeClickEvent? : (hole: number) => void;
}
function RoundsContainer(props: IProps) {

    const _gameContext = useContext(GameContext);
    const _courseContext = useContext(CourseContext);
    const _playerContext = useContext(PlayerContext);
    const _transitionContext = useContext(TransitionContext);
    const _scoreContext = useContext(ScoreContext);

    const itemRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const handleHoleClickEvent = (hole: number) => {
        if(props.holeClickEvent) {
            props.holeClickEvent(hole);
        }
        _playerContext.updateCurrentPlayer(0);
        _courseContext.updateCurrentHole(hole);
        //_gameContext.saveToLocalStorage();

        //console.log(_courseContext.getCurrentHole().number);

        nextHoleTransitionTexts(hole);
    };

    const nextHoleTransitionTexts = (hole: number) => {
        let nextHole = hole;
        _transitionContext.updateHeadingText(`${_gameContext.getPlainTextByID("gameplay:hole")} ${nextHole}`);
        _transitionContext.updateDescText(``);
    };

    function getCorrectChild(n: number) {
        let real = null;
        if (itemRef.current && listRef.current) {
            for (let i = 0; i < listRef.current.children.length; i++) {
                if (
                    parseInt(
                        listRef.current.children[i].getAttribute("data-id")!
                    ) ===
                    n - 1
                ) {
                    real = listRef.current.children[i];
                    break;
                }
            }
        }
        return real;
    }

    useEffect(() => {
            //console.log("THIS IS BEFORE REAL");
            let real = getCorrectChild(_courseContext.getCurrentHole().number);
            let timeout;
            if (real) {
                //console.log("REAL");
                // requestAnimationFrame(() => {
                //     requestAnimationFrame(() => {
                //         real!.scrollIntoView({
                //             behavior: "smooth", 
                //             block: "center",
                //             inline: "center",
                //         });
                //     });
                // });

                setTimeout(() => {
                    real!.scrollIntoView({
                        behavior: "smooth", 
                        block: "center",
                        inline: "center",
                    });
                }, 200); // adjust delay as needed
            }

    }, [_courseContext.getCurrentHole().number]);

    return (
        <div className='rounds-container'
            style={
                {
                    backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-round-background'))
                }
        }>
            <div className='left-cap'
                style={
                    {
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-round-left-cap'))
                    }
            }></div>
            <div className='center'>
                <div className='hole-label'>{_gameContext.getPlainTextByID("gameplay:hole")}</div>
                <div className='hole-items'  ref={listRef}>
                    {
                        _courseContext.getCurrentCourse().holes.map((hole, index) => {
                            let isActive = _courseContext.getCurrentHole().number === hole.number;
                            let hasAnyoneScoredOnThisHole  = _scoreContext.hasAnyPlayerPlayedThisHole(hole.number);
                            let properBackground = isActive ? _gameContext.getAssetByID('gameplay-round-active-button') : _gameContext.getAssetByID('gameplay-round-button');
                            let playersReminingWhoHaveNotScored = 0;
                            let showComplete = false;
                            let showWarning = false;
                            let icon = null;
                            if(hasAnyoneScoredOnThisHole || _courseContext.getCurrentHole().number > hole.number) {
                                playersReminingWhoHaveNotScored = _scoreContext.hasEveryPlayerPlayedThisHole(hole.number).length;
                                if(playersReminingWhoHaveNotScored === 0) {
                                    showComplete = true;
                                }
                                else{
                                    showWarning = true;
                                }
                            }
                            else {
                                if(_courseContext.getCurrentHole().number === hole.number) {
                                    //showWarning = true;
                                }
                            }


                            if(showComplete || showWarning) {
                                if(showComplete) {
                                    icon = _gameContext.getAssetByID('completed-hole');
                                }
                                else{
                                    icon = _gameContext.getAssetByID('incomplete-hole');
                                }
                            }
                            else {
                            }
                            

                            return (
                                <div
                                ref={itemRef}
                                data-id={index}
                              
                                className={`hole-item ${_courseContext.getCurrentHole().number === hole.number ? 'active-hole' : ''}`}
                                    key={index}
                                    onClick={() => handleHoleClickEvent(hole.number)}
                                    style={
                                        {
                                            backgroundImage: StyleHelper.format_css_url(properBackground)
                                        }
                                }>
                                        
                                    {
                                        <Fragment>
                                            <div className='hole-status' style={{
                                                backgroundImage: StyleHelper.format_css_url(icon)
                                            }}>
                                                {/* {hasAnyoneScoredOnThisHole ? "yes" : "no" } {playersReminingWhoHaveNotScored} */}
                                            </div>
                                        <span>{hole.number}</span>
                                        <div className='par'>par <b>{hole.par}</b></div>
                                        </Fragment>
                                }</div>
                            )
                        })
                    
                } </div>
            </div>
            <div className='right-cap'
                style={
                    {
                        backgroundImage: StyleHelper.format_css_url(_gameContext.getAssetByID('gameplay-round-right-cap'))
                    }
            }></div>
        </div>
    )
}

export default RoundsContainer