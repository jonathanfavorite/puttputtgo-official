import React, { Fragment, useContext, useEffect, useRef } from 'react'
import StyleHelper from '../../../../helpers/StyleHelper'
import { GameContext } from '../../../../contexts/GameContext';
import { CourseContext } from '../../../../contexts/CourseContext';
import { PlayerContext } from '../../../../contexts/PlayerContext';
import { TransitionContext } from '../../../../contexts/TransitionContext';

interface IProps {
    holeClickEvent? : (hole: number) => void;
}
function RoundsContainer(props: IProps) {

    const _gameContext = useContext(GameContext);
    const _courseContext = useContext(CourseContext);
    const _playerContext = useContext(PlayerContext);
    const _transitionContext = useContext(TransitionContext);

    const itemRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const handleHoleClickEvent = (hole: number) => {
        if(props.holeClickEvent) {
            props.holeClickEvent(hole);
        }
        _playerContext.updateCurrentPlayer(0);
        _courseContext.updateCurrentHole(hole);

        nextHoleTransitionTexts(hole);
    };

    const nextHoleTransitionTexts = (hole: number) => {
        let nextHole = hole;
        _transitionContext.updateHeadingText(`Round ${nextHole}`);
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
           console.log("real?", real);
            let timeout;
            if (real) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        real!.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                            inline: "center",
                        });
                    });
                });
            }

    }, [_courseContext.getCurrentHole()]);

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
                <div className='hole-label'>Hole</div>
                <div className='hole-items' ref={listRef}>
                    {
                        _courseContext.getCurrentCourse().holes.map((hole, index) => {
                            let isActive = _courseContext.getCurrentHole().number === hole.number;
                            let properBackground = isActive ? _gameContext.getAssetByID('gameplay-round-active-button') : _gameContext.getAssetByID('gameplay-round-button');
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
