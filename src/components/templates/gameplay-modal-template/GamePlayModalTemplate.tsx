import React from 'react'
import './GamePlayModalTemplate.scss';

interface GamePlayModalTemplateProps {
    children: any,
    buttonClick1?: () => void,
    buttonClick2?: () => void,
}

function GamePlayModalTemplate(props: GamePlayModalTemplateProps) {
  return <div className='gameplay-modal-template'>
    {props.children}
</div>
  
}

export default GamePlayModalTemplate