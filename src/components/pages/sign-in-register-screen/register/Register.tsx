import React, { useContext } from 'react'
import {Icons} from '../../../atoms/Icons';
import PhoneEntry from '../../../molecules/signin/phone-entry/PhoneEntry';
import { SignInRegisterScreenPages, SignUpRegisterContext } from '../../../../contexts/SignUpRegisterContext';
import PopupModal from '../../../molecules/signin/popup-modal/PopupModal';


enum RegisterStates {
    Phone = 0,
    ValidatingPhone,
    FullName,
    Username,
    Legal,
    Loading,
    Ready
}

interface RegisterItems {
    HasValue: boolean;
    Value: string;
    RegisterState: RegisterStates;
    highlight: boolean;
}
interface AllRegisterItems {
    Phone: RegisterItems;
    FullName: RegisterItems;
    Username: RegisterItems;
    LegalTOS: RegisterItems;
    LegalSMS: RegisterItems;
}

function Register() {
  const _signupContext = useContext(SignUpRegisterContext);
    const [registerState, setRegisterState] = React.useState < RegisterStates > (RegisterStates.Ready);
    const [registerText, setRegisterText] = React.useState < string > ('Next');

    const [showPopup, setShowPopup] = React.useState<boolean>(false);
    const [popupMessage, setPopupMessage] = React.useState<string>('');

    const fullNameContainerRef = React.useRef <HTMLDivElement> (null);
    const usernameContainerRef = React.useRef <HTMLDivElement> (null);
    const legalContainerRef = React.useRef <HTMLDivElement> (null);
    const scrollAbleContainerRef = React.useRef <HTMLDivElement> (null);

    const [showCreateAccountModal, setShowCreateAccountModal] = React.useState < boolean > (false);

    const [formDisabled, setFormDisabled] = React.useState < boolean > (false);
    const [formData, setFormData] = React.useState < AllRegisterItems > ({
        Phone: {
            HasValue: false,
            Value: '',
            RegisterState: RegisterStates.Phone,
            highlight: false
        },
        FullName: {
            HasValue: false,
            Value: '',
            RegisterState: RegisterStates.FullName,
            highlight: false
        },
        Username: {
            HasValue: false,
            Value: '',
            RegisterState: RegisterStates.Username,
            highlight: false
        },
        LegalTOS: {
            HasValue: false,
            Value: '',
            RegisterState: RegisterStates.Legal,
            highlight: false
        },
        LegalSMS: {
          HasValue: false,
          Value: '',
          RegisterState: RegisterStates.Legal,
          highlight: false
      }
    });

    const [phoneGood, setPhoneGood] = React.useState < boolean | null > (null);
    const [fullNameGood, setFullNameGood] = React.useState < boolean | null > (null);
    const [usernameGood, setUsernameGood] = React.useState < boolean | null > (null);

    const scrollToRef = (ref: React.RefObject < HTMLDivElement > ) => {
        if (ref.current) {
            scrollAbleContainerRef.current?.scrollTo({
                top: ref.current.offsetTop,
                behavior: 'smooth'
            });
        }
    }

    const validatePhone = async () => {
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/Auth/VerifyPhoneNumber`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  phoneNumber: _signupContext.rawPhoneNumber
              })
          });
  
          const data = await response.json();
          console.log(data);
          return {success: data.success, message: data.message};
      } catch (error) {
          console.error('Error:', error);
          return {success: false, message: 'An error occurred while validating phone number'};
      }
  }

  const showHightlight = (key: keyof AllRegisterItems) => {
    let newFormData = {
      ...formData
  };
  console.log("key: ", newFormData[key].Value);
  newFormData[key].highlight = true;
  // console.log(value);
  setFormData(old => newFormData);
  }

  
  const handleRegisterClick = async () => {

    if(!formData.FullName.HasValue)
    {
      showHightlight("FullName");
      scrollToRef(fullNameContainerRef);
      return;
    }
    else if(!formData.Username.HasValue)
    {
      showHightlight("Username");
      scrollToRef(usernameContainerRef);
      return;
    }
    else if(!formData.LegalTOS.HasValue)
    {
      showHightlight("LegalTOS");
      scrollToRef(legalContainerRef);
      return;
    }
    else if(!formData.LegalSMS.HasValue)
    {
      showHightlight("LegalSMS");
      scrollToRef(legalContainerRef);
      return;
    }
    else
    {
      
      if (registerState === RegisterStates.Loading || registerState == RegisterStates.ValidatingPhone) return;
  
      if (registerState === RegisterStates.Ready) {
          if (!_signupContext.rawPhoneNumber || _signupContext.rawPhoneNumber.length < 10) {
            setPopupMessage('Please enter a valid phone number');
              setShowPopup(true);
              
              return;
          }
  
          setFormDisabled(true);

          setRegisterState(RegisterStates.Loading);
          setRegisterText("checking number...");
  
          const isPhoneValid = await validatePhone();
          if (isPhoneValid.success) {
              setPhoneGood(true);
              setRegisterState(RegisterStates.Ready);
              setRegisterText("creating account...");
              setShowCreateAccountModal(true);
              await CreateAccount();
              // Handle the next steps after phone validation here
          } else {
              setPhoneGood(false);
              alert(isPhoneValid.message);
              setRegisterState(RegisterStates.Ready);
              setRegisterText("Next");
              setFormDisabled(false);
              // Handle invalid phone number scenario here
          }
  
          return;
      }
  
      
      console.log("data: ", formData);
    }
  }

  const CreateAccount = async () => {
    let payload = {
      phoneNumber: _signupContext.rawPhoneNumber,
      name: formData.FullName.Value,
      username: formData.Username.Value
    };
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Auth/RegisterByPhone`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
      });

      const data = await response.json();
      let success = data.success;
      let message = data.message;
      let userID = data.userID;
      let responseType = data.responseType;
      console.log("CREATED ACCOUNT: " + [success, message, userID, responseType]);

      enum ResponseTypes {
        Success = 0,
        AlreadyInUse,
        InvalidPhoneNumber
      }

      if(success)
      {
        if(responseType == ResponseTypes.Success)
        {
          _signupContext.updateCurrentScreen(SignInRegisterScreenPages.CodeWaiter);
        }
        else
        {
          alert(message);
          setFormDisabled(false);
          setShowCreateAccountModal(false);
        }
       
      }



      //return {success: data.success, message: data.message};
  } catch (error) {
      console.error('Error:', error);
      //return {success: false, message: 'An error occurred while validating phone number'};
  }

  };

    const updateFormData = (key: keyof AllRegisterItems, value: string) => {
        let newFormData = {
            ...formData
        };
        newFormData[key].Value = value;
        newFormData[key].HasValue = value.length > 0;
        if(value != "")
        {
          newFormData[key].highlight = false;
        }

        setFormData(old => newFormData);
    }

    const modelClosed = () => {
      setShowPopup(false);
  }

    return (
        <div className='register-wrap'>

{showPopup && <PopupModal onClose={modelClosed}>{popupMessage}</PopupModal> }

          {showCreateAccountModal && <div className='creating-account-modal'>
            <div className='__content'>
            <div className='loading-spinner'><Icons.Gallery_Spinner/></div>
              <div className='text'>creating account</div>
            </div>
          </div>}

            <div className='register-top'>
            
                <div className='register-scrollable allow-scroll'>
                    <div className='register-scrollable-inside' ref={scrollAbleContainerRef}>
                    <div className='register-welcome'>
                    <h1>register</h1>
                </div>
                    
                      <div className='ref-phone-entry'>
                      {/* <h2>enter your phone</h2> */}
                        <PhoneEntry disabled={formDisabled}>
                        {/* <div className='signin-error cant-find-account'>this phone number not associated with an account, would you like to <span>create one</span> instead?</div> */}
                        </PhoneEntry>
                     </div>

                    <div className='ref-details-wrap refItem' ref={fullNameContainerRef} style={{
                        
                    }}>
                        <div className='ref-details'>
                          {/* <h2>what is your full name?</h2> */}
                          <div className='ref-details-input'>
                              <input type='text' placeholder='full name' disabled={formDisabled} className={`${formData.FullName.highlight ? 'validation-error' : ''}`} onChange={(e) => updateFormData("FullName", e.target.value)} />
                          </div>
                        </div>
                    </div>

                    <div className='ref-details-wrap refItem' ref={usernameContainerRef} style={{
                       
                    }}>
                        <div className='ref-details'>
                          {/* <h2>pick a username</h2> */}
                          <div className='ref-details-input'>
                              {/* <div className='checked-wrap'>
                                <Icons.Camera_Check />
                              </div> */}
                              <input type='text' placeholder='username' disabled={formDisabled} className={`${formData.Username.highlight ? 'validation-error' : ''}`} onChange={(e) => updateFormData("Username", e.target.value)} />
                          </div>
                        </div>
                    </div>

                    <div className='ref-legal-wrap' ref={legalContainerRef} style={{
                       
                    }}>
                        <div className='ref-legal'>
                          <div className='checkboxes-wrap'>
                <div className='checkbox'>
                    <label>
                    <div className='checkbox__input'>
                        <input type='checkbox' disabled={formDisabled} className={`${formData.LegalTOS.highlight ? 'validation-error' : ''}`} onChange={(e) => updateFormData("LegalTOS", e.target.checked ? 'true' : 'false')}  />
                    </div>
                    <div className='checkbox__label'>I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span></div>
                    </label>
                </div>

                <div className='checkbox'>
                    <label>
                    <div className='checkbox__input'>
                        <input type='checkbox' disabled={formDisabled} className={`${formData.LegalSMS.highlight ? 'validation-error' : ''}`}  onChange={(e) => updateFormData("LegalSMS", e.target.checked ? 'true' : 'false')} />
                    </div>
                    <div className='checkbox__label'>tick this box to opt-in to receive SMS text messages from puttputtgo.
Standard rates and data may apply. Reply STOP to opt out.</div>
                    </label>
                </div>

            </div>
                          </div>
                    </div>

                    </div>
                </div>
            </div>
            <div className='register-bottom'>
                <div className='register-button'
                  // id={signinState === SigninStates.Ready ? 'disabledBtn' : ''}
                    onClick={handleRegisterClick}>
                    {
                    (registerState !== RegisterStates.Loading) ? registerText : <>
                        <div className='loading-spinner-wrap'>
                            <div className='loading-spinner'><Icons.Gallery_Spinner/></div>
                            <div className='loading-text'>{registerText}</div>
                        </div>
                    </>
                } </div>
            </div>
        </div>
    )
}

export default Register
