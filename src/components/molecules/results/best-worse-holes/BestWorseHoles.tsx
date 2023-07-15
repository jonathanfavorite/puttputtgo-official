import React, {useContext} from 'react'
import './BestWorseHoles.scss';
import {GameContext} from '../../../../contexts/GameContext';
import { BestWorstHole } from '../../../../models/results/ResultModels';

interface Props {
    bestWorstHole: BestWorstHole;
}

function BestWorseHoles(props: Props) {
    const _gameContext = useContext(GameContext);

    return (
        <div className='best-worst-hole-wrap'>
            <div className='left'>
                <div className='inside-content'>
                    <div className='title' dangerouslySetInnerHTML={
                        _gameContext.getTextByID("results:best-hole")
                    }>
                       </div>
                    <div className='large-number best'>
                        {
                        props.bestWorstHole ?. bestHole
                    }</div>
                    <div className='par'>par {
                        props.bestWorstHole ?. bestPar
                    }</div>
                    <div className='group'>
                        {
                        _gameContext.getPlainTextByID("results:group-average")
                    }: {
                        props.bestWorstHole ?. bestAvg
                    }</div>
                </div>
            </div>
            <div className='right'>
                <div className='inside-content'>
                    <div className='title' dangerouslySetInnerHTML={
                        _gameContext.getTextByID("results:worst-hole")
                    }>
                        </div>
                    <div className='large-number worst'>
                        {
                        props.bestWorstHole ?. worstHole
                    }</div>
                    <div className='par'>par {
                        props.bestWorstHole ?. worstPar
                    }</div>
                    <div className='group'>
                        {
                        _gameContext.getPlainTextByID("results:group-average")
                    }: {
                        props.bestWorstHole ?. worstAvg
                    }</div>
                </div>
            </div>
        </div>
    )
}

export default BestWorseHoles
