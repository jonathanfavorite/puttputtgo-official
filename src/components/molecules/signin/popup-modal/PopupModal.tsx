import React from 'react';
import './PopupModal.scss';
interface PopupModalProps {
    children?: any;
    background?: string;
    closeText?: string;
    onClose?: () => void;
}
function PopupModal(props: PopupModalProps) {
  return (
    <div className='signin-popup-modal-wrap'>
        <div className='signin-popup-modal'>
            <div className='modal-content'>
            {props.children}
            </div>
            <div className='modal-button'>
                <button onClick={props.onClose}>{props.closeText ? props.closeText : 'Close'}</button>
            </div>
        </div>
    </div>
  )
}

export default PopupModal