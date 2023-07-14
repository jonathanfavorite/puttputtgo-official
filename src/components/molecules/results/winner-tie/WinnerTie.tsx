import React from 'react'
import ConfettiCanvas from '../../../pages/results-screen/confettiCanvas'
import { TrueResults } from '../../../../models/results/ResultModels'
import './WinnerTie.scss'
interface Props {
    results: TrueResults;
}
function WinnerTie(props: Props) {
    return (
        <div className='winner-content'>
            <div className='tie-content-wrap'>
                <ConfettiCanvas/>
                <div className='tie-content'>
                    <div className='way'>{props.results.ties.length} way</div>
                    <div className='title'>tie!</div>
                    <div className='winners'>
                        {
                            props.results.ties.map((tie, index) => {
                                return (
                                    <div className='winner' key={index}>
                                        {tie.player.name}
                                    </div>
                                )
                            })
                        }
                       
                    </div>
                </div>
            </div>

        </div>
    )
}

export default WinnerTie
