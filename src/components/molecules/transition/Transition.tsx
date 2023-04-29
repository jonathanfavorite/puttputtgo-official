import React, { useContext } from 'react'
import './Transition.scss'
import { TransitionContext } from '../../../contexts/TransitionContext';

function Transition() {

    const always_hidden = false;
    const _transitionContext = useContext(TransitionContext);

  return (
    <div className={`large-transition-wrap ${_transitionContext.animating && !always_hidden ? 'run_animation' : ''}`} ref={_transitionContext.transitionRef}>
    <div className="background"></div>
    <div className="text-wrap">
      {/* <div className='text'>Round<span>2</span></div> */}
      <div className="text text__goodluck">
          <div className="heading">
              <div className="line"></div>
                  <div className="heading_text">{_transitionContext.headingText}</div>
              <div className="line"></div>
          </div>
          <div className="desc">{_transitionContext.descText}</div>
      </div>
    </div>
  </div>
  )
}

export default Transition