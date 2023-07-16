import React from 'react'
import './GeneralLoadingTemplate.scss';

function GeneralLoadingTemplate(props: any) {
  return (
    <div className='general-loading-template' style={{
       // backgroundImage: `url('/customers/default/images/welcome-background.jpg')`
    }}>
        <div className='logo'></div>
        <div className='body'>{props.children}</div>
        <div className='footer'>PuttPuttGo.net | Copyright 2023</div>
    </div>
  )
}

export default GeneralLoadingTemplate