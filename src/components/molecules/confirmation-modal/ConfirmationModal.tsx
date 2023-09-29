import React from 'react'
import './ConfirmationModal.scss'

interface ConfirmationModalProps {
    children?: any;
    background?: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}
function ConfirmationModal(props: ConfirmationModalProps) {

    let bothButtons = props.onConfirm && props.onCancel ? 'both-buttons' : 'one-button';

    return (
        <div className='confirmation-popup-modal-wrap'>
            <div className='confirmation-popup-modal'>
                <div className='confirmation-modal-content'>
                {props.children}
                </div>
                <div className='confirmation-modal-buttons'>
                    {props.onConfirm && <ConfirmationModalButton onClick={props.onConfirm} text={props.confirmText ? props.confirmText : 'Confirm'} specifiedClass={`${bothButtons} confirm-button`} />}
                    {props.onCancel && <ConfirmationModalButton onClick={props.onCancel} text={props.cancelText ? props.cancelText : 'Cancel'} specifiedClass={`${bothButtons} cancel-button`} />}
                    {/* {props.onConfirm && <div className='confirmation-modal-button'><button onClick={props.onConfirm}>{props.confirmText ? props.confirmText : 'Confirm'}</button></div>}
                    {props.onCancel && <div className='confirmation-modal-button'><button onClick={props.onCancel}>{props.cancelText ? props.cancelText : 'Cancel'}</button></div>} */}
                </div>
            </div>
        </div>
      )
}

interface ConfirmationModalButtonProps {
    onClick: () => void;
    text: string;
    specifiedClass?: string;
}
function ConfirmationModalButton(props: ConfirmationModalButtonProps) {
    return (
        <div className={`confirmation-modal-button ${props.specifiedClass && props.specifiedClass}`}><button onClick={props.onClick}>{props.text}</button></div>
    )
}

export default ConfirmationModal