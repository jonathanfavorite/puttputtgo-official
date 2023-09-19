import React, { useContext } from 'react'
import './PhoneEntry.scss';
import { Icons } from '../../../atoms/Icons'
import { SignInRegisterScreenPages, SignUpRegisterContext } from '../../../../contexts/SignUpRegisterContext';

interface PhoneEntryProps {
    children?: any;
    disabled?: boolean;
}

enum SigninStates {
    Ready,
    Loading
}

function PhoneEntry(props: PhoneEntryProps) {

    const _signupContext = useContext(SignUpRegisterContext);

    const telRef = React.useRef<HTMLInputElement>(null);

    const handleRawPhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        let formatted = formatPhoneNumber(value);
        _signupContext.updateRawPhoneNumber(value);
        _signupContext.updateFormattedPhoneNumber(formatted);
    }

    function formatPhoneNumber(raw: string) {
        if (raw.length > 10) {
            raw = raw.substring(0, 10); // Limit to 10 digits
        }

        let formatted = '';
        for (let i = 0; i < raw.length; i++) {
            if (i === 0) formatted += '(';
            else if (i === 3) formatted += ') ';
            else if (i === 6) formatted += '-';
            formatted += raw[i];
        }
        return formatted;
    }


  return (
    <div className='enter-number-wrap'>
            <div className='country-picker-wrap'>

                <div className='country-indi selected-country'>
                    <div className='selected__country'>
                        <div className='country-flag'><img src='/global-assets/flags/en.jpg' /></div>
                        
                    </div>
                    <div className='selected__name'>United States (+1)</div>
                    <div className='selected__arrow'><Icons.Back /></div>
                </div>

            </div>

            <div className='number-input-wrap'>
                <div className='number-input'>
                <input 
                disabled={props.disabled}
                type='tel' 
                ref={telRef}
                onChange={handleRawPhoneNumberChange} 
                value={_signupContext.formattedPhoneNumber} 
                placeholder='phone number' 
            />
                </div>
            </div>

            {props.children && <div className='signin-errors'>
            {props.children}
            </div>}



            </div>
  )
}

export default PhoneEntry